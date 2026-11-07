"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/components/AppShell";
import { Avatar, Badge, Notice, PageHeader } from "@/components/ui";
import { InstallCard } from "@/components/InstallBanner";
import RecentProblems from "@/components/RecentProblems";
import { dmy, isOwnerRole, permLabel, roleLabel } from "@/lib/format";

const pinProblem = (pin, again) => {
  if (!/^[0-9]{4,6}$/.test(pin)) return "The PIN must be 4 to 6 digits.";
  if (/^(.)\1+$/.test(pin)) return "That PIN is too easy. Pick something less obvious.";
  if (pin !== again) return "The two PINs do not match.";
  return "";
};

export default function Profile() {
  const sb = supabase();
  const { profile, reload } = useApp();
  const full = isOwnerRole(profile.role);

  const [name, setName] = useState(profile.full_name || "");
  const [nameBusy, setNameBusy] = useState(false);
  const [nameMsg, setNameMsg] = useState(null);

  const [pin, setPin] = useState("");
  const [again, setAgain] = useState("");
  const [pinBusy, setPinBusy] = useState(false);
  const [pinMsg, setPinMsg] = useState(null);

  const saveName = async () => {
    const clean = name.trim();
    if (clean.length < 2) return setNameMsg({ tone: "red", text: "Enter your name." });
    setNameBusy(true);
    const { error } = await sb.from("profiles").update({ full_name: clean }).eq("id", profile.id);
    setNameBusy(false);
    if (error) return setNameMsg({ tone: "red", text: error.message });
    setNameMsg({ tone: "green", text: "Name saved." });
    reload();
  };

  const savePin = async () => {
    const problem = pinProblem(pin, again);
    if (problem) return setPinMsg({ tone: "red", text: problem });
    setPinBusy(true);
    const { error } = await sb.rpc("set_my_pin", { p_pin: pin });
    setPinBusy(false);
    if (error) return setPinMsg({ tone: "red", text: error.message });
    setPin("");
    setAgain("");
    setPinMsg({ tone: "green", text: "PIN saved. Next time sign in with your User ID and this PIN." });
    reload();
  };

  const canSaveName = !nameBusy && name.trim().length > 1 && name.trim() !== profile.full_name;

  return (
    <div className="space-y-5">
      <PageHeader title="My profile" subtitle="Your name, what you can reach, and the PIN you sign in with." />

      <section className="card p-5">
        <div className="flex items-center gap-3">
          <Avatar name={profile.full_name || profile.email} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-slate-900">{profile.full_name}</p>
            <p className="truncate text-[13px] text-slate-500">{profile.username ? `User ID: ${profile.username}` : profile.email}</p>
          </div>
          <Badge tone={profile.role === "owner" ? "pink" : profile.role === "admin" ? "violet" : "slate"}>{roleLabel(profile.role)}</Badge>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <span className="label">Your name</span>
            <div className="flex gap-2">
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              <button className="btn-ghost shrink-0" onClick={saveName} disabled={!canSaveName}>
                {nameBusy ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
          {nameMsg && <Notice tone={nameMsg.tone}>{nameMsg.text}</Notice>}

          <div>
            <span className="label">Role</span>
            <p className="text-sm text-slate-600">
              {full ? `${roleLabel(profile.role)} - every screen.` : `${roleLabel(profile.role)} - only the screens given to you.`} Only an admin can change a role, so this is fixed here.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {full ? (
                <span className="rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-semibold text-accent">Full access</span>
              ) : (profile.perms || []).length === 0 ? (
                <span className="text-xs text-slate-500">No screens yet</span>
              ) : (
                (profile.perms || []).map((p) => (
                  <span key={p} className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary">{permLabel(p)}</span>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="font-bold text-slate-900">Sign-in PIN</h2>
        <p className="mt-1 text-sm text-slate-500">
          A 4 to 6 digit PIN you type instead of the password. It replaces the password, so treat it like one and do not share it.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {profile.pin_set_at ? `PIN is set (${dmy(profile.pin_set_at)}). Setting a new one replaces it.` : "No PIN yet. You are signing in with your password."}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <span className="label">New PIN</span>
            <input className="input" type="password" inputMode="numeric" autoComplete="new-password" maxLength={6}
              value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} />
          </div>
          <div>
            <span className="label">Repeat PIN</span>
            <input className="input" type="password" inputMode="numeric" autoComplete="new-password" maxLength={6}
              value={again} onChange={(e) => setAgain(e.target.value.replace(/\D/g, ""))} />
          </div>
        </div>
        {pinMsg && <div className="mt-3"><Notice tone={pinMsg.tone}>{pinMsg.text}</Notice></div>}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">Forgot it? Ask the owner or an admin to reset it.</p>
          <button className="btn-primary shrink-0" onClick={savePin} disabled={pinBusy || pin.length < 4 || again.length < 4}>
            {pinBusy ? "Saving..." : "Set PIN"}
          </button>
        </div>
      </section>

      <RecentProblems />
      <InstallCard />
    </div>
  );
}
