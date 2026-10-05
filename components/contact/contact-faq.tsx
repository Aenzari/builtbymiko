"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/shell/icons";
import { SocialButtons } from "@/components/shell/social-buttons";
import { FAQS } from "@/lib/faqs";
import { profile } from "@/lib/profile";

/**
 * Dark FAQ card beside the light form: the contrast is what makes the
 * contact page feel like two distinct jobs (read quick answers / write a
 * message). One item open at a time; each header is a real button wired
 * to its panel with aria-expanded / aria-controls.
 */
export function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-label="Frequently asked questions"
      className="flex flex-col rounded-[1.75rem] bg-gradient-to-br from-ink-100 via-ink-100 to-accent-strong p-6 text-surface-950 sm:p-8"
    >
      <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-accent-soft">FAQs</p>
      <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight">Quick answers.</h2>
      <p className="font-sans text-2xl font-semibold tracking-tight text-surface-950/60">
        Still have one? Write me.
      </p>

      <ul className="mt-6 divide-y divide-white/15 border-y border-white/15">
        {FAQS.map((faq, i) => {
          const open = openIndex === i;
          const panelId = `${baseId}-panel-${i}`;
          const buttonId = `${baseId}-button-${i}`;
          return (
            <li key={faq.question}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : i)}
                  data-cursor="link"
                  className="flex min-h-[52px] w-full items-center gap-4 rounded-lg py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-ink-100"
                >
                  <span className="font-mono text-[11px] font-semibold text-accent-soft">0{i + 1}</span>
                  <span className="flex-1 font-sans text-[15px] font-medium">{faq.question}</span>
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
                    className="shrink-0 text-surface-950/70"
                  >
                    <Icon name="chevron" size={18} />
                  </motion.span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 pl-9 pr-2 font-sans text-sm leading-relaxed text-surface-950/75">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={`mailto:${profile.email}`}
          data-cursor="link"
          className="inline-flex min-h-[44px] items-center gap-2 self-start rounded-full border border-white/15 bg-white/10 px-4 py-2 font-sans text-sm outline-none transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-ink-100"
        >
          <Icon name="mail" size={16} />
          <span className="truncate">{profile.email}</span>
        </a>
        <SocialButtons tone="dark" />
      </div>
    </section>
  );
}
