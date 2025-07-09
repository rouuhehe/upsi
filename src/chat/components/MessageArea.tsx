import ReactMarkdown from "react-markdown";
import { useSessionMessages } from "../../message/hooks/useSessionMessages";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useUserSessions } from "../hooks/useUserSessions";
import { sendPromptBySessionId } from "../services/sendPromptBySessionId";
import { createSessionIfNeeded } from "../services/createSessionIfNeeded";
import type {
  MessageResponse,
  MessageResponseArray,
} from "../../message/types/MessageResponse";

interface MessageAreaProps {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
}

export default function MessageArea(props: MessageAreaProps) {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [localMessages, setLocalMessages] = useState<MessageResponseArray>([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { refetch: refetchSessions } = useUserSessions();
  const { messages, refetch: refetchMessages } = useSessionMessages(
    props.sessionId,
  );

  const allMessages = [...(messages ?? []), ...localMessages];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [allMessages]);

  const handleSend = async () => {
    if (loading || !prompt.trim()) return;

    setLoading(true);

    const newMessage: MessageResponse = {
      id: `temp`,
      role: "USER",
      content: prompt,
      createdAt: new Date().toISOString(),
    };

    setLocalMessages((prev) => [...prev, newMessage]);
    setPrompt("");

    await createSessionIfNeeded(props.sessionId, props.setSessionId)
      .andThen((validSessionId) =>
        sendPromptBySessionId(validSessionId, prompt),
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
            prev.filter((msg) => msg.id !== newMessage.id),
          );
        },
      );
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

      <div className="md:mt-14 lg:mt-14  relative z-10 flex-1 flex flex-col justify-between min-h-0">
        <div className="flex-1 overflow-y-auto px-2 md:px-4 pt-4 space-y-4 scroll-smooth">
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
                className={`max-w-[85%] md:max-w-[70%] px-4 py-2 rounded-2xl ${
                  msg.role === "USER"
                    ? "ml-auto bg-[var(--c-chat-bubble)]"
                    : "bg-[var(--c-chat-bubble)]/90 backdrop-blur-sm"
                }`}
              >
                <div className=" prose prose-sm max-w-full p-2 text-[var(--c-text)]/80">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
              {msg.role === "USER" && (
                <img
                  src="/assets/user-profile.jpg"
                  alt="Usuario"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full ml-2"
                />
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-end justify-start">
              <img
                src="/assets/assistant-profile.png"
                alt="Bot"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-2"
              />
              <div className="max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-xl bg-[var(--c-chat-bubble)]/80 backdrop-blur-sm text-[var(--c-text)]">
                <div className="flex space-x-1 px-1 py-1">
                  <span className="w-1.5 h-1.5 bg-[var(--c-text)]/80 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[var(--c-text)]/80 rounded-full animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 bg-[var(--c-text)]/80 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {!messages && (
          <div className="absolute inset-0 flex flex-col items-center justify-start pt-24 md:pt-40 text-[var(--c-text)] space-y-6 z-50 pointer-events-none">
            <h1 className="font-helvetica font-extrabold text-4xl md:text-6xl scale-x-105">
              LegalCheck
            </h1>
            <p className="text-base md:text-xl">¿Cómo puedo ayudarte?</p>
          </div>
        )}

        <div className="relative z-20 mb-4 px-4 md:px-16 mt-auto">
          <div className="flex items-center gap-2 bg-[var(--c-chat-bubble)] rounded-2xl px-4 shadow py-3">
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
            <button
              onClick={handleSend}
              disabled={loading || !prompt.trim()}
              className="bg-[var(--c-text)] text-[var(--c-bg)] p-2 rounded-full px-3 hover:bg-[var(--c-text)]/80 transition"
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
          <div className="text-center text-[var(--c-text)] text-xs mt-2">
            Esta IA no reemplaza a un abogado. Consulta con un profesional antes
            de tomar decisiones legales.
          </div>
        </div>
      </div>
    </div>
  );
}