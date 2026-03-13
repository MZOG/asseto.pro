import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Dzisiaj";
  if (diffDays === 1) return "Wczoraj";
  if (diffDays < 7) return `${diffDays} dni temu`;

  return date.toLocaleString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// status badge
export const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  broken: { label: "Uszkodzona", className: "bg-red-100 text-red-700" },
  maintenance: {
    label: "W serwisie",
    className: "bg-yellow-100 text-yellow-700",
  },
  working: { label: "Sprawna", className: "bg-green-100 text-green-700" },
  closed: { label: "Zamknięta", className: "bg-gray-100 text-gray-500" },
};

export function getStatus(status: string | null) {
  return (
    statusConfig[status ?? ""] ?? {
      label: "Nieznany",
      className: "bg-gray-100 text-gray-500",
    }
  );
}

// print settings
export const printSizes = [
  { value: "S", label: "Mały (60 × 60 mm)" },
  { value: "M", label: "Średni (90 × 90 mm)" },
  { value: "L", label: "Duży (120 × 120 mm)" },
  { value: "XL", label: "Bardzo duży (150 × 150 mm)" },
] as const;

export type PrintSize = (typeof printSizes)[number]["value"];

export const printSizePx: Record<PrintSize, number> = {
  S: 227, // ~60mm przy 96dpi
  M: 340, // ~90mm
  L: 454, // ~120mm
  XL: 567, // ~150mm
};

export function getPrintPageStyle(size: PrintSize) {
  const px = printSizePx[size];
  return `
    @page { margin: 10mm 0 0 10mm; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
    img { width: ${px}px !important; height: ${px}px !important; }
  `;
}
