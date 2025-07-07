import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import { useApp } from '../context/AppContext';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import PatientForm from '../components/patients/PatientForm';

export default function Patients() {
  const { state, dispatch } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = state.patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.contact.includes(search)
  );

  const rows = filtered.map((p) => (
    <motion.tr
      key={p.id}
      className="border-b last:border-0 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900"
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <td className="px-4 py-2">{p.id}</td>
      <td className="px-4 py-2">{p.name}</td>
      <td className="px-4 py-2">{p.dob}</td>
      <td className="px-4 py-2">{p.contact}</td>
      <td className="px-4 py-2">{p.healthInfo}</td>
      <td className="px-4 py-2">
        <div className="flex gap-2">
          <Button
            className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
            onClick={() => {
              setEditingPatient(p);
              setModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            className="text-xs px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
            onClick={() => handleDelete(p.id)}
          >
            Delete
          </Button>
        </div>
      </td>
    </motion.tr>
  ));

  function handleSave(data) {
    if (data.id) {
      dispatch({
        type: 'SET_STATE',
        payload: {
          patients: state.patients.map((p) => (p.id === data.id ? data : p)),
        },
      });
    } else {
      const newPatient = { ...data, id: `p${Date.now()}` };
      dispatch({
        type: 'SET_STATE',
        payload: {
          patients: [...state.patients, newPatient],
        },
      });
    }
    setModalOpen(false);
  }

  function handleDelete(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
      dispatch({
        type: 'SET_STATE',
        payload: {
          patients: state.patients.filter((p) => p.id !== id),
        },
      });
    }
  }

  return (
    <PageWrapper>
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Patients</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search patients..."
              className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-2 right-2 text-gray-500 dark:text-gray-300"
                onClick={() => setSearch('')}
              >
                <X size={16} />
              </motion.button>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingPatient(null);
              setModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow"
          >
            + Add Patient
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">DOB</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Health Info</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPatient ? 'Edit Patient' : 'Add Patient'}
      >
        <PatientForm
          initialData={editingPatient}
          onSubmit={handleSave}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </PageWrapper>
  );
}
