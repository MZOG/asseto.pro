"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import AssetsCard from "@/components/panel/assets-card";
import { useTranslations } from "next-intl";

interface Asset {
  id: number;
  name: string;
  status: string;
  serial_number: string;
  created_at: string;
  image_url?: string | null;
  issues: {};
}

export default function AssetsList({ assets }: { assets: Asset[] }) {
  const t = useTranslations("panel.assetsPage");
  const [query, setQuery] = useState("");

  const filtered =
    assets?.filter(
      (a) =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.serial_number?.toLowerCase().includes(query.toLowerCase()),
    ) ?? [];

  return (
    <>
      <div className="relative mb-5">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <Input
          placeholder={t("search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400">{t("noResults")}</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((asset) => (
            <AssetsCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </>
  );
}
