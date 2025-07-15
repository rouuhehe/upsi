// MessageArea.tsx
import ReactMarkdown from "react-markdown";
import { useSessionMessages } from "../../message/hooks/useSessionMessages";
import clsx from "clsx";
import { useEffect, useRef, useState, useMemo } from "react";
import { useUserSessions } from "../hooks/useUserSessions";
import { createSessionIfNeeded } from "../services/createSessionIfNeeded";
import type { MessageResponse } from "../../message/types/MessageResponse";
import { apiClient, wrap } from "../../utils/api";
import { Avatar } from "../../image/components/Avatar";
import { useCurrentUser } from "../../user/hooks/useCurrentUser";
import { Mic, Square, X, FileText, Image as ImageIcon } from "lucide-react";
import { createRecorder } from "../../utils/audio";
import { ResultAsync } from "neverthrow";

interface MessageAreaProps {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
}

export type RecorderSuccess = {
  stop: () => ResultAsync<Blob, Error>;
};

interface FilePreview {
  file: File;
  url: string;
  type: "image" | "pdf";
}

interface ExtendedMessageResponse extends MessageResponse {
  type?: "text" | "file";
  fileUrl?: string;
  fileName?: string;
}

export default function MessageArea(props: MessageAreaProps) {
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [localMessages, setLocalMessages] = useState<ExtendedMessageResponse[]>(
    []
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<RecorderSuccess | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);

  const { refetch: refetchSessions } = useUserSessions();
  const { messages, refetch: refetchMessages } = useSessionMessages(
    props.sessionId
  );

  const allMessages = useMemo(() => {
    const messagesList: (MessageResponse | ExtendedMessageResponse)[] = [
      ...(messages ?? []),
      ...localMessages.filter(
        (localMsg) =>
          !(messages ?? []).some(
            (msg) =>
              msg.content === localMsg.content && msg.role === localMsg.role
          )
      ),
    ];
    return messagesList;
  }, [messages, localMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [allMessages]);

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview.url);
      }
    };
  }, [filePreview]);

  const handleSend = async () => {
    if (loading || (!prompt.trim() && !filePreview)) return;

    setLoading(true);

    if (filePreview) {
      await handleUploadFile(filePreview.file);
      setFilePreview(null);
    }

    if (prompt.trim()) {
      const newMessage: ExtendedMessageResponse = {
        id: `temp`,
        role: "USER",
        content: prompt,
        createdAt: new Date().toISOString(),
        type: "text",
      };

      setLocalMessages((prev) => [...prev, newMessage]);
      setPrompt("");

      await createSessionIfNeeded(props.sessionId, props.setSessionId)
        .andThen((validSessionId) =>
          wrap(
            apiClient.sendPromptBySessionId({
              params: { id: validSessionId },
              body: { prompt },
            })
          )
        )
        .match(
          () => {
            refetchSessions();
            refetchMessages();
            setLocalMessages([]);
            setLoading(false);
          },
          (error) => {
            console.error("Error en sesión o envío de prompt:", error);
            setLoading(false);
            setLocalMessages((prev) =>
              prev.filter((msg) => msg.id !== newMessage.id)
            );
          }
        );
    } else {
      setLoading(false);
    }
  };

  const handleStartRecording = async () => {
    const result = await createRecorder();
    result.match(
      (rec) => {
        setRecorder(rec);
        setIsRecording(true);
        setRecordingTime(0);
        timerRef.current = setInterval(() => {
          setRecordingTime((t) => {
            if (t >= 180) {
              handleStopRecording();
              return t;
            }
            return t + 1;
          });
        }, 1000);
      },
      (e) => console.error("Error al iniciar grabación:", e)
    );
  };

  const handleStopRecording = async () => {
    if (!recorder) return;
    clearInterval(timerRef.current!);
    setIsRecording(false);
    setRecordingTime(0);

    const stopResult = await recorder.stop();
    stopResult
      .asyncAndThen((audioBlob) => {
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");
        return wrap<{ text: string }>(
          apiClient.uploadAudio({ body: formData })
        );
      })
      .match(
        (res) => setPrompt(res.text),
        (err) => console.error("Error al subir audio:", err)
      );
  };

  const handleUploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    const uploadFn = isImage
      ? apiClient.uploadOcrImage
      : isPdf
        ? apiClient.uploadOcrPdf
        : null;

    if (!uploadFn) return;

    await wrap(uploadFn({ body: formData })).match(
      (text) => {
        const fileUrl = URL.createObjectURL(file);
        const fileMsg: ExtendedMessageResponse = {
          id: `file-${Date.now()}`,
          role: "USER",
          content: text,
          createdAt: new Date().toISOString(),
          type: "file",
          fileUrl,
          fileName: file.name,
        };
        setLocalMessages((prev) => [...prev, fileMsg]);
      },
      (err) => console.error("Error al subir archivo:", err)
    );
  };

  const handleFileSelect = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    if (!isImage && !isPdf) return;

    const url = URL.createObjectURL(file);
    setFilePreview({
      file,
      url,
      type: isImage ? "image" : "pdf",
    });
  };

  const removeFilePreview = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview.url);
      setFilePreview(null);
    }
  };

  return (
    <div className="relative h-full flex flex-col overflow-hidden pt-14 md:pt-0">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "var(--c-chat-bg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: "var(--c-chat-bg-opacity)",
        }}
      />
      <div className="bg-white/10 absolute inset-0 backdrop-blur-sm z-0 pointer-events-none" />

      <div className="md:mt-14 lg:mt-14 relative z-10 flex-1 flex flex-col justify-between min-h-0">
        <div className="flex-1 overflow-y-auto px-2 md:px-4 pt-4 space-y-4 scroll-smooth">
          {allMessages.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-start pt-24 md:pt-40 text-[var(--c-text)] space-y-6 z-50 pointer-events-none">
              <h1 className="font-helvetica font-extrabold text-5xl md:text-6xl scale-x-105">
                LegalCheck
              </h1>
              <p className="text-base md:text-xl">¿Cómo puedo ayudarte?</p>
            </div>
          )}

          {allMessages.map((msg) => (
            <div
              key={msg.id}
              className={clsx("flex items-end", {
                "justify-end": msg.role === "USER",
                "justify-start": msg.role !== "USER",
              })}
            >
              {msg.role === "ASSISTANT" && (
                <img
                  src="/assets/assistant-profile.png"
                  alt="Bot"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-2"
                />
              )}
              <div
                className={`max-w-[85%] md:max-w-[70%] px-4 py-1.5 mr-2 rounded-2xl ${msg.role === "USER" ? "ml-auto bg-[var(--c-chat-bubble)]" : "bg-[var(--c-chat-bubble)]/90 backdrop-blur-sm"}`}
              >
                {"type" in msg && msg.type === "file" ? (
                  <div className="p-2 space-y-2">
                    <div className="text-xs text-[var(--c-text)]/60">
                      Archivo enviado:{" "}
                      <strong>
                        {(msg as ExtendedMessageResponse).fileName}
                      </strong>
                    </div>
                    {(msg as ExtendedMessageResponse).fileUrl?.endsWith(
                      ".pdf"
                    ) ? (
                      <div className="w-full border rounded bg-white h-16 flex items-center justify-center text-xs text-gray-500 italic">
                        PDF subido
                      </div>
                    ) : (
                      <img
                        src={(msg as ExtendedMessageResponse).fileUrl}
                        alt={(msg as ExtendedMessageResponse).fileName}
                        className="max-w-xs rounded border"
                      />
                    )}
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-full p-2 text-[var(--c-text)]/80">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
              {msg.role === "USER" && (
                <Avatar size="xs" fallback={user?.firstName.charAt(0) || "U"} />
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="relative z-20 mb-4 px-4 md:px-16 mt-auto">
          {/* Preview de archivo */}
          {filePreview && (
            <div className="mb-3 p-3 bg-[var(--c-chat-bubble)] rounded-xl border border-[var(--c-text)]/10">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {filePreview.type === "image" ? (
                    <div className="relative">
                      <img
                        src={filePreview.url}
                        alt={filePreview.file.name}
                        className="w-10 h-10 object-cover rounded-lg border"
                      />
                      <div className="absolute -top-1 -right-2 bg-[var(--c-text)] text-[var(--c-bg)] rounded-full p-1">
                        <ImageIcon className="w-3 h-3" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-16 h-16 bg-red-100 rounded-lg border flex items-center justify-center">
                        <FileText className="w-8 h-8 text-red-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1">
                        <FileText className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--c-text)] truncate">
                        {filePreview.file.name}
                      </p>
                      <p className="text-xs text-[var(--c-text)]/60">
                        {(filePreview.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={removeFilePreview}
                      className="text-[var(--c-text)]/60 hover:text-red-500 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 bg-[var(--c-chat-bubble)] rounded-2xl px-4 shadow py-3">
            {isRecording ? (
              <div className="flex-1 py-2">
                <div ref={waveformRef} className="w-full h-16 bg-transparent" />
              </div>
            ) : (
              <textarea
                rows={1}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 py-2 md:py-3 bg-transparent outline-none resize-none text-sm text-[var(--c-text)]"
                placeholder="Escriba su consulta legal aquí..."
              />
            )}

            {isRecording ? (
              <button
                onClick={handleStopRecording}
                className="text-red-600 hover:text-red-500 transition"
                title="Detener grabación"
              >
                <Square className="w-5 h-5 animate-pulse" />
              </button>
            ) : (
              <button
                onClick={handleStartRecording}
                className="text-[var(--c-text)] hover:text-[var(--c-text)]/70 transition"
                title="Grabar audio"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}

            <label htmlFor="upload-file" className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[var(--c-text)] hover:text-[var(--c-text)]/70 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12"
                />
              </svg>
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              hidden
              id="upload-file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />

            <button
              onClick={handleSend}
              disabled={loading || (!prompt.trim() && !filePreview)}
              className="bg-[var(--c-text)] text-[var(--c-bg)] p-2 rounded-full px-3 hover:bg-[var(--c-text)]/80 transition disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>

          {isRecording && (
            <div className="text-center text-[var(--c-text)] text-xs mt-2 animate-pulse">
              Grabando... {recordingTime}s
            </div>
          )}

          <div className="text-center text-[var(--c-text)] text-xs mt-2">
            Esta IA no reemplaza a un abogado. Consulta con un profesional antes
            de tomar decisiones legales.
          </div>
        </div>
      </div>
    </div>
  );
}
