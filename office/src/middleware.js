import { NextResponse } from "next/server";

// A fast gate only: "is there an auth cookie at all?" It deliberately does NOT talk to Supabase.
//
// The browser client is the single owner of the session. It refreshes the token when it expires and writes
// the new cookie itself. This middleware used to build a second Supabase client and call getUser() on every
// request, so the server and the browser refreshed the same refresh token at the same moment. The token
// rotates on use, so one of them always lost and was left holding a dead token - that is what kept throwing
// people back to the login screen.
//
// Nothing is lost by skipping the check here: every screen is wrapped in AppShell, which checks the session,
// and the real protection has always been the database rules (RLS).
export function middleware(request) {
  // Local design preview with sample data (never enabled on Vercel)
  if (process.env.NEXT_PUBLIC_DEMO === "1") return NextResponse.next();

  // Supabase may split a large session cookie into .0 / .1 chunks, so match on the name fragment.
  const signedIn = request.cookies.getAll().some((c) => c.name.includes("-auth-token"));
  const isLogin = request.nextUrl.pathname.startsWith("/login");

  if (!signedIn && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|icon|logo|brands/|manifest|sw\\.js|offline\\.html).*)"],
};
