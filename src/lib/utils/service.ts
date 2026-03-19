import { Search, Wrench, RefreshCw } from "lucide-react";

export const serviceTypeConfig = {
  inspection: {
    label: "Przegląd",
    className: "bg-blue-100 text-blue-700",
    icon: Search,
  },
  repair: {
    label: "Naprawa",
    className: "bg-orange-100 text-orange-700",
    icon: Wrench,
  },
  replacement: {
    label: "Wymiana części",
    className: "bg-purple-100 text-purple-700",
    icon: RefreshCw,
  },
} as const;
