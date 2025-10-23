import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
