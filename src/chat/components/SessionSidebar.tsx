import { Trash2 } from "lucide-react";
import { useUserSessions } from "../hooks/useUserSessions";
import clsx from "clsx";
import type { SessionResponse } from "../types/SessionResponse";

interface SessionSidebarProps {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  setSessionToDelete: (session: SessionResponse | null) => void;
}

export default function SessionSidebar(props: SessionSidebarProps) {
  const { sessions, isLoading } = useUserSessions();

  return (
    <div className="w-60 h-screen flex flex-col  bg-[var(--c-bg)]">
      <div className="px-6 mt-10">
        <button
          onClick={() => props.setSessionId(null)}
          className=" cursor-pointer mt-10 w-full mb-8 bg-sky-400 hover:bg-sky-500 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Nuevo Chat</span>
        </button>

        <div className="text-[var(--c-text)]/40 mt-10 text-sm font-semibold">
          Historial de chats:
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 text-sm space-y-1 text-[var(--c-text)]">
        {isLoading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <ul>
            {sessions
              ?.filter((session) => session.title)
              .map((session) => (
                <li
                  key={session.id}
                  onClick={() => props.setSessionId(session.id)}
                  className={clsx(
                    "mt-1 cursor-pointer rounded p-1 flex justify-between items-center group",
                    {
                      "text-[var(--c-accent)] font-semibold":
                        props.sessionId === session.id,
                      "hover:bg-[var(--c-bg-hover)] font-semibold text-[var(--c-chat-record)]":
                        props.sessionId !== session.id,
                    },
                  )}
                >
                  {" "}
                  <span
                    className="truncate max-w-[190px]"
                    title={session.title ?? undefined}
                  >
                    {" "}
                    {session.title?.trim() || "Sin título"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      props.setSessionToDelete(session);
                    }}
                    className="cursor-pointer text-red-400 hover:text-red-600 hover:bg-[var(--c-trash-bg)] rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition ml-2"
                    title="Eliminar chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
