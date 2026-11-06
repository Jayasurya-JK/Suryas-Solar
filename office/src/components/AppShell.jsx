"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Avatar, Icon, Modal, Spinner } from "@/components/ui";
import InstallBanner from "@/components/InstallBanner";
import VersionBar from "@/components/VersionBar";
import ConfirmHost from "@/components/Confirm";
import { ago, isOwnerRole, permLabel, roleLabel } from "@/lib/format";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "chart", owner: true },
  { href: "/leads", label: "Leads", icon: "users", module: "leads" },
  { href: "/quotes", label: "Quotes", icon: "doc", module: "quotes" },
  { href: "/expenses", label: "Expenses", icon: "wallet", module: "expenses" },
  { href: "/activity", label: "Activity", icon: "clock", activity: true, group: "admin" },
  { href: "/settings", label: "Settings", icon: "cog", owner: true, group: "admin" },
];

// Shown to people who cannot use the app yet
function AccessGate({ profile, kind, onRefresh, onSignOut, checkedAt }) {
  const copy = {
    waiting: { icon: "clock", title: "Request sent", text: `Hello ${profile?.full_name || ""}. The owner needs to approve your request. This page updates by itself as soon as you are approved.` },
    declined: { icon: "x", title: "Request not approved", text: "The owner did not approve this request. If you think this is a mistake, please contact the owner." },
    off: { icon: "x", title: "Your access is switched off", text: "Please contact the owner to switch it back on." },
    none: { icon: "info", title: "Approved, but no screens yet", text: "The owner has not given you any screens yet. Please ask the owner." },
  }[kind];
  const asked = (profile?.requested_perms || []).map(permLabel);
  return (
    <div className="flex page-min items-center justify-center bg-gradient-to-b from-primary-50 via-primary-50/60 to-white p-4">
      <div className="card w-full max-w-md p-7 text-center">
        <Image src="/logo.png" alt="Surya's Solar" width={180} height={77} className="mx-auto mb-5 h-auto w-40" />
        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${kind === "waiting" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"}`}>
          <Icon name={copy.icon} className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">{copy.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{copy.text}</p>
        {kind === "waiting" && asked.length > 0 && (
          <div className="mt-4 text-left">
            <p className="label text-center">You asked for</p>
            <div className="flex flex-wrap justify-center gap-2">
              {asked.map((a) => <span key={a} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">{a}</span>)}
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-center gap-2">
          <button className="btn-primary" onClick={onRefresh}>Check again</button>
          <button className="btn-ghost" onClick={onSignOut}>Sign out</button>
        </div>
        {kind === "waiting" && checkedAt && <p className="mt-3 text-xs text-slate-500">Last checked {ago(checkedAt)}</p>}
      </div>
    </div>
  );
}

export default function AppShell({ children }) {
  const sb = supabase();
  const router = useRouter();
  const path = usePathname();
  const scrollRef = useRef(null);
  const [menu, setMenu] = useState(false);
  const [more, setMore] = useState(false);
  const [checkedAt, setCheckedAt] = useState(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [pullNote, setPullNote] = useState("");
  const pullStart = useRef(null);
  const [state, setState] = useState({ loading: true, profile: null, settings: null, team: [], brands: [], signUrl: null, requests: 0 });

  const load = useCallback(async () => {
    // getSession reads the cookie and refreshes it if it has expired. It is the only place that refreshes,
    // so two tabs or the server can never fight over the same refresh token.
    const { data: { session } } = await sb.auth.getSession();
    if (!session?.user) {
      try { await sb.auth.signOut(); } catch {}
      return router.replace("/login");
    }
    const { data: profile, error } = await sb.from("profiles").select("*").eq("id", session.user.id).single();
    // A dead token comes back as a JWT error rather than an empty row - clear it so the login page starts clean.
    if (error && /jwt|token|401|PGRST301|not signed in/i.test(`${error.message} ${error.code}`)) {
      try { await sb.auth.signOut(); } catch {}
      return router.replace("/login");
    }
    const member = profile && (isOwnerRole(profile.role) || profile.role === "staff") && profile.active !== false;
    let settings = null, team = [], brands = [], requests = 0, signUrl = null;
    if (member) {
      const [s, t, b] = await Promise.all([
        sb.from("app_settings").select("*").eq("id", 1).single(),
        sb.from("profiles").select("id, full_name, email, username, role, perms, active").neq("role", "pending").order("full_name"),
        sb.from("brands").select("*").order("sort"),
      ]);
      settings = s.data;
      team = t.data || [];
      brands = b.data || [];
      if (isOwnerRole(profile.role)) {
        const { data: pend } = await sb.from("profiles").select("id").eq("role", "pending").eq("active", true);
        requests = (pend || []).length;
      }
      // Signature stamp lives in a private bucket; a short-lived link is enough for preview and print.
      const signPath = settings?.data?.signature_path;
      if (signPath) {
        const { data } = await sb.storage.from("assets").createSignedUrl(signPath, 60 * 60 * 12);
        signUrl = data?.signedUrl || null;
      }
    }
    setCheckedAt(new Date().toISOString());
    setState({ loading: false, profile, settings, team, brands, signUrl, requests });
  }, [sb, router]);

  useEffect(() => { load(); }, [load]);

  const profile = state.profile;
  const isOwner = isOwnerRole(profile?.role);
  // The activity history is narrower than owner: only the owner and the people explicitly allowed.
  const canSeeActivity = !!profile && profile.active !== false && (profile.role === "owner" || !!profile.sees_activity);
  const member = !!profile && (isOwnerRole(profile.role) || profile.role === "staff") && profile.active !== false;
  const can = useCallback((m) => isOwner || (member && (profile?.perms || []).includes(m)), [isOwner, member, profile]);

  // People waiting for approval: re-check every 15 seconds so their screens open by themselves
  useEffect(() => {
    if (state.loading || member) return;
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [state.loading, member, load]);

  // Owner: keep the "requests waiting" count fresh
  useEffect(() => {
    if (!isOwner) return;
    const t = setInterval(async () => {
      const { data } = await sb.from("profiles").select("id").eq("role", "pending").eq("active", true);
      setState((s) => ({ ...s, requests: (data || []).length }));
    }, 60000);
    return () => clearInterval(t);
  }, [isOwner, sb]);

  // "Last active" ping and one sign-in entry per browser session (ignored if the log is not set up)
  useEffect(() => {
    if (!member) return;
    sb.rpc("touch_seen").then(() => {}, () => {});
    try {
      if (!sessionStorage.getItem("so-login")) {
        sessionStorage.setItem("so-login", "1");
        sb.rpc("log_event", { p_action: "login" }).then(() => {}, () => {});
      }
    } catch {}
  }, [member, sb]);

  useEffect(() => {
    setMenu(false);
    setMore(false);
    scrollRef.current?.scrollTo(0, 0);
  }, [path]);

  const signOut = async () => {
    try { await sb.rpc("log_event", { p_action: "logout" }); } catch {}
    try { sessionStorage.removeItem("so-login"); } catch {}
    await sb.auth.signOut();
    router.replace("/login");
  };

  // Pull down at the top of a screen to reload - the gesture people expect from a phone app. Screens with
  // unsaved edits set window.__soDirty, so a stray pull cannot throw their work away.
  const PULL_TRIGGER = 56;
  const onPullStart = (e) => {
    const el = scrollRef.current;
    if (!el || el.scrollTop > 0 || e.touches.length !== 1) return;
    pullStart.current = e.touches[0].clientY;
  };
  const onPullMove = (e) => {
    if (pullStart.current === null) return;
    const el = scrollRef.current;
    const dy = e.touches[0].clientY - pullStart.current;
    if (dy <= 0 || (el && el.scrollTop > 0)) {
      if (pull !== 0) setPull(0);
      return;
    }
    setPull(Math.min(96, dy * 0.5));
  };
  const onPullEnd = () => {
    const distance = pull;
    pullStart.current = null;
    setPull(0);
    if (distance < PULL_TRIGGER || refreshing) return;
    if (window.__soDirty) {
      setPullNote("Save your changes first");
      setTimeout(() => setPullNote(""), 2500);
      return;
    }
    setRefreshing(true);
    window.location.reload();
  };

  if (state.loading) return <div className="flex page-min items-center justify-center"><Spinner /></div>;

  if (!profile) return <AccessGate profile={null} kind="waiting" onRefresh={load} onSignOut={signOut} checkedAt={checkedAt} />;
  if (profile.role === "pending") {
    return <AccessGate profile={profile} kind={profile.active === false ? "declined" : "waiting"} onRefresh={load} onSignOut={signOut} checkedAt={checkedAt} />;
  }
  if (!member) return <AccessGate profile={profile} kind="off" onRefresh={load} onSignOut={signOut} />;

  const nav = NAV.filter((n) => (n.activity ? canSeeActivity : n.owner ? isOwner : isOwner || can(n.module)));
  if (!isOwner && nav.length === 0) return <AccessGate profile={profile} kind="none" onRefresh={load} onSignOut={signOut} />;

  const home = isOwner ? "/dashboard" : nav[0].href;
  const hit = NAV.find((n) => path.startsWith(n.href));
  const blocked = hit && !nav.includes(hit);
  const main = nav.filter((n) => n.group !== "admin");
  const admin = nav.filter((n) => n.group === "admin");
  const roleLabelText = roleLabel(profile.role);
  const who = profile.username ? `ID: ${profile.username}` : profile.email;
  const badge = (n) => (n.href === "/settings" && state.requests > 0 ? state.requests : 0);

  const NavLink = ({ n }) => {
    const active = path.startsWith(n.href);
    const b = badge(n);
    return (
      <Link href={n.href}
        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-colors ${active ? "bg-primary-50 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
        {active && <span className="absolute -left-3 bottom-2 top-2 w-1 rounded-r-full bg-primary" />}
        <Icon name={n.icon} className={`h-5 w-5 ${active ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`} />
        <span className="flex-1">{n.label}</span>
        {b > 0 && <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-white">{b}</span>}
      </Link>
    );
  };

  const tabCount = main.length + (admin.length ? 1 : 0);
  const moreActive = admin.some((n) => path.startsWith(n.href));

  return (
    <Ctx.Provider value={{ ...state, isOwner, canSeeActivity, can, home, reload: load }}>
      {/* The page itself never scrolls; only the content area does. This keeps the bars still on iPhone Safari. */}
      <div className="app-root fixed inset-0 flex bg-[#f4f6fa]">
        {/* desktop sidebar */}
        <aside className="no-print hidden h-full w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white lg:flex">
          <div className="px-6 pb-6 pt-7">
            <Image src="/logo.png" alt="Surya's Solar" width={180} height={77} className="h-auto w-36" priority />
            <p className="mt-2.5 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Office</p>
          </div>
          <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto px-3">
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
            <Link href="/profile" className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 hover:text-primary">{profile.full_name}</p>
              <p className="text-xs text-slate-500">{roleLabelText}</p>
            </Link>
            <button onClick={signOut} title="Sign out" aria-label="Sign out" className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-red-600">
              <Icon name="logout" className="h-4 w-4" />
            </button>
          </div>
        </aside>

        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
          {/* phone top bar */}
          <header className="no-print relative z-30 shrink-0 border-b border-slate-200/80 bg-white pt-[env(safe-area-inset-top)] lg:hidden">
            <div className="flex h-14 items-center justify-between px-4">
              <Image src="/logo.png" alt="Surya's Solar" width={120} height={51} className="h-auto w-[104px]" priority />
              <div className="relative">
                <button onClick={() => setMenu(!menu)} className="flex items-center rounded-full p-1 hover:bg-slate-100" aria-label="Account menu">
                  <Avatar name={profile.full_name || profile.email} size="sm" />
                </button>
                {menu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
                    <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                      <div className="px-3 py-2">
                        <p className="truncate text-sm font-semibold text-slate-900">{profile.full_name}</p>
                        <p className="truncate text-xs text-slate-500">{who} · {roleLabelText}</p>
                      </div>
                      <Link href="/profile" onClick={() => setMenu(false)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        <Icon name="users" className="h-4 w-4" />My profile
                      </Link>
                      <button onClick={signOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                        <Icon name="logout" className="h-4 w-4" />Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          <main id="scroll" ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain"
            onTouchStart={onPullStart} onTouchMove={onPullMove} onTouchEnd={onPullEnd}>
            <div className="mx-auto w-full max-w-7xl px-4 pb-28 pt-5 sm:px-6 sm:pb-10 lg:px-10 lg:pb-12 lg:pt-9">
              {/* Pull-to-refresh: an installed app has no browser, so no swipe-down reload of its own. */}
              <div className="flex items-start justify-center overflow-hidden transition-[height] duration-150"
                style={{ height: refreshing ? 48 : pull }}>
                {(refreshing || pull > 24) && (
                  <span className="mt-1 h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                )}
              </div>
              {pullNote && <div className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">{pullNote}</div>}
              <InstallBanner />
              {blocked ? (
                <div className="card p-8 text-center text-slate-600">You do not have access to this screen. Please ask the owner.</div>
              ) : children}
            </div>
          </main>

          {/* phone bottom tabs */}
          <nav className="no-print relative z-30 grid shrink-0 select-none border-t border-slate-200/80 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
            style={{ gridTemplateColumns: `repeat(${tabCount}, minmax(0, 1fr))` }}>
            {main.map((n) => {
              const active = path.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} className="flex flex-col items-center gap-1 pb-2 pt-2 text-[11px] font-semibold">
                  <span className={`flex h-8 w-14 items-center justify-center rounded-full ${active ? "bg-primary-50 text-primary" : "text-slate-500"}`}>
                    <Icon name={n.icon} className="h-[22px] w-[22px]" />
                  </span>
                  <span className={`${active ? "text-primary" : "text-slate-500"} [@media(max-height:500px)]:hidden`}>{n.label}</span>
                </Link>
              );
            })}
            {admin.length > 0 && (
              <button type="button" onClick={() => setMore(true)} className="flex flex-col items-center gap-1 pb-2 pt-2 text-[11px] font-semibold">
                <span className={`relative flex h-8 w-14 items-center justify-center rounded-full ${moreActive ? "bg-primary-50 text-primary" : "text-slate-500"}`}>
                  <Icon name="dots" className="h-[22px] w-[22px]" />
                  {state.requests > 0 && <span className="absolute right-3 top-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-white" />}
                </span>
                <span className={`${moreActive ? "text-primary" : "text-slate-500"} [@media(max-height:500px)]:hidden`}>More</span>
              </button>
            )}
          </nav>
        </div>
      </div>

      {more && (
        <Modal title="More" onClose={() => setMore(false)}>
          <div className="space-y-1">
            {admin.map((n) => {
              const b = badge(n);
              return (
                <Link key={n.href} href={n.href} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-slate-50">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><Icon name={n.icon} className="h-5 w-5" /></span>
                  <span className="flex-1 text-[15px] font-semibold text-slate-900">{n.label}</span>
                  {b > 0 && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">{b} waiting</span>}
                  <Icon name="chevron" className="h-4 w-4 text-slate-400" />
                </Link>
              );
            })}
            <Link href="/profile" onClick={() => setMore(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-slate-50">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><Icon name="users" className="h-5 w-5" /></span>
              <span className="flex-1 text-[15px] font-semibold text-slate-900">My profile</span>
              <Icon name="chevron" className="h-4 w-4 text-slate-400" />
            </Link>
            <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-red-50">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600"><Icon name="logout" className="h-5 w-5" /></span>
              <span className="text-[15px] font-semibold text-red-600">Sign out</span>
            </button>
          </div>
        </Modal>
      )}
      <VersionBar />
      <ConfirmHost />
    </Ctx.Provider>
  );
}
