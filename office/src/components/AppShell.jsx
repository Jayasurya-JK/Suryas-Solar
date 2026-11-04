"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Icon, Spinner } from "@/components/ui";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "chart", ownerOnly: true },
  { href: "/leads", label: "Leads", icon: "users" },
  { href: "/quotes", label: "Quotes", icon: "doc" },
  { href: "/expenses", label: "Expenses", icon: "wallet" },
  { href: "/settings", label: "Settings", icon: "cog", ownerOnly: true },
];
const OWNER_ONLY = ["/dashboard", "/settings"];

export default function AppShell({ children }) {
  const sb = supabase();
  const router = useRouter();
  const path = usePathname();
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

  if (state.loading) return <Spinner />;

  const { profile } = state;
  if (!profile || profile.role === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="card max-w-md p-8 text-center">
          <Image src="/logo.png" alt="Surya's Solar" width={180} height={77} className="mx-auto mb-6 h-auto w-44" />
          <h1 className="text-xl font-extrabold">Waiting for approval</h1>
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

  return (
    <Ctx.Provider value={{ ...state, isOwner, reload: load }}>
      <div className="min-h-screen lg:pl-60">
        {/* desktop sidebar */}
        <aside className="no-print fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-slate-200 bg-white lg:flex">
          <div className="px-5 pb-4 pt-6">
            <Image src="/logo.png" alt="Surya's Solar" width={180} height={77} className="h-auto w-40" priority />
            <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">Office</p>
          </div>
          <nav className="flex-1 space-y-1 px-3">
            {nav.map((n) => {
              const active = path.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? "bg-primary-50 text-primary" : "text-slate-600 hover:bg-slate-50"}`}>
                  <Icon name={n.icon} />{n.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-slate-200 p-4">
            <p className="truncate text-sm font-semibold text-slate-900">{profile.full_name}</p>
            <p className="text-xs capitalize text-slate-500">{profile.role}</p>
            <button onClick={signOut} className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-600">
              <Icon name="logout" className="h-4 w-4" />Sign out
            </button>
          </div>
        </aside>

        {/* mobile top bar */}
        <header className="no-print sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <Image src="/logo.png" alt="Surya's Solar" width={120} height={51} className="h-auto w-28" priority />
          <button onClick={signOut} className="flex items-center gap-1 text-xs font-semibold text-slate-500">
            <Icon name="logout" className="h-4 w-4" />Sign out
          </button>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          {blocked ? (
            <div className="card p-8 text-center text-slate-600">This page is only for the owner.</div>
          ) : children}
        </main>

        {/* mobile bottom tabs */}
        <nav className="no-print fixed inset-x-0 bottom-0 z-30 grid border-t border-slate-200 bg-white lg:hidden"
          style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}>
          {nav.map((n) => {
            const active = path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${active ? "text-primary" : "text-slate-500"}`}>
                <Icon name={n.icon} className="h-6 w-6" />{n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </Ctx.Provider>
  );
}
