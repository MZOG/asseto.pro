export const priorityConfig = {
  low: {
    label: "Niski",
    className: "bg-gray-100 text-gray-500",
    dot: "bg-gray-400",
  },
  normal: {
    label: "Normalny",
    className: "bg-blue-100 text-blue-600",
    dot: "bg-blue-500",
  },
  high: {
    label: "Wysoki",
    className: "bg-orange-100 text-orange-600",
    dot: "bg-orange-500",
  },
  critical: {
    label: "Krytyczny",
    className: "bg-red-100 text-red-600",
    dot: "bg-red-500",
  },
} as const;

export type Priority = keyof typeof priorityConfig;

export function getPriority(priority: string | null) {
  return priorityConfig[priority as Priority] ?? priorityConfig.normal;
}
