"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Project as PrismaProject } from "@prisma/client";
import { snappySpring, tapScale } from "@/lib/motion";
import { CATEGORY_OPTIONS } from "@/lib/admin-categories";
import type { ProjectActionState, ProjectInput } from "@/lib/actions/project-actions";

type FormAction = (
  prevState: ProjectActionState,
  formData: FormData
) => Promise<ProjectActionState>;

interface ProjectFormProps {
  action: FormAction;
  /** Present when editing an existing row; absent when creating. */
  initialProject?: PrismaProject;
  submitLabel: string;
}

interface MetricRow {
  key: string;
  label: string;
  value: string;
}

function toMetricRows(project?: PrismaProject): MetricRow[] {
  const metrics = (project?.metrics as unknown as { label: string; value: string }[]) ?? [];
  if (metrics.length === 0) return [{ key: crypto.randomUUID(), label: "", value: "" }];
  return metrics.map((m) => ({ key: crypto.randomUUID(), ...m }));
}

const initialState: ProjectActionState = {};

export function ProjectForm({ action, initialProject, submitLabel }: ProjectFormProps) {
  const router = useRouter();
  const [state, formAction] = useFormState(action, initialState);
  const [metrics, setMetrics] = useState<MetricRow[]>(() => toMetricRows(initialProject));

  const fieldErrors = state.fieldErrors ?? {};

  function updateMetric(key: string, field: "label" | "value", newValue: string) {
    setMetrics((rows) => rows.map((row) => (row.key === key ? { ...row, [field]: newValue } : row)));
  }

  function addMetric() {
    if (metrics.length >= 6) return;
    setMetrics((rows) => [...rows, { key: crypto.randomUUID(), label: "", value: "" }]);
  }

  function removeMetric(key: string) {
    setMetrics((rows) => rows.filter((row) => row.key !== key));
  }

  useEffect(() => {
    if (state.success) {
      router.push("/admin");
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Title"
          name="title"
          defaultValue={initialProject?.title}
          error={fieldErrors.title}
          required
        />
        <Field
          label="Slug"
          name="slug"
          defaultValue={initialProject?.slug}
          error={fieldErrors.slug}
          placeholder="swiftdo"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="font-mono text-[11px] uppercase tracking-widest text-[#8A8F86]">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={initialProject?.category ?? "WEB_PLATFORM"}
            className="w-full rounded-2xl border border-black/[0.08] bg-white/80 px-4 py-3 font-sans text-sm text-[#2B2B26] outline-none focus-visible:ring-2 focus-visible:ring-[#8A9A82]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <Field
          label="Year"
          name="year"
          type="number"
          defaultValue={initialProject?.year?.toString() ?? new Date().getFullYear().toString()}
          error={fieldErrors.year}
          required
        />
        <Field
          label="Accent color"
          name="accentColor"
          defaultValue={initialProject?.accentColor ?? "#8A9A82"}
          error={fieldErrors.accentColor}
          placeholder="#8A9A82"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field label="Client" name="client" defaultValue={initialProject?.client ?? ""} error={fieldErrors.client} />
        <Field label="Role" name="role" defaultValue={initialProject?.role ?? ""} error={fieldErrors.role} />
        <Field
          label="Deployment"
          name="deployment"
          defaultValue={initialProject?.deployment ?? ""}
          error={fieldErrors.deployment}
          placeholder="Vercel · Production"
        />
      </div>

      <TextAreaField
        label="Summary"
        name="summary"
        rows={2}
        defaultValue={initialProject?.summary}
        error={fieldErrors.summary}
        required
      />

      <TextAreaField
        label="Description"
        name="description"
        rows={5}
        defaultValue={initialProject?.description}
        error={fieldErrors.description}
        required
      />

      <Field
        label="Tech stack (comma-separated)"
        name="stack"
        defaultValue={initialProject?.stack?.join(", ")}
        error={fieldErrors.stack}
        placeholder="Next.js, PostgreSQL, Prisma"
        required
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Live demo URL" name="demoUrl" type="url" defaultValue={initialProject?.demoUrl ?? ""} error={fieldErrors.demoUrl} />
        <Field label="Repository URL" name="repoUrl" type="url" defaultValue={initialProject?.repoUrl ?? ""} error={fieldErrors.repoUrl} />
      </div>

      <fieldset>
        <legend className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-[#8A8F86]">
          Metrics
        </legend>
        <div className="flex flex-col gap-2">
          {metrics.map((row) => (
            <div key={row.key} className="flex gap-2">
              <input
                name="metricLabel"
                value={row.label}
                onChange={(e) => updateMetric(row.key, "label", e.target.value)}
                placeholder="Label (e.g. Users)"
                className="w-1/2 rounded-xl border border-black/[0.08] bg-white/80 px-3.5 py-2.5 font-sans text-sm text-[#2B2B26] outline-none focus-visible:ring-2 focus-visible:ring-[#8A9A82]/50"
              />
              <input
                name="metricValue"
                value={row.value}
                onChange={(e) => updateMetric(row.key, "value", e.target.value)}
                placeholder="Value (e.g. 1.2k)"
                className="w-1/2 rounded-xl border border-black/[0.08] bg-white/80 px-3.5 py-2.5 font-sans text-sm text-[#2B2B26] outline-none focus-visible:ring-2 focus-visible:ring-[#8A9A82]/50"
              />
              <button
                type="button"
                onClick={() => removeMetric(row.key)}
                aria-label="Remove metric"
                className="shrink-0 rounded-xl border border-black/[0.08] px-3 text-[#8A2E2E] outline-none transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-300"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {metrics.length < 6 && (
          <button
            type="button"
            onClick={addMetric}
            className="mt-2 font-sans text-sm text-[#5F6B58] underline decoration-[#8A9A82]/40 underline-offset-4 hover:text-[#2B2B26]"
          >
            + Add metric
          </button>
        )}
      </fieldset>

      <div className="flex items-center gap-3">
        <input
          id="isFlagship"
          name="isFlagship"
          type="checkbox"
          defaultChecked={initialProject?.isFlagship}
          className="h-4 w-4 rounded border-black/20 accent-[#8A9A82]"
        />
        <label htmlFor="isFlagship" className="font-sans text-sm text-[#2B2B26]">
          Flagship (shown as the large highlight card)
        </label>
      </div>

      <input type="hidden" name="sortOrder" value={initialProject?.sortOrder ?? 0} />

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <motion.button
      type="submit"
      disabled={pending}
      whileTap={{ scale: tapScale.button }}
      transition={snappySpring}
      className="flex min-h-[48px] items-center justify-center rounded-full bg-[#2B2B26] px-6 py-3 font-sans text-sm font-medium text-[#FAFAFA] outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-[#8A9A82]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA] disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </motion.button>
  );
}

interface FieldProps {
  label: string;
  name: keyof ProjectInput | string;
  type?: string;
  defaultValue?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

function Field({ label, name, type = "text", defaultValue, error, placeholder, required }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="font-mono text-[11px] uppercase tracking-widest text-[#8A8F86]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={`w-full rounded-2xl border bg-white/80 px-4 py-3 font-sans text-sm text-[#2B2B26] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA] ${
          error ? "border-red-300 focus-visible:ring-red-300" : "border-black/[0.08] focus-visible:ring-[#8A9A82]/50"
        }`}
      />
      {error && (
        <p className="font-sans text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function TextAreaField({
  label,
  name,
  rows,
  defaultValue,
  error,
  required,
}: {
  label: string;
  name: string;
  rows: number;
  defaultValue?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="font-mono text-[11px] uppercase tracking-widest text-[#8A8F86]">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        required={required}
        className={`w-full resize-none rounded-2xl border bg-white/80 px-4 py-3 font-sans text-sm text-[#2B2B26] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA] ${
          error ? "border-red-300 focus-visible:ring-red-300" : "border-black/[0.08] focus-visible:ring-[#8A9A82]/50"
        }`}
      />
      {error && (
        <p className="font-sans text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
