import { cn } from "@/lib/utils";

export default function PageHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <header className={cn("mb-5", className)}>
      <h1 className="font-medium">{title}</h1>
    </header>
  );
}
