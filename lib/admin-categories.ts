import type { ProjectCategory } from "@prisma/client";

export const CATEGORY_OPTIONS: { value: ProjectCategory; label: string }[] = [
  { value: "PRODUCT_DESIGN", label: "Product Design" },
  { value: "WEB_PLATFORM", label: "Web Platform" },
  { value: "DESIGN_ENGINEERING", label: "Design Engineering" },
  { value: "DATABASE_SYSTEMS", label: "Database Systems" },
  { value: "EXPERIMENT", label: "Experiment" },
  { value: "OPEN_SOURCE", label: "Open Source" },
];

export function categoryLabel(value: ProjectCategory): string {
  return CATEGORY_OPTIONS.find((c) => c.value === value)?.label ?? value;
}
