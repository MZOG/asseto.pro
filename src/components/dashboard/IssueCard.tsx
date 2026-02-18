import { cn, formatDate } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Check, TriangleAlert } from "lucide-react";
import { StatusBadge } from "../StatusBadge";

interface IssueProps {
  issue: {
    id: string;
    status: "working" | "maintenance" | "broken" | "closed";
    created_at: string;
    description: string;
    closed_at: string | null;
    assets: {
      name: string;
    };
  };
}

export default function IssueCard({ issue }: IssueProps) {
  return (
    <Link
      to={`/dashboard/issues/$id`}
      params={{ id: issue.id }}
      className={cn(
        'block p-3 rounded-md',
        issue.status === 'broken'
          ? 'bg-red-50/70 border border-red-100 hover:bg-red-100/50 space-y-1'
          : issue.status === 'maintenance'
            ? 'bg-amber-50 border border-amber-200 hover:bg-amber-100/50'
            : 'bg-blue-50/70 border border-blue-100 hover:bg-blue-100/50',
      )}
    >
      <div className="flex justify-between items-center">
        <h2 className="flex items-center gap-2 font-medium">
          {issue.status === 'broken' && <TriangleAlert size={15} className="text-red-400" />}
          {issue.status === 'maintenance' && <TriangleAlert size={15} className="text-amber-400" />}
          {issue.status === 'closed' && <Check size={15} className="text-blue-600" />}
          {issue.assets?.name}
        </h2>
        <p className="text-xs capitalize">{formatDate(issue.created_at, true)}</p>
      </div>

      <div className="grid grid-cols-5 mt-3">
        <div className="col-span-2 flex flex-col gap-1">
          <StatusBadge status={issue.status} className='mt-1 self-start' />
          {issue.closed_at && <p className="text-xs text-muted-foreground">{formatDate(issue.closed_at)}</p>}
        </div>

        <div className="text-sm col-span-3">
          <p className="font-medium">Opis:</p>
          <p>{issue.description}</p>
        </div>
      </div>
    </Link>
  )
}