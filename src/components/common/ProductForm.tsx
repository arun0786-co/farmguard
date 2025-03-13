import React, { useState } from 'react';

interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  unit: string;
  category?: string;
  description: string;
  status?: 'active' | 'inactive';
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  categories?: string[];
  units?: string[];
  showCategory?: boolean;
  title: string;
  submitLabel: string;
}

export default function ProductForm({
  initialData = {
    name: '',
    price: 0,
    stock: 0,
    unit: 'per kg',
    category: 'Seeds',
    description: '',
    status: 'active'
  },
  onSubmit,
  onCancel,
  categories = ['Seeds', 'Fertilizers', 'Pesticides', 'Machinery', 'Equipment', 'Tools'],
  units = ['per kg', 'per packet', 'per liter', 'per unit', 'per set'],
  showCategory = true,
  title,
  submitLabel
}: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<ProductFormData>>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as ProductFormData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              required
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              required
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className={`grid ${showCategory ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
          {showCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
} 