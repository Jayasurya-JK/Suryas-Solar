export const dynamic = "force-dynamic";

// The commit this deployment was built from. The running app compares it with what it first loaded, so a
// phone left open for days can be told "a new version is ready" instead of quietly running old code.
// Vercel sets VERCEL_GIT_COMMIT_SHA on every deployment.
export function GET() {
  const v = process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_DEPLOYMENT_ID || "dev";
  return Response.json({ v }, { headers: { "Cache-Control": "no-store" } });
}
