import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import Breadcrumbs from "@/components/common/Breadcrumbs";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/30">
          <div className="mx-auto max-w-7xl h-full flex flex-col">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
