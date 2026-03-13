import Link from "next/link";
import { Button } from "../ui/button";

export default function AddEquipmentButton() {
  const addEquipmentUrl = `/panel/maszyny/dodaj`;
  return (
    <Button asChild>
      <Link href={addEquipmentUrl}>Dodaj maszynę</Link>
    </Button>
  );
}
