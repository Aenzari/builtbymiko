"use client";

import { motion } from "framer-motion";
import { snappySpring, tapScale } from "@/lib/motion";
import { profile } from "@/lib/profile";
import { Icon, type IconName } from "./icons";

const LINKS: { label: string; href: string; icon: IconName; external: boolean }[] = [
  { label: "GitHub", href: profile.socials.github, icon: "github", external: true },
  { label: "LinkedIn", href: profile.socials.linkedin, icon: "linkedin", external: true },
  { label: "Email", href: `mailto:${profile.email}`, icon: "mail", external: false },
];

interface SocialButtonsProps {
  /** "dark" is for use on dark surfaces such as the contact FAQ card. */
  tone?: "light" | "dark";
}

export function SocialButtons({ tone = "light" }: SocialButtonsProps) {
  const toneClass =
    tone === "dark"
      ? "border border-white/15 bg-white/10 text-surface-950 hover:bg-white/20 focus-visible:ring-offset-ink-100"
      : "specular-border bg-white/70 text-ink-100 hover:bg-white focus-visible:ring-offset-surface-950";
  return (
    <div className="flex items-center gap-2.5">
      {LINKS.map((link) => (
        <motion.a
          key={link.label}
          href={link.href}
          aria-label={link.label}
          data-cursor="link"
          {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          whileTap={{ scale: tapScale.button }}
          transition={snappySpring}
          className={`flex h-11 w-11 items-center justify-center rounded-full outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 ${toneClass}`}
        >
          <Icon name={link.icon} size={18} />
        </motion.a>
      ))}
    </div>
  );
}
