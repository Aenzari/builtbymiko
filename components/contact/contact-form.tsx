"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitContactInquiry } from "@/lib/actions/contact-actions";
import { FormField } from "./form-field";
import { ScopeTagSelector, BudgetSelector } from "./scope-and-budget";
import { SubmitButton, type SubmitStatus } from "./submit-button";
import {
  validateContactForm,
  type ContactFormValues,
  type ContactFormErrors,
} from "@/lib/contact-validation";

const INITIAL_VALUES: ContactFormValues = {
  name: "",
  email: "",
  message: "",
  scopeTags: [],
  budget: null,
};

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [honeypot, setHoneypot] = useState("");

  function updateField<K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleScopeTag(tag: string) {
    setValues((prev) => ({
      ...prev,
      scopeTags: prev.scopeTags.includes(tag)
        ? prev.scopeTags.filter((t) => t !== tag)
        : [...prev.scopeTags, tag],
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStatus("submitting");
    try {
      const result = await submitContactInquiry({ ...values, company: honeypot });
      if (!result.ok) throw new Error(result.error);
      setStatus("success");
      setValues(INITIAL_VALUES);
      setErrors({});
    } catch {
      setStatus("error");
    }
  }

  const isSuccess = status === "success";

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.14] bg-surface-800/80 p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-20 -top-32 h-64 rounded-full bg-black/[0.03] blur-3xl"
      />

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success-state"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="relative flex flex-col items-start gap-4 py-6"
            role="status"
            aria-live="polite"
          >
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
              className="specular-border flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700"
            >
              <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
                <motion.path
                  d="M2.5 7.2 5.6 10.3 11.5 3.9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, delay: 0.25 }}
                />
              </svg>
            </motion.span>
            <div>
              <h3 className="font-sans text-xl font-medium text-ink-100">
                Inquiry sent.
              </h3>
              <p className="mt-1.5 max-w-sm font-sans text-sm leading-relaxed text-ink-400">
                Thanks for writing. I read every message myself and reply by
                email.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="focus-ring mt-2 font-sans text-sm text-ink-400 underline decoration-white/20 underline-offset-4 transition-colors hover:text-ink-100"
            >
              Send another inquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            noValidate
            aria-describedby="contact-form-status"
            className="relative flex flex-col gap-6"
          >
            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-500">
                Send a message
              </span>
              <h3 className="mt-2 font-sans text-2xl font-medium tracking-tight text-ink-100 sm:text-3xl">
                Tell me what you have in mind.
              </h3>
            </div>

            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="company">Company (leave empty)</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                label="Name"
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={(e) => updateField("name", e.target.value)}
                error={errors.name}
                placeholder="Ada Lovelace"
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => updateField("email", e.target.value)}
                error={errors.email}
                placeholder="ada@example.com"
              />
            </div>

            <FormField
              as="textarea"
              label="Project details"
              name="message"
              value={values.message}
              onChange={(e) => updateField("message", e.target.value)}
              error={errors.message}
              placeholder="What are you building or looking for, and is there a deadline?"
            />

            <ScopeTagSelector
              selected={values.scopeTags}
              onToggle={toggleScopeTag}
              error={errors.scopeTags}
            />

            <BudgetSelector
              selected={values.budget}
              onSelect={(value) => updateField("budget", value)}
              error={errors.budget}
            />

            <div className="mt-1 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SubmitButton status={status} />
              <p
                id="contact-form-status"
                className="font-sans text-xs text-ink-500"
                role="status"
                aria-live="polite"
              >
                {status === "error"
                  ? "The request failed — please try again."
                  : "I reply by email. No newsletter."}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
