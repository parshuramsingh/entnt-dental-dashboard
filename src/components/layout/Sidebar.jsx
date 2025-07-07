// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import {
  Home, Users, ClipboardList, Calendar, User,
  Stethoscope, X, LogOut
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/patients', label: 'Patients', icon: Users, roles: ['admin'] },
  { to: '/incidents', label: 'Incidents', icon: ClipboardList, roles: ['admin'] },
  { to: '/calendar', label: 'Calendar', icon: Calendar, roles: ['admin'] },
  { to: '/history', label: 'My Treatments', icon: Stethoscope, roles: ['patient'] },
  { to: '/profile', label: 'My Profile', icon: User },
];

export default function Sidebar({ role, isOpen = false, onClose = () => {} }) {
  const { logout } = useAuth();

  const content = (
    <>
      {/* Logo / Title */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <img src="/logo.svg" alt="Logo" className="w-8 h-8 bg-white rounded-full p-1" />
        <span className="text-2xl font-bold tracking-wide">ENTNT</span>
      </motion.div>

      {/* Nav Links */}
      <nav className="space-y-2 flex-1">
        {links
          .filter(link => !link.roles || link.roles.includes(role))
          .map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white font-semibold'
                    : 'hover:bg-white/10 text-white/90'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
      </nav>

      {/* Mobile Logout */}
      <div className="mt-6 md:hidden">
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="flex items-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-br from-blue-700 to-blue-900 text-white min-h-screen p-6 shadow-xl">
        {content}
      </aside>

      {/* Mobile with framer-motion */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Sidebar Panel */}
            <motion.aside
              key="panel"
              className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-blue-700 to-blue-900 text-white p-6 shadow-2xl md:hidden flex flex-col"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded hover:bg-white/10"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>

              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
