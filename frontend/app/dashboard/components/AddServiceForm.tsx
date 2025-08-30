'use client';

import { useState } from 'react';

interface AddServiceFormProps {
  onSubmit: (service: {
    name: string;
    ip: string;
    port: number;
    description?: string;
  }) => void;
  onCancel: () => void;
}

export default function AddServiceForm({ onSubmit, onCancel }: AddServiceFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    port: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.ip || !formData.port) {
      return;
    }

    const port = parseInt(formData.port);
    if (isNaN(port) || port < 1 || port > 65535) {
      return;
    }

    onSubmit({
      name: formData.name,
      ip: formData.ip,
      port,
      description: formData.description || undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add New Service</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Service Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="e.g., Web Server, Database, API"
          />
        </div>

        <div>
          <label htmlFor="ip" className="block text-sm font-medium text-gray-300 mb-1">
            IP Address *
          </label>
          <input
            type="text"
            id="ip"
            name="ip"
            value={formData.ip}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="192.168.1.100"
          />
        </div>

        <div>
          <label htmlFor="port" className="block text-sm font-medium text-gray-300 mb-1">
            Port *
          </label>
          <input
            type="number"
            id="port"
            name="port"
            value={formData.port}
            onChange={handleChange}
            required
            min="1"
            max="65535"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="80, 443, 3306, etc."
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Brief description of the service..."
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
          >
            Add Service
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
