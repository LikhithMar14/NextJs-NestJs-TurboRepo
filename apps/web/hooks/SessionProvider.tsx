"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { fetchSession } from "../hooks/fetchSession";
import { useRouter } from "next/navigation";

interface Session {
  user: { id: string; name: string };
  accessToken: string;
  refreshToken: string;
}

interface SessionContextType {
  session: Session | null;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const refreshCount = useRef(0); // Ref to track refresh attempts

  const refreshSession = async () => {
    try {
      const newSession = await fetchSession();

      if (JSON.stringify(newSession) !== JSON.stringify(session)) {
        setSession(newSession);

        // Ensure refresh is called at most twice
        if (refreshCount.current < 2) {
          refreshCount.current += 1;
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []); 

  return (
    <SessionContext.Provider value={{ session, refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
}
