import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Bell, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

import { useAuth } from '../../auth/AuthContext';
import { useApp } from '../../context/AppContext';

export default function Navbar({ onToggleSidebar }) {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const { logout, user } = useAuth();
  const { state } = useApp();
  const isAdmin = user?.role === 'admin';
  const myId = user?.patientId;

  const audioRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [readIds, setReadIds] = useState(
    () => JSON.parse(localStorage.getItem('readNotificationIds') || '[]')
  );

  const allNotifications = (isAdmin
    ? state.incidents.filter((i) => i.status !== 'Completed')
    : state.incidents.filter((i) => i.patientId === myId))
    .slice(-5)
    .reverse()
    .map((i) => ({
      id: i.id,
      message: isAdmin
        ? `Pending treatment for ${i.patientId}`
        : i.status === 'Completed'
        ? `Treatment completed: ${i.title}`
        : `Upcoming appointment: ${i.title}`,
      time: i.appointmentDate,
    }));

  const unread = allNotifications.filter((n) => !readIds.includes(n.id));

  useEffect(() => {
    if (unread.length > 0) {
      const newest = unread[0];
      if (!readIds.includes(newest.id)) {
        audioRef.current?.play();
        toast.success(`🔔 ${unread.length} new notification${unread.length > 1 ? 's' : ''}`);
      }
    }
  }, [state.incidents]);

  useEffect(() => {
    if (dropdownOpen) {
      const newRead = [...new Set([...readIds, ...allNotifications.map((n) => n.id)])];
      setReadIds(newRead);
      localStorage.setItem('readNotificationIds', JSON.stringify(newRead));
    }
  }, [dropdownOpen]);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Left: Logo & Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
          <img src="/logo.svg" alt="Logo" className="w-8 h-8 rounded-full bg-blue-100 p-1" />
          <h1 className="text-lg font-semibold text-blue-700 dark:text-white tracking-wide hidden sm:block">
            ENTNT Dental Connect
          </h1>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative cursor-pointer" onClick={() => setDropdownOpen((p) => !p)}>
            <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            {unread.length > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {unread.length}
              </span>
            )}

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-xl p-4 z-50 text-sm"
                >
                  <h4 className="font-semibold mb-2">
                    {isAdmin ? 'Admin' : 'My'} Notifications
                  </h4>
                  <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {allNotifications.length ? (
                      allNotifications.map((n) => (
                        <li key={n.id} className="text-sm text-gray-700 dark:text-gray-300 border-b pb-2">
                          <p>{n.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(n.time), { addSuffix: true })}
                          </p>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications</p>
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDark((p) => !p)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            title="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={dark ? 'sun' : 'moon'}
                initial={{ rotate: 180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -180, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Email + Logout (desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">{user?.email}</span>
            <button
              onClick={logout}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Notification sound */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
    </header>
  );
}
