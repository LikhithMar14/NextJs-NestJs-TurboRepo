"use server";

import { getSession } from "@/lib/session";

export async function fetchSession() {
  return getSession(); 
}
