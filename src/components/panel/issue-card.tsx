import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import StatusBadge from "./status-badge";
import { Button } from "../ui/button";
import { Link } from "@/i18n/routing";
import PriorityBadge from "./awarie/priority-badge";
import { useTranslations } from "next-intl";

interface IssueProps {
  issue: {
    id: string;
    status: string | null;
    description: string | null;
    created_at: string;
    assets: { name: string } | null;
    priority: string | null;
  };
}

export default function IssueCard({ issue }: IssueProps) {
  const t = useTranslations("panel.issueCard");

  return (
    <Card>
      <CardHeader>
        <div className="flex md:flex-row justify-between items-center">
          <StatusBadge status={issue.status} />
          <PriorityBadge priority={issue.priority} />
        </div>
        <p className="text-sm font-medium mt-1">{issue.assets?.name ?? "—"}</p>
      </CardHeader>
      <CardContent>
        {issue.description && (
          <p className="text-sm text-gray-700">{issue.description}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p>
          {t("added")}{" "}
          <span className="font-medium">{formatDate(issue.created_at)}</span>
        </p>
        <Button asChild variant="outline">
          <Link
            href={{ pathname: "/panel/awarie/[id]", params: { id: issue.id } }}
          >
            {t("details")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
