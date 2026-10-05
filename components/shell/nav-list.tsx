"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { layoutSpring, snappySpring, tapScale } from "@/lib/motion";
import { Icon } from "./icons";
import { NAV_ITEMS, isActivePath } from "./nav-items";

interface NavListProps {
  /** Namespaces the layoutId so the sidebar and the mobile sheet never share a pill. */
  scope: "sidebar" | "sheet";
  onNavigate?: () => void;
}

export function NavList({ scope, onNavigate }: NavListProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  return (
    <nav aria-label="Primary">
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <li key={item.href}>
              <motion.div whileTap={{ scale: tapScale.button }} transition={snappySpring}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  data-cursor="link"
                  className="relative flex min-h-[46px] items-center rounded-2xl px-4 font-sans text-[15px] font-medium outline-none transition-colors duration-200 hover:bg-black/[0.03] focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
                  style={{ color: active ? "#2B2B26" : "#5A5A50" }}
                >
                  {active && (
                    <motion.span
                      layoutId={`nav-pill-${scope}`}
                      className="specular-border absolute inset-0 rounded-2xl bg-accent/15"
                      transition={prefersReducedMotion ? { duration: 0.15 } : layoutSpring}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <Icon name={item.icon} size={18} />
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
