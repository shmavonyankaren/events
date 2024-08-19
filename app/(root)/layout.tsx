import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import ScrollToTop from "@/components/shared/ScrollToTop";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1 mt-[75px]">{children}</main>
      <Footer />
    </div>
  );
}
