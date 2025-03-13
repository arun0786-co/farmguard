'use client';

import { useState } from 'react';
import ProductCard from '@/components/sales/ProductCard';
import Link from 'next/link';

// Mock data for demonstration
const mockProducts = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    description: 'Organically grown tomatoes, perfect for salads and cooking.',
    price: 40,
    quantity: 100,
    unit: 'kg',
    category: 'Vegetables',
    isWholesale: false,
    image: 'https://images.unsplash.com/photo-1546104474-e8b11d4b6862',
    farmerName: 'John Doe',
  },
  {
    id: '2',
    name: 'Premium Rice',
    description: 'High-quality basmati rice, perfect for daily consumption.',
    price: 80,
    quantity: 1000,
    unit: 'kg',
    category: 'Grains',
    isWholesale: true,
    minOrderQty: 100,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
    farmerName: 'Jane Smith',
  },
  // Add more mock products as needed
];

const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy'];

export default function SalesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showWholesaleOnly, setShowWholesaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState('price-low');

  // Filter and sort products
  const filteredProducts = mockProducts
    .filter(product => {
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      if (showWholesaleOnly && !product.isWholesale) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sales Platform</h1>
          <p className="text-gray-600 mt-2">Manage your products and connect with buyers directly</p>
        </div>
        <Link
          href="/sales/products/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Add New Product
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-sm text-gray-500">Active Listings</div>
          <div className="text-2xl font-bold mt-2">24</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-sm text-gray-500">Pending Orders</div>
          <div className="text-2xl font-bold mt-2">12</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-sm text-gray-500">Total Sales</div>
          <div className="text-2xl font-bold mt-2">$2,450</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-sm text-gray-500">This Month</div>
          <div className="text-2xl font-bold mt-2">$850</div>
        </div>
      </div>

      {/* Product Management Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button className="border-b-2 border-green-600 py-4 px-1 text-sm font-medium text-green-600">
              Products
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
              Orders
            </button>
            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
              Analytics
            </button>
          </nav>
        </div>

        {/* Product List */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="flex space-x-2">
              <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600">
                <option>All Categories</option>
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Grains</option>
              </select>
              <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600">
                <option>Sort by</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Recently Added</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 