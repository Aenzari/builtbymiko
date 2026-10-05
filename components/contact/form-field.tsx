"use client";

import { forwardRef, useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  as?: "input" | "textarea";
  name: string;
}

/**
 * Shared glass-morphism field for the contact form. On a new validation
 * error, the field plays a short horizontal shake — spring-driven (not a
 * CSS keyframe), so it settles naturally rather than stopping dead.
 */
export const FormField = forwardRef<HTMLInputElement & HTMLTextAreaElement, FormFieldProps>(
  function FormField({ label, error, as = "input", name, className, ...rest }, ref) {
    const controls = useAnimationControls();
    const [errorId] = useState(() => `${name}-error`);

    useEffect(() => {
      if (error) {
        controls.start({
          x: [0, -6, 6, -4, 4, 0],
          transition: { duration: 0.4, ease: "easeInOut" },
        });
      }
    }, [error, controls]);

    const sharedClassName =
      "focus-ring w-full rounded-2xl border bg-black/[0.02] px-4 py-3.5 font-sans text-sm text-ink-100 placeholder:text-ink-500 transition-colors duration-200 outline-none";
    const borderClassName = error
      ? "border-red-400/40 focus:border-red-400/60"
      : "border-black/[0.08] focus:border-black/[0.16]";

    return (
      <motion.div animate={controls} className="flex flex-col gap-2">
        <label htmlFor={name} className="font-mono text-[11px] uppercase tracking-widest text-ink-500">
          {label}
        </label>
        {as === "textarea" ? (
          <textarea
            id={name}
            name={name}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            rows={5}
            className={`${sharedClassName} ${borderClassName} resize-none ${className ?? ""}`}
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={name}
            name={name}
            ref={ref as React.Ref<HTMLInputElement>}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`${sharedClassName} ${borderClassName} ${className ?? ""}`}
            {...rest}
          />
        )}
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-xs text-red-600"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);
