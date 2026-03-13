import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import StatusBadge from "./status-badge";
import { Button } from "../ui/button";
import Link from "next/link";

interface AssetsProps {
  asset: {
    id: number;
    name: string;
    status: string;
    serial_number: string;
    created_at: string;
    issues: {};
    assets: {
      name: string;
    };
  };
}

export default function AssetsCard({ asset }: AssetsProps) {
  const issuesCount = (asset.issues as any)[0].count;
  return (
    <Card>
      <CardHeader>
        <StatusBadge status={asset.status} />
        <p className="text-sm font-medium mt-1">{asset.name}</p>
      </CardHeader>
      <CardContent>
        <p>
          Numer seryjny:{" "}
          <span className="font-medium">{asset.serial_number}</span>
        </p>
        <p>
          Ilość awarii: <span className="font-medium">{issuesCount}</span>
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* <p>
          Dodano:{" "}
          <span className="font-medium">{formatDate(asset.created_at)}</span>
        </p> */}
        <Button asChild variant="secondary">
          <Link href={`/report/${asset.id}`}>Szybkie zgłoszenie</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/panel/maszyny/${asset.id}`}>Szczegóły</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
