import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function PatientForm({ initialData = {}, onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: '',
    dob: '',
    contact: '',
    healthInfo: '',
    ...initialData,
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.dob || !form.contact) return;
    onSubmit(form);
    onClose();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white p-4 rounded-lg"
    >
      <Input
        label="Full Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <Input
        label="Date of Birth"
        name="dob"
        type="date"
        value={form.dob}
        onChange={handleChange}
        required
      />
      <Input
        label="Contact"
        name="contact"
        value={form.contact}
        onChange={handleChange}
        required
      />
      <Input
        label="Health Info"
        name="healthInfo"
        value={form.healthInfo}
        onChange={handleChange}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-black hover:bg-gray-400"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700 transition-all"
        >
          {form.id ? 'Update' : 'Add'}
        </Button>
      </div>
    </form>
  );
}
