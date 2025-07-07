import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../auth/AuthContext';
import { motion } from 'framer-motion';

export default function MyProfile() {
  const { user } = useAuth();

  return (
    <PageWrapper>
      <motion.h1
        className="text-3xl font-bold text-blue-700 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        My Profile
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 max-w-xl mx-auto"
      >
        {/* Avatar & Name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-blue-200 dark:bg-blue-900 text-white flex items-center justify-center text-2xl font-bold shadow-lg animate-pulse">
            {user.email[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{user.email}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-3 text-sm text-gray-800 dark:text-gray-300">
          <div className="flex justify-between">
            <span className="font-medium">📧 Email</span>
            <span className="truncate max-w-[60%] text-right">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">🛡️ Role</span>
            <span className="capitalize">{user.role}</span>
          </div>
          {user.patientId && (
            <div className="flex justify-between">
              <span className="font-medium">🆔 Patient ID</span>
              <span>{user.patientId}</span>
            </div>
          )}
        </div>
      </motion.div>
    </PageWrapper>
  );
}
