import { useApp } from '../context/AppContext';
import { useAuth } from '../auth/AuthContext';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function TreatmentHistory() {
  const { state } = useApp();
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';

  const treatments = state.incidents.filter(
    (i) => isAdmin || i.patientId === user.patientId
  );

  const totalSpent = treatments.reduce(
    (sum, i) => sum + Number(i.cost || 0), 0
  );

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        {isAdmin ? 'All Treatment Records' : 'My Treatment History'}
      </h1>

      <Card className="mb-8 bg-blue-50/40 border border-blue-100 shadow-sm">
        <p className="text-lg font-semibold text-blue-800">
          💰 Total Spent:{' '}
          <span className="text-blue-700">
            {totalSpent.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 0,
            })}
          </span>
        </p>
      </Card>

      {treatments.length ? (
        <div className="space-y-6">
          {treatments.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="border border-gray-200 shadow-md hover:shadow-lg transition">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {t.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {format(new Date(t.appointmentDate), 'PPpp')}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      t.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                {t.treatment && (
                  <p className="mb-2 text-gray-700">
                    <span className="font-medium">🦷 Treatment:</span>{' '}
                    {t.treatment}
                  </p>
                )}
                <p className="mb-2 text-gray-700">
                  <span className="font-medium">💸 Cost:</span>{' '}
                  {Number(t.cost || 0).toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 0,
                  })}
                </p>

                {t.files?.length > 0 && (
                  <div className="mt-3">
                    <h3 className="font-medium mb-1">📎 Files:</h3>
                    <ul className="space-y-1">
                      {t.files.map((f, idx) => (
                        <li key={idx}>
                          <a
                            href={f.url}
                            download={f.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:no-underline"
                          >
                            🔗 {f.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No treatments found.</p>
      )}
    </PageWrapper>
  );
}
