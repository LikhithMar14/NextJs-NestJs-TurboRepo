"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchSession } from "../hooks/fetchSession"
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


  const refreshSession = async () => {
    const newSession = await fetchSession();
    setSession(newSession);
    router.refresh(); 
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
