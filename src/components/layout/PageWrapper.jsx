import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { motion } from 'framer-motion';

import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function PageWrapper({ children }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Added state

  return (
    <div className="flex bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen text-gray-900 dark:text-white">
      {/* Sidebar with toggle support */}
      <Sidebar
        role={user?.role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Optional overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pass toggle callback to Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="p-6 space-y-6 overflow-y-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
