"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction, type LoginActionState } from "@/lib/actions/auth-actions";

const initialState: LoginActionState = {};

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-950 px-5">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-slate/10 blur-3xl" />
      <div className="relative w-full max-w-sm rounded-[1.75rem] border border-white/10 border-t-white/25 bg-surface-900/75 p-8 shadow-glass-lg backdrop-blur-xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
          Miko / Studio
        </span>
        <h1 className="mt-4 font-sans text-4xl font-medium leading-[0.95] tracking-[-0.06em] text-ink-100">
          Continue building the system.
        </h1>

        <form action={formAction} className="mt-7 flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-mono text-[11px] uppercase tracking-widest text-ink-500">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="w-full rounded-2xl border border-white/[0.12] bg-white/[0.04] px-4 py-3 font-sans text-sm text-ink-100 outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              placeholder="miko@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="font-mono text-[11px] uppercase tracking-widest text-ink-500">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-2xl border border-white/[0.12] bg-white/[0.04] px-4 py-3 font-sans text-sm text-ink-100 outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/10 px-3.5 py-2.5 font-sans text-sm text-rose-200">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>
      </div>
    </main>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-accent font-sans text-sm font-semibold text-surface-950 outline-none focus-visible:ring-2 focus-visible:ring-accent/70 disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}
