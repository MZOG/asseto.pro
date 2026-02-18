import { Badge } from "./ui/badge"

type Status = "working" | "maintenance" | "broken" | "closed"

const statusMap: Record<Status, string> = {
  working: "Sprawna",
  maintenance: "Serwis",
  broken: "Awaria",
  closed: "Zakończone",
}

export function StatusBadge({ status, className }: { status: Status, className?: string }) {
  return <Badge variant={status} className={className}>{statusMap[status]}</Badge>
}