import { useState, useEffect } from "react";
import SessionSidebar from "../components/SessionSidebar";
import MessageArea from "../components/MessageArea";
import { useChatSession } from "../hooks/useChatSessions";
import type { SessionResponse } from "../types/SessionResponse";
import ConfirmModal from "../../common/components/ConfirmModal";
import { apiClient, wrap } from "../../utils/api";
import { useUserSessions } from "../hooks/useUserSessions";
import { PanelRight, PanelRightClose } from "lucide-react";

export default function ChatPage() {
  const [sessionToDelete, setSessionToDelete] =
    useState<SessionResponse | null>(null);
  const { sessionId, setSessionId } = useChatSession();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { refetch } = useUserSessions();

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--c-bg)]">
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-full w-64 z-40 transform transition-transform duration-300
          bg-[var(--c-bg)] md:static md:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-full flex flex-col justify-between overflow-y-auto">
          <SessionSidebar
            sessionId={sessionId}
            setSessionId={setSessionId}
            setSessionToDelete={setSessionToDelete}
          />
        </div>
      </div>


      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className={`
          fixed z-50 w-10 h-10 flex items-center justify-center text-2xl text-white rounded-full shadow-lg transition md:hidden
          ${isSidebarOpen ? "top-20 left-69 bg-sky-500 hover:bg-sky-600" : "top-20 left-3 bg-sky-500 hover:bg-sky-600"}
        `}
      >
        <PanelRightClose className="w-6 h-6" />
      </button>


      <div className="flex-1">
        <MessageArea
          sessionId={sessionId ?? null}
          setSessionId={setSessionId}
        />
      </div>

      {/* Modal de confirmación */}
      {sessionToDelete && (
        <ConfirmModal
          message={`"${sessionToDelete.title?.trim() || "Sin título"}"`}
          onConfirm={async () => {
            await wrap(
              apiClient.deleteSessionById({
                params: { id: sessionToDelete.id },
              }),
            );
            if (sessionToDelete.id === sessionId) setSessionId(null);
            setSessionToDelete(null);
            refetch();
          }}
          onCancel={() => setSessionToDelete(null)}
        />
      )}
    </div>
  );
}
