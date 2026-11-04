// Called once a day by Vercel Cron (vercel.json) so the free Supabase project never pauses.
export const dynamic = "force-dynamic";

export async function GET() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/keepalive`, {
    method: "POST",
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: "{}",
    cache: "no-store",
  });
  return Response.json({ ok: res.ok, at: new Date().toISOString() }, { status: res.ok ? 200 : 502 });
}
