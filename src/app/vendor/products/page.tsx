'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

type ProductCategory = 'Seeds' | 'Fertilizers' | 'Tools' | 'Equipment';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: ProductCategory;
  stock: number;
  vendorId: string;
  vendorName: string;
};

type User = {
  id: string;
  name: string;
  role: 'VENDOR';
};

export default function VendorProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'Seeds' as ProductCategory,
    stock: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check authentication and role
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'VENDOR') {
      router.push('/marketplace');
      return;
    }

    setUser(parsedUser);

    // Load vendor's products
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      const allProducts = JSON.parse(savedProducts);
      // Filter only vendor's products
      const vendorProducts = allProducts.filter((p: Product) => p.vendorId === parsedUser.id);
      setProducts(vendorProducts);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newProduct: Product = {
      id: Math.random().toString(36).substring(2, 15),
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      image: formData.image || '/placeholder-product.svg',
      category: formData.category,
      stock: parseInt(formData.stock),
      vendorId: user.id,
      vendorName: user.name
    };

    // Update local storage
    const savedProducts = localStorage.getItem('products');
    const allProducts = savedProducts ? JSON.parse(savedProducts) : [];
    const updatedProducts = [...allProducts, newProduct];
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    // Update state
    setProducts(prev => [...prev, newProduct]);
    setShowAddForm(false);
    setFormData({
      name: '',
      price: '',
      description: '',
      image: '',
      category: 'Seeds',
      stock: ''
    });
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingProduct) return;

    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      image: formData.image || '/placeholder-product.svg',
      category: formData.category,
      stock: parseInt(formData.stock)
    };

    // Update local storage
    const savedProducts = localStorage.getItem('products');
    const allProducts = savedProducts ? JSON.parse(savedProducts) : [];
    const updatedProducts = allProducts.map((p: Product) => 
      p.id === editingProduct.id ? updatedProduct : p
    );
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    // Update state
    setProducts(prev => prev.map(p => 
      p.id === editingProduct.id ? updatedProduct : p
    ));
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      image: '',
      category: 'Seeds',
      stock: ''
    });
  };

  const handleDeleteProduct = (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    // Update local storage
    const savedProducts = localStorage.getItem('products');
    const allProducts = savedProducts ? JSON.parse(savedProducts) : [];
    const updatedProducts = allProducts.filter((p: Product) => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    // Update state
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      image: product.image,
      category: product.category,
      stock: product.stock.toString()
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error uploading image');
      }

      setFormData(prev => ({
        ...prev,
        image: data.path
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error instanceof Error ? error.message : 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="mt-2 text-gray-600">Manage your product listings</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <span className="text-sm text-gray-600">{product.category}</span>
                </div>
                <p className="text-gray-600 mt-1">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                    <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(product)}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Product Modal */}
        {(showAddForm || editingProduct) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image
                  </label>
                  <div className="space-y-2">
                    {formData.image && (
                      <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={formData.image}
                          alt="Product preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, image: '' }));
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex-1 cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        {uploading ? 'Uploading...' : 'Choose Image'}
                      </label>
                      {formData.image && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, image: '' }));
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {uploadError && (
                      <p className="text-sm text-red-600">{uploadError}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Tools">Tools</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    required
                    min="0"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.stock}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                      setFormData({
                        name: '',
                        price: '',
                        description: '',
                        image: '',
                        category: 'Seeds',
                        stock: ''
                      });
                    }}
                    className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 