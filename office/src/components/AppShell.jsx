"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Avatar, Icon, Spinner } from "@/components/ui";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "chart", ownerOnly: true },
  { href: "/leads", label: "Leads", icon: "users" },
  { href: "/quotes", label: "Quotes", icon: "doc" },
  { href: "/expenses", label: "Expenses", icon: "wallet" },
  { href: "/settings", label: "Settings", icon: "cog", ownerOnly: true, group: "admin" },
];
const OWNER_ONLY = ["/dashboard", "/settings"];

export default function AppShell({ children }) {
  const sb = supabase();
  const router = useRouter();
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const [state, setState] = useState({ loading: true, profile: null, settings: null, team: [], brands: [], signUrl: null });

  const load = useCallback(async () => {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return router.replace("/login");
    const { data: profile } = await sb.from("profiles").select("*").eq("id", user.id).single();
    let settings = null, team = [], brands = [];
    if (profile && profile.role !== "pending") {
      const [s, t, b] = await Promise.all([
        sb.from("app_settings").select("*").eq("id", 1).single(),
        sb.from("profiles").select("id, full_name, email, role").neq("role", "pending").order("full_name"),
        sb.from("brands").select("*").order("sort"),
      ]);
      settings = s.data;
      team = t.data || [];
      brands = b.data || [];
    }
    // Signature stamp lives in a private bucket; a short-lived link is enough for preview and print.
    let signUrl = null;
    const signPath = settings?.data?.signature_path;
    if (signPath) {
      const { data } = await sb.storage.from("assets").createSignedUrl(signPath, 60 * 60 * 12);
      signUrl = data?.signedUrl || null;
    }
    setState({ loading: false, profile, settings, team, brands, signUrl });
  }, [sb, router]);

  useEffect(() => { load(); }, [load]);

  const signOut = async () => {
    await sb.auth.signOut();
    router.replace("/login");
  };

  useEffect(() => setMenu(false), [path]);

  if (state.loading) return <div className="flex min-h-screen items-center justify-center"><Spinner /></div>;

  const { profile } = state;
  if (!profile || profile.role === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="card max-w-md p-8 text-center">
          <Image src="/logo.png" alt="Surya's Solar" width={180} height={77} className="mx-auto mb-6 h-auto w-44" />
          <h1 className="text-xl font-bold">Waiting for approval</h1>
          <p className="mt-2 text-sm text-slate-500">
            Your account ({profile?.email}) is created. The owner needs to approve it in Settings, Team. Refresh this page after that.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button className="btn-primary" onClick={load}>Refresh</button>
            <button className="btn-ghost" onClick={signOut}>Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = profile.role === "owner";
  const blocked = !isOwner && OWNER_ONLY.some((p) => path.startsWith(p));
  const nav = NAV.filter((n) => isOwner || !n.ownerOnly);
  const main = nav.filter((n) => n.group !== "admin");
  const admin = nav.filter((n) => n.group === "admin");
  const roleLabel = isOwner ? "Owner" : "Staff";

  const NavLink = ({ n }) => {
    const active = path.startsWith(n.href);
    return (
      <Link href={n.href}
        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition ${active ? "bg-primary-50 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
        {active && <span className="absolute -left-3 top-2 bottom-2 w-1 rounded-r-full bg-primary" />}
        <Icon name={n.icon} className={`h-5 w-5 ${active ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`} />{n.label}
      </Link>
    );
  };

  return (
    <Ctx.Provider value={{ ...state, isOwner, reload: load }}>
      <div className="min-h-screen lg:pl-64">
        {/* desktop sidebar */}
        <aside className="no-print fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200/80 bg-white lg:flex">
          <div className="px-6 pb-6 pt-7">
            <Image src="/logo.png" alt="Surya's Solar" width={180} height={77} className="h-auto w-36" priority />
            <p className="mt-2.5 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Office</p>
          </div>
          <nav className="flex-1 space-y-6 overflow-y-auto px-3">
            <div className="space-y-1">
              <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Workspace</p>
              {main.map((n) => <NavLink key={n.href} n={n} />)}
            </div>
            {admin.length > 0 && (
              <div className="space-y-1">
                <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Admin</p>
                {admin.map((n) => <NavLink key={n.href} n={n} />)}
              </div>
            )}
          </nav>
          <div className="m-3 flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3">
            <Avatar name={profile.full_name || profile.email} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{profile.full_name}</p>
              <p className="text-xs text-slate-500">{roleLabel}</p>
            </div>
            <button onClick={signOut} title="Sign out" aria-label="Sign out" className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-red-600">
              <Icon name="logout" className="h-4 w-4" />
            </button>
          </div>
        </aside>

        {/* mobile top bar */}
        <header className="no-print sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur-md lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
          <Image src="/logo.png" alt="Surya's Solar" width={120} height={51} className="h-auto w-[104px]" priority />
          <div className="relative">
            <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100" aria-label="Account menu">
              <Avatar name={profile.full_name || profile.email} size="sm" />
            </button>
            {menu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
                <div className="absolute right-0 top-12 z-50 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{profile.full_name}</p>
                    <p className="truncate text-xs text-slate-500">{profile.email} · {roleLabel}</p>
                  </div>
                  <button onClick={signOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                    <Icon name="logout" className="h-4 w-4" />Sign out
                  </button>
                </div>
              </>
            )}
          </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-32 pt-5 sm:px-6 lg:px-10 lg:pb-12 lg:pt-9">
          {blocked ? (
            <div className="card p-8 text-center text-slate-600">This page is only for the owner.</div>
          ) : children}
        </main>

        {/* mobile bottom tabs */}
        <nav className="no-print fixed inset-x-0 bottom-0 z-30 grid border-t border-slate-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
          style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}>
          {nav.map((n) => {
            const active = path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className="flex flex-col items-center gap-1 pb-2 pt-2 text-[11px] font-semibold">
                <span className={`flex h-8 w-14 items-center justify-center rounded-full transition ${active ? "bg-primary-50 text-primary" : "text-slate-500"}`}>
                  <Icon name={n.icon} className="h-[22px] w-[22px]" />
                </span>
                <span className={active ? "text-primary" : "text-slate-500"}>{n.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </Ctx.Provider>
  );
}
