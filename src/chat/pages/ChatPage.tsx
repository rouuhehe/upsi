import { useState, useEffect } from "react";
import SessionSidebar from "../components/SessionSidebar";
import MessageArea from "../components/MessageArea";
import { useChatSession } from "../hooks/useChatSessions";

export default function ChatPage() {
  const { sessionId, setSessionId } = useChatSession();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
          <SessionSidebar sessionId={sessionId} setSessionId={setSessionId} />
        </div>
      </div>

      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className={`
          fixed z-50 w-12 h-12 flex items-center justify-center text-2xl text-white rounded-full shadow-lg transition md:hidden
          ${isSidebarOpen ? "top-20 left-69 bg-sky-500 hover:bg-sky-600" : "bottom-32 right-6 bg-sky-500 hover:bg-sky-600"}
        `}
      >
        {isSidebarOpen ? "×" : "+"}
      </button>

      <div className="flex-1">
        <MessageArea sessionId={sessionId ?? null} setSessionId={setSessionId} />
      </div>
    </div>
  );
}
