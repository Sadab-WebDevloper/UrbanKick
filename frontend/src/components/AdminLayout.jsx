import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children, title, subtitle, headerActions }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-grow lg:ml-64 p-4 sm:p-6 md:p-8 overflow-y-auto w-full max-w-full">
        <AdminHeader 
          title={title} 
          subtitle={subtitle} 
          onMenuClick={() => setIsSidebarOpen(true)}
        >
          {headerActions}
        </AdminHeader>
        
        {/* Page Content */}
        <div className="mt-4 md:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
