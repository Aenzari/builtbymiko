"use client";

import { profile } from "@/lib/profile";
import { Avatar } from "./avatar";
import { NavList } from "./nav-list";
import { SocialButtons } from "./social-buttons";

/**
 * Persistent left rail (desktop, >= lg). Identity on top, navigation in the
 * middle, a quiet footer at the bottom. On smaller screens this is replaced
 * by <MobileBar />.
 */
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[296px] shrink-0 p-4 lg:block">
      <div className="specular-border relative flex h-full flex-col overflow-hidden rounded-3xl bg-surface-900/80 px-7 py-9 shadow-glass backdrop-blur-xl">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-accent/10 blur-3xl" />
        <div className="flex flex-col items-center text-center">
          <Avatar size={112} />
          <h2 className="mt-5 font-mono text-sm font-semibold uppercase tracking-[0.2em] text-ink-100">
            {profile.displayName}
          </h2>
          <p className="mt-1 font-sans text-sm text-ink-400">{profile.role}</p>
          <div className="mt-5">
            <SocialButtons />
          </div>
        </div>

        <div className="my-6 h-px bg-white/[0.1]" />

        <NavList scope="sidebar" />

        <p className="mt-auto pt-6 font-mono text-[10px] uppercase leading-relaxed tracking-widest text-ink-500">
          © {new Date().getFullYear()} {profile.fullName}
        </p>
      </div>
    </aside>
  );
}
