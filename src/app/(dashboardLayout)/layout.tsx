import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-900 text-white">
      <SidebarProvider>
        <AppSidebar />
        <main className="p-2 w-screen">
          <SidebarTrigger />
          <div className="p-2">
          {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
