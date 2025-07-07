import { motion } from 'framer-motion';
import Card from './Card';

export default function StatCard({ title, value, icon: Icon, footer }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="flex items-center justify-between">
        <div>
          <h4 className="text-sm text-gray-500">{title}</h4>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {footer && <p className="text-xs text-gray-400 mt-1">{footer}</p>}
        </div>
        {Icon && <Icon className="w-8 h-8 text-accent" />}
      </Card>
    </motion.div>
  );
}
