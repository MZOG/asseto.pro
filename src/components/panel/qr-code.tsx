"use client";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import {
  getPrintPageStyle,
  printSizes,
  printSizePx,
  type PrintSize,
} from "@/lib/utils";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createClient } from "@/lib/supabase/client";

interface QrCodeProps {
  assetId: number;
  assetName: string;
  labelTop?: string | null;
  labelBottom?: string | null;
  printSize?: PrintSize | null;
  defaultPrintSize?: PrintSize;
}

export function QrCode({
  assetId,
  assetName,
  labelTop,
  labelBottom,
  printSize,
  defaultPrintSize = "S",
}: QrCodeProps) {
  const [selectedSize, setSelectedSize] = useState<PrintSize>(
    (printSize ?? defaultPrintSize) as PrintSize,
  );
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL}/report/${assetId}`;

  const handleSizeChange = async (size: PrintSize) => {
    setSelectedSize(size);
    const supabase = await createClient();
    await supabase
      .from("assets")
      .update({ qr_print_size: size })
      .eq("id", assetId);
  };

  const generate = async () => {
    const px = printSizePx[selectedSize];
    const url = await QRCode.toDataURL(reportUrl, {
      width: px * 2, // 2x dla ostrości
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });
    setQrUrl(url);
  };

  useEffect(() => {
    generate();
  }, [assetId, selectedSize]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `QR_${assetName}`,
    pageStyle: getPrintPageStyle(selectedSize),
  });

  if (!qrUrl)
    return <div className="w-48 h-48 bg-gray-100 animate-pulse rounded-lg" />;

  return (
    <div className="flex flex-col items-start gap-4">
      {/* Podgląd */}
      <div
        ref={printRef}
        className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl w-fit"
      >
        {labelTop && (
          <p className="text-sm font-semibold text-gray-800 text-center">
            {labelTop}
          </p>
        )}
        <img src={qrUrl} alt="QR kod" className="w-48 h-48" />
        {labelBottom && (
          <p className="text-xs text-gray-500 text-center">{labelBottom}</p>
        )}
        <p className="text-[10px] text-gray-300 font-mono">{assetName}</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-gray-500">Rozmiar wydruku</Label>
        <Select value={selectedSize} onValueChange={handleSizeChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {printSizes.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Akcje */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => handlePrint()}>
          <Download size={14} className="mr-1.5" />
          Pobierz PDF
        </Button>
        <Button variant="ghost" size="sm" onClick={generate}>
          <RefreshCw size={14} className="mr-1.5" />
          Generuj nowy
        </Button>
      </div>
    </div>
  );
}
