"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSession } from "../hooks/fetchSession"

export default function SessionUpdater() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadSession() {
      const data = await fetchSession(); 
      setSession(data);
    }
    
    loadSession();
  }, []);

  useEffect(() => {
    if (session) {
      router.refresh(); 
    }
  }, [session]);

  return null;
}
