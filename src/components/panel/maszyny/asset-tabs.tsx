"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetInfoTab from "./asset-info-tab";
import AssetServiceTab from "./asset-service-tab";
import AssetIssuesTab from "./asset-issue-tab";
import AssetNotesTab from "./asset-notes-tab";

interface Props {
  asset: any;
  profile: any;
  fields: any[];
  issues: any[];
  services: any[];
  isPro: boolean;
}

export default function AssetTabs({
  asset,
  profile,
  fields,
  issues,
  services,
  isPro,
}: Props) {
  return (
    <Tabs defaultValue="info">
      <TabsList className="w-full mb-6">
        <TabsTrigger value="info" className="flex-1">
          Informacje
        </TabsTrigger>
        <TabsTrigger value="service" className="flex-1">
          Serwis
        </TabsTrigger>
        <TabsTrigger value="issues" className="flex-1">
          Awarie
          {issues.length > 0 && (
            <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 font-medium px-1.5 py-0.5 rounded-md">
              {issues.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="notes" className="flex-1">
          Notatki
        </TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        <AssetInfoTab asset={asset} fields={fields} profile={profile} />
      </TabsContent>

      <TabsContent value="service">
        <AssetServiceTab
          asset={asset}
          profile={profile}
          services={services}
          isPro={isPro}
        />
      </TabsContent>

      <TabsContent value="issues">
        <AssetIssuesTab issues={issues} />
      </TabsContent>

      <TabsContent value="notes">
        <AssetNotesTab assetId={asset.id} initialNotes={asset.notes} />
      </TabsContent>
    </Tabs>
  );
}
