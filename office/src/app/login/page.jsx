"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Field, Icon, Notice, Segmented } from "@/components/ui";
import { ADMIN_OPTION, MODULES, loginEmail, validUserId } from "@/lib/format";

// Public Web3Forms key (the same one the website forms use). Used only to email the owner about new requests.
const WEB3FORMS_KEY = "111437b6-7422-4929-b9b3-b0361d387ee0";

function PasswordInput({ value, onChange, autoComplete, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input className="input pr-16" type={show ? "text" : "password"} required autoComplete={autoComplete}
        value={value} onChange={onChange} placeholder={placeholder} />
      <button type="button" onClick={() => setShow(!show)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}

const signInError = (m = "") => {
  if (/invalid login/i.test(m)) return "Wrong User ID, password or PIN.";
  if (/banned/i.test(m)) return "This login has been switched off. Please contact the owner.";
  if (/not confirmed/i.test(m)) return "This login is not ready yet. Please contact the owner.";
  return m || "Could not sign in. Try again.";
};

export default function Login() {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ id: "", password: "", name: "", email: "" });
  const [useEmail, setUseEmail] = useState(false);
  const [perms, setPerms] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const fail = (text) => { setMsg({ tone: "red", text }); setBusy(false); };
  const togglePerm = (id) => setPerms((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const signIn = async () => {
    const { error } = await supabase().auth.signInWithPassword({ email: loginEmail(form.id), password: form.password });
    if (error) return fail(signInError(error.message));
    window.location.href = "/";
  };

  const requestAccess = async () => {
    const name = form.name.trim();
    const id = form.id.trim().toLowerCase();
    const email = form.email.trim().toLowerCase();
    if (name.length < 2) return fail("Please enter your full name.");
    if (useEmail && !/^\S+@\S+\.\S+$/.test(email)) return fail("Enter a valid email address.");
    if (!useEmail && !validUserId(id)) return fail("User ID must be 3 to 20 letters or numbers. You can also use . _ -");
    if (form.password.length < 6) return fail("Password must be at least 6 characters.");
    if (perms.length === 0) return fail("Choose at least one screen you need.");

    const { data, error } = await supabase().auth.signUp({
      email: useEmail ? email : loginEmail(id),
      password: form.password,
      options: { data: { full_name: name, ...(useEmail ? {} : { username: id }), requested_perms: perms } },
    });
    if (error) {
      if (/already/i.test(error.message)) return fail(useEmail ? "This email already has an account. Sign in instead." : "That User ID is already taken. Try another one.");
      if (/password/i.test(error.message)) return fail("Choose a stronger password (at least 6 characters).");
      return fail(error.message);
    }
    if (!data.session) {
      return fail("Your request was created, but sign-in is not switched on yet. Please tell the owner.");
    }
    // Tell the owner by email (best effort; the request is already saved either way)
    const labels = perms.map((p) => (p === "admin" ? "Admin (full access)" : MODULES.find((m) => m.id === p)?.label)).join(", ");
    fetch("https://api.web3forms.com/submit", {
      method: "POST", keepalive: true,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `Access request: ${name}`,
        from_name: "Surya's Solar Office",
        message: `${name} (${useEmail ? email : "User ID " + id}) is asking for access to: ${labels}.\n\nOpen https://app.suryassolar.com/settings, tap Team, and approve or decline.`,
      }),
    }).catch(() => {});
    window.location.href = "/";
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "signin") await signIn(); else await requestAccess();
  };

  const idLabel = mode === "signin" ? "User ID or email" : useEmail ? "Email" : "Choose a User ID";

  return (
    <div className="flex page-min items-center justify-center bg-gradient-to-b from-primary-50 via-primary-50/60 to-white p-4">
      <div className="card w-full max-w-md p-6 shadow-sm sm:p-8">
        <Image src="/logo.png" alt="Surya's Solar" width={200} height={86} className="mx-auto h-auto w-44" priority />
        <p className="mt-2 text-center text-[11px] font-bold uppercase tracking-widest text-slate-500">Office</p>

        <div className="mt-6">
          <Segmented full value={mode} onChange={(v) => { setMode(v); setMsg(null); }}
            options={[{ id: "signin", label: "Sign in" }, { id: "request", label: "Request access" }]} />
        </div>

        <h1 className="mt-5 text-xl font-bold text-slate-900">{mode === "signin" ? "Welcome back" : "Ask for access"}</h1>
        {mode === "request" && <p className="mt-1 text-sm text-slate-500">Fill this in and the owner will approve it. Once approved, your screens open by themselves.</p>}

        <form onSubmit={submit} className="mt-4 space-y-4">
          {mode === "request" && (
            <Field label="Your full name"><input className="input" required autoComplete="name" value={form.name} onChange={set("name")} /></Field>
          )}

          <Field label={idLabel}>
            {mode === "request" && useEmail
              ? <input className="input" type="email" required autoComplete="email" autoCapitalize="none" value={form.email} onChange={set("email")} />
              : <input className="input" required autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false}
                  value={form.id} onChange={set("id")} placeholder={mode === "request" ? "e.g. ravi" : ""} />}
          </Field>
          {mode === "request" && (
            <button type="button" onClick={() => setUseEmail(!useEmail)} className="-mt-2 text-xs font-semibold text-primary">
              {useEmail ? "Use a User ID instead" : "I would rather use my email"}
            </button>
          )}

          <Field label={mode === "signin" ? "Password or PIN" : "Password"}>
            <PasswordInput value={form.password} onChange={set("password")} autoComplete={mode === "signin" ? "current-password" : "new-password"} />
          </Field>
          {mode === "signin" && (
            <p className="-mt-2 text-xs text-slate-500">If you have set a PIN, type that here instead of your password.</p>
          )}

          {mode === "request" && (
            <div>
              <span className="label">Which screens do you need?</span>
              <div className="space-y-2">
                {[...MODULES, ADMIN_OPTION].map((m) => {
                  const on = perms.includes(m.id);
                  return (
                    <button type="button" key={m.id} onClick={() => togglePerm(m.id)} role="checkbox" aria-checked={on}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${on ? "border-primary bg-primary-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${on ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}>
                        <Icon name={m.icon} className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-900">{m.label}</span>
                        <span className="block text-xs text-slate-500">{m.hint}</span>
                      </span>
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${on ? "border-primary bg-primary text-white" : "border-slate-300 text-transparent"}`}>
                        <Icon name="check" className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
          <button className="btn-primary h-12 w-full text-base" disabled={busy}>
            {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Send request"}
          </button>
        </form>

        {mode === "signin" && <p className="mt-4 text-center text-xs text-slate-500">New here? Tap <b>Request access</b> above. Forgot your password or PIN? Ask an admin.</p>}
      </div>
    </div>
  );
}
