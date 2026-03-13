export default function PageHeader({ title }: { title: string }) {
  return (
    <header className="mb-5">
      <h1 className="font-medium">{title}</h1>
    </header>
  );
}
