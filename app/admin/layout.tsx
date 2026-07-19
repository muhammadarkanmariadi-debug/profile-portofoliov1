import React from 'react';
import Sidebar from '@/app/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-panel min-h-screen bg-[#050505] text-white flex flex-col md:flex-row font-sans">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden md:h-screen md:overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
