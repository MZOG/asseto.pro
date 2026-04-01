"use client";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import StatusBadge from "./status-badge";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface AssetsProps {
  asset: {
    id: number;
    name: string;
    status: string;
    serial_number: string;
    created_at: string;
    issues: {};
    assets: { name: string };
  };
}

export default function AssetsCard({ asset }: AssetsProps) {
  const t = useTranslations("panel.assetsCard");
  const issuesCount = (asset.issues as any)[0].count;

  return (
    <Card>
      <CardHeader>
        <StatusBadge status={asset.status} />
        <p className="text-sm font-medium mt-1">{asset.name}</p>
      </CardHeader>
      <CardContent>
        <p>
          {t("serialNumber")}{" "}
          <span className="font-medium">{asset.serial_number}</span>
        </p>
        <p>
          {t("issuesCount")} <span className="font-medium">{issuesCount}</span>
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="secondary">
          <Link href={{ pathname: "/report/[id]", params: { id: asset.id } }}>
            {t("quickReport")}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link
            href={{ pathname: "/panel/maszyny/[id]", params: { id: asset.id } }}
          >
            {t("details")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
