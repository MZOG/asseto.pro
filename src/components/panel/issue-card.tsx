import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import StatusBadge from "./status-badge";
import { Button } from "../ui/button";
import Link from "next/link";

interface IssueProps {
  issue: {
    id: number;
    status: string;
    description: string;
    created_at: string;
    assets: {
      name: string;
    };
  };
}

export default function IssueCard({ issue }: IssueProps) {
  return (
    <Card key={issue.id} className="">
      <CardHeader>
        <StatusBadge status={issue.status} />
        <p className="text-sm font-medium mt-1">{issue.assets.name}</p>
      </CardHeader>
      <CardContent>
        {issue.description && (
          <p className="text-sm text-gray-700">{issue.description}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p>
          Dodano:{" "}
          <span className="font-medium">{formatDate(issue.created_at)}</span>
        </p>
        <Button asChild variant="outline">
          <Link href={`/panel/awarie/${issue.id}`}>Szczegóły</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
