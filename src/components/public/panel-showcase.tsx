"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useLocale, useTranslations } from "next-intl";

const images = [
  "/screenshots/panel-dashboard.png",
  "/screenshots/panel-issues.png",
  "/screenshots/panel-issue-id.png",
  "/screenshots/panel-assets.png",
  "/screenshots/panel-asset-id.png",
  "/screenshots/panel-services.png",
  "/screenshots/issue-form.png",
];

export default function PanelShowcase() {
  const t = useTranslations("landing.panelShowcase");
  const tabs = t.raw("tabs") as { label: string; description: string }[];
  const [active, setActive] = useState(0);
  const locale = useLocale();

  console.log(locale);

  return (
    <section className="pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab, i) => (
            <Button
              key={tab.label}
              onClick={() => setActive(i)}
              variant={active === i ? "asseto" : "outline"}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all border"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mb-6 h-5 transition-all">
          {tabs[active].description}
        </p>

        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200/60">
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 max-w-xs mx-auto text-center">
                asseto.pro/{locale === "pl" ? "panel" : "dashboard"}
              </div>
            </div>
          </div>

          <div className="relative w-full h-125">
            {images.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={tabs[i]?.label ?? ""}
                fill
                sizes="(max-width: 768px) 100vw, 1100px"
                className={`object-cover object-top transition-opacity duration-300 ${
                  active === i ? "opacity-100" : "opacity-0"
                }`}
                priority={i === 0}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-1.5 mt-5">
          {tabs.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                active === i ? "w-5 bg-gray-900" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
