// src/app/panel/maszyny/dodaj/page.tsx
import PageHeader from "@/components/panel/page-header";
import AddAssetForm from "@/components/panel/add-equipment-form";

export default function DodajMaszyneePage() {
  return (
    <section>
      <PageHeader title="Dodaj maszynę" />
      <AddAssetForm />
    </section>
  );
}
