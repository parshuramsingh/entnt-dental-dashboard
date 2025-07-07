import { useState } from 'react';
import { format } from 'date-fns';
import { PlusCircle, Edit2, Trash2, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import PageWrapper from '../components/layout/PageWrapper';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import IncidentForm from '../components/incidents/incidentForm';


const AnimatedBtn = ({ icon: Icon, children, ...rest }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
    {...rest}
  >
    <Icon className="w-4 h-4" />
    {children}
  </motion.button>
);

export default function Incidents() {
  const { state, dispatch } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);

  const getPatientName = (id) =>
    state.patients.find((p) => p.id === id)?.name ?? 'Unknown';

  const handleSave = (data) => {
    if (data.id) {
      dispatch({
        type: 'SET_STATE',
        payload: {
          incidents: state.incidents.map((i) => (i.id === data.id ? data : i)),
        },
      });
    } else {
      dispatch({
        type: 'SET_STATE',
        payload: {
          incidents: [
            ...state.incidents,
            {
              ...data,
              id: 'i' + Date.now(),
              patientId: data.patientId || state.patients[0]?.id || 'p1',
            },
          ],
        },
      });
    }
  };

  const handleDelete = (id) => {
    if (confirm('Delete this incident?')) {
      dispatch({
        type: 'SET_STATE',
        payload: {
          incidents: state.incidents.filter((i) => i.id !== id),
        },
      });
    }
  };

  const rows = state.incidents.map((i) => ({
    ...i,
    patientName: getPatientName(i.patientId),
    dateFmt: format(new Date(i.appointmentDate), 'PPpp'),
  }));

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-700 dark:text-white">Incidents</h1>
        <AnimatedBtn icon={PlusCircle} onClick={() => {
          setEditingIncident(null);
          setModalOpen(true);
        }}>
          Add Incident
        </AnimatedBtn>
      </div>

      <Card className="shadow-lg backdrop-blur bg-white/90 dark:bg-gray-800/60 border border-blue-100 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Cost (₹)</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((i) => (
                  <motion.tr
                    key={i.id}
                    whileHover={{ scale: 1.005 }}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50/40 dark:hover:bg-blue-900/40 transition"
                  >
                    <td className="px-4 py-2">{i.title}</td>
                    <td className="px-4 py-2">{i.patientName}</td>
                    <td className="px-4 py-2">{i.dateFmt}</td>
                    <td className={`px-4 py-2 font-semibold ${
                      i.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {i.status}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {i.cost ? `₹${Number(i.cost).toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingIncident(i);
                          setModalOpen(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(i.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 dark:text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FolderOpen className="w-8 h-8 mb-2" />
                      <span className="text-sm italic">No incidents recorded yet.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {modalOpen && (
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title={editingIncident ? 'Edit Incident' : 'Add Incident'}
          >
            <IncidentForm
              initialData={editingIncident || {}}
              onSubmit={handleSave}
              onClose={() => setModalOpen(false)}
            />
          </Modal>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
