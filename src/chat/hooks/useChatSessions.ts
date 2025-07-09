import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function useChatSession() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [sessionId, setSessionIdState] = useState<string | null>(id ?? null);

  useEffect(() => {
    setSessionIdState(id ?? null);
  }, [id]);

  const setSessionId = (id: string | null) => {
    navigate(id ? `/chat/${id}` : "/chat");
  };

  return {
    sessionId,
    setSessionId,
  };
}
