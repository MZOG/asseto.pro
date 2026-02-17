import { Badge } from "./ui/badge"

type Status = "working" | "maintenance" | "broken"

const statusMap: Record<Status, string> = {
  working: "Sprawna",
  maintenance: "Serwis",
  broken: "Awaria",
}

export function StatusBadge({ status, className }: { status: Status, className?: string }) {
  return <Badge variant={status} className={className}>{statusMap[status]}</Badge>
}