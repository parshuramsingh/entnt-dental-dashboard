// src/components/incidents/IncidentForm.jsx
import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import FileUpload from '../ui/FileUpload';
import { motion } from 'framer-motion';

export default function IncidentForm({ initialData = {}, onSubmit, onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    comments: '',
    appointmentDate: '',
    cost: '',
    treatment: '',
    status: 'Pending',
    files: [],
    ...initialData,
  });

  const [uploadedFiles, setUploadedFiles] = useState(
    (initialData.files || []).map(f => ({ ...f, previewUrl: f.url || '' }))
  );

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    const files = uploadedFiles.map(f => ({
      name: f.name,
      type: f.type,
      url: f.previewUrl || '',
    }));
    onSubmit({ ...form, files });
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-h-[70vh] overflow-y-auto pr-1 space-y-5 text-sm transition-all duration-300"
    >
      <Input
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <Input
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <Input
        label="Comments"
        name="comments"
        value={form.comments}
        onChange={handleChange}
      />
      <Input
        label="📅 Appointment Date & Time"
        type="datetime-local"
        name="appointmentDate"
        value={form.appointmentDate}
        onChange={handleChange}
        required
      />
      <Input
        label="Treatment"
        name="treatment"
        value={form.treatment}
        onChange={handleChange}
      />
      <Input
        label="Cost (INR)"
        type="number"
        name="cost"
        value={form.cost}
        onChange={handleChange}
      />

      {/* Status */}
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* File upload */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Upload Files (PDF, X-rays, Receipts)
        </label>
        <FileUpload files={uploadedFiles} setFiles={setUploadedFiles} />
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <motion.button
          type="button"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm px-4 py-2 rounded"
        >
          Cancel
        </motion.button>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
        >
          {form?.id ? 'Update' : 'Add'} Incident
        </motion.button>
      </div>
    </form>
  );
}
