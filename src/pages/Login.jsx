import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const buttonVariants = { hover: { scale: 1.05, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', transition: { duration: 0.2 } } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Invalid email');
    if (form.password.length < 6) return setError('Password too short');
    setLoading(true);
    setError('');
    if (!login(form.email, form.password)) {
      setError('Invalid credentials');
      setLoading(false);
      return;
    }
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
      <img src="/clinic.jpg" alt="Clinic" className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.target.src = '/fallback-clinic.jpg')} />
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/20 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl max-w-md w-full text-gray-800 dark:text-white"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/logo.svg" alt="ENTNT" className="h-8 w-8 rounded-full bg-white p-1 shadow" onError={(e) => (e.target.src = '/fallback-logo.png')} />
          <h1 className="text-xl font-bold text-blue-700 dark:text-white">ENTNT Dental</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(''); }}
            aria-label="Email"
            disabled={loading}
          />
          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(''); }}
            aria-label="Password"
            disabled={loading}
          />
          {error && (
            <div className="flex items-center justify-between bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 text-sm p-2 rounded">
              <p>{error}</p>
              <button onClick={() => setError('')} aria-label="Dismiss error"><X size={16} /></button>
            </div>
          )}
          <motion.div whileHover="hover" variants={buttonVariants}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </motion.div>
        </form>
        <p className="text-center text-xs text-gray-600 dark:text-gray-300 mt-3">
          Admin: <strong>admin@entnt.in / admin123</strong><br />
          Patient: <strong>john@entnt.in / john123</strong>
        </p>
      </motion.div>
    </div>
  );
}