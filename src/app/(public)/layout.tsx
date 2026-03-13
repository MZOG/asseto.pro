import Footer from "@/components/public/footer";
import Header from "@/components/public/header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="mt-20">{children}</main>
      <Footer />
    </>
  );
}
