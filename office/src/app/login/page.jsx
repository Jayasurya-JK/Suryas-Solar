"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Field, Notice } from "@/components/ui";

export default function Login() {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const sb = supabase();
    if (mode === "signin") {
      const { error } = await sb.auth.signInWithPassword({ email: form.email.trim(), password: form.password });
      if (error) {
        setMsg({ tone: "red", text: error.message === "Invalid login credentials" ? "Wrong email or password." : error.message });
        setBusy(false);
        return;
      }
      window.location.href = "/";
    } else {
      if (form.password.length < 8) {
        setMsg({ tone: "red", text: "Password must be at least 8 characters." });
        setBusy(false);
        return;
      }
      const { data, error } = await sb.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: { data: { full_name: form.name.trim() } },
      });
      setBusy(false);
      if (error) return setMsg({ tone: "red", text: error.message });
      if (data.session) return (window.location.href = "/");
      setMsg({ tone: "green", text: "Account created. Check your email to confirm it, then sign in. The owner must approve new staff accounts." });
      setMode("signin");
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-primary-50 via-primary-50/60 to-white p-4">
      <div className="card w-full max-w-sm p-7 shadow-sm">
        <Image src="/logo.png" alt="Surya's Solar" width={200} height={86} className="mx-auto h-auto w-44" priority />
        <p className="mt-2 text-center text-[11px] font-bold uppercase tracking-widest text-slate-400">Office</p>
        <h1 className="mt-6 text-xl font-extrabold text-slate-900">{mode === "signin" ? "Sign in" : "Create staff account"}</h1>
        <form onSubmit={submit} className="mt-4 space-y-3">
          {mode === "signup" && (
            <Field label="Your name"><input className="input" required value={form.name} onChange={set("name")} /></Field>
          )}
          <Field label="Email"><input className="input" type="email" required autoComplete="email" value={form.email} onChange={set("email")} /></Field>
          <Field label="Password"><input className="input" type="password" required autoComplete={mode === "signin" ? "current-password" : "new-password"} value={form.password} onChange={set("password")} /></Field>
          {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
          <button className="btn-primary w-full py-2.5" disabled={busy}>{busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}</button>
        </form>
        <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMsg(null); }}
          className="mt-4 w-full text-center text-sm font-semibold text-primary hover:underline">
          {mode === "signin" ? "New staff member? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
