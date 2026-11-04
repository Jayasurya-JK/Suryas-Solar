import { createBrowserClient } from "@supabase/ssr";
import { demoClient } from "@/lib/demo";

let client;

export function supabase() {
  if (!client) {
    client = process.env.NEXT_PUBLIC_DEMO === "1"
      ? demoClient()
      : createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }
  return client;
}
