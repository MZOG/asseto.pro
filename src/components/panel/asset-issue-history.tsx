import Link from "next/link";
import { formatDate, getStatus } from "@/lib/utils";

interface Issue {
  id: number;
  created_at: string;
  description: string | null;
  status: string | null;
}

export default function AssetIssueHistory({ issues }: { issues: Issue[] }) {
  if (issues.length === 0) {
    return <p className="text-sm text-gray-400">Brak historii awarii.</p>;
  }

  return (
    <div className="space-y-2">
      {issues.map((issue) => {
        const { label, className } = getStatus(issue.status);
        return (
          <Link
            key={issue.id}
            href={`/panel/awarie/${issue.id}`}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 truncate">
                {issue.description ?? "—"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDate(issue.created_at)}
              </p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ml-3 shrink-0 ${className}`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
