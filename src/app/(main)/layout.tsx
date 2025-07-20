import { Sidebar } from "@/components/ui/navigation/Sidebar";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-screen-2xl">
      <Sidebar />
      <main className="lg:pl-72">{children}</main>
    </div>
  );
}
