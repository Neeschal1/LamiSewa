import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getAccessTokens } from "../storage/SecureTokens";

export type InboxEvent = {
  kind: string;
  ntype: string;
  title: string;
  body: string;
  thread_id?: number;
  actor_profileid?: string;
  other_profileid?: string;
  other_name?: string;
  other_pic?: string;
} | null;

const InboxContext = createContext<{ event: InboxEvent }>({ event: null });

export const useInbox = () => useContext(InboxContext);

export const InboxProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [event, setEvent] = useState<InboxEvent>(null);

  useEffect(() => {
    if (!token) return;
    let closed = false;
    let ws: WebSocket | null = null;
    let retry: ReturnType<typeof setTimeout> | null = null;
    const connect = async () => {
      if (closed) return;
      try {
        const t = await getAccessTokens();
        if (!t || closed) return;
        const base = (process.env.EXPO_PUBLIC_DJANGO_DEVELOPMENT_SERVER_URL ?? "").replace(/^http/, "ws");
        ws = new WebSocket(`${base}/ws/inbox/?token=${encodeURIComponent(t)}`);
        ws.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data?.kind === "inbox" && data?.ntype) setEvent(data);
          } catch {}
        };
        ws.onclose = () => {
          if (!closed) retry = setTimeout(connect, 5000);
        };
        ws.onerror = () => {
          try {
            ws?.close();
          } catch {}
        };
      } catch {
        if (!closed) retry = setTimeout(connect, 5000);
      }
    };
    connect();
    return () => {
      closed = true;
      if (retry) clearTimeout(retry);
      try {
        ws?.close();
      } catch {}
    };
  }, [token]);

  const value = { event };
  return <InboxContext.Provider value={value}>{children}</InboxContext.Provider>;
};
