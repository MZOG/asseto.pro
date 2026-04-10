"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import PL from "country-flag-icons/react/3x2/PL";
import GB from "country-flag-icons/react/3x2/GB";
import DE from "country-flag-icons/react/3x2/DE";
import { useParams } from "next/navigation";

const languages = [
  { code: "pl", label: "PL", Flag: PL },
  { code: "en", label: "EN", Flag: GB },
  { code: "de", label: "DE", Flag: DE },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === locale) ?? languages[0];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const switchLocale = (code: string) => {
    router.replace(
      // @ts-expect-error — params mogą zawierać dowolne klucze
      { pathname, params },
      { locale: code },
    );
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 px-2 py-1.5 rounded-sm hover:bg-gray-100 transition-colors"
      >
        <current.Flag className="w-4 h-auto rounded-xs border border-gray-100" />
        {/* <span>{current.label}</span> */}
        <ChevronDown
          size={11}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg overflow-hidden z-50 min-w-18 ">
          {languages.map(({ code, label, Flag }) => (
            <button
              key={code}
              onClick={() => switchLocale(code)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors hover:bg-gray-50 cursor-pointer ${
                code === locale
                  ? "text-blue-600 bg-blue-50/50"
                  : "text-gray-600"
              }`}
            >
              <Flag className="w-4 h-auto rounded-xs" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
