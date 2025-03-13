'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  description: string;
  image: string;
  status: 'active' | 'inactive';
}

// Mock farmer's products
const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Fresh Tomatoes',
    price: 40,
    stock: 100,
    unit: 'per kg',
    description: 'Organically grown fresh tomatoes',
    image: '/placeholder-product.jpg',
    status: 'active'
  },
  {
    id: 'p2',
    name: 'Premium Rice',
    price: 75,
    stock: 500,
    unit: 'per kg',
    description: 'High-quality basmati rice',
    image: '/placeholder-product.jpg',
    status: 'active'
  }
];

export default function FarmerProductsManagementPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    stock: 0,
    unit: 'per kg',
    description: '',
    status: 'active'
  });

  if (!user || user.role !== 'FARMER') {
    return <div>Unauthorized access</div>;
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const productId = `p${Math.random().toString(36).substr(2, 9)}`;
    const product: Product = {
      id: productId,
      image: '/placeholder-product.jpg',
      ...newProduct as Omit<Product, 'id' | 'image'>
    };
    setProducts([...products, product]);
    setIsAddingProduct(false);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      unit: 'per kg',
      description: '',
      status: 'active'
    });
  };

  const handleUpdateStatus = (productId: string, newStatus: 'active' | 'inactive') => {
    setProducts(products.map(product =>
      product.id === productId
        ? { ...product, status: newStatus }
        : product
    ));
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  return (
    <ProtectedRoute allowedRoles={['FARMER']}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Manage Your Products</h1>
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setIsAddingProduct(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add New Product
          </button>
        </div>

        {isAddingProduct && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
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
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                >
                  <option value="per kg">per kg</option>
                  <option value="per piece">per piece</option>
                  <option value="per dozen">per dozen</option>
                  <option value="per quintal">per quintal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-green-600 font-medium">₹{product.price} {product.unit}</p>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{product.description}</p>
                <p className="mt-2 text-sm text-gray-600">Stock: {product.stock} units</p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleUpdateStatus(
                      product.id,
                      product.status === 'active' ? 'inactive' : 'active'
                    )}
                    className={`px-3 py-1 rounded-md text-sm ${
                      product.status === 'active'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {product.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">You haven't added any products yet.</p>
            <button
              onClick={() => setIsAddingProduct(true)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 