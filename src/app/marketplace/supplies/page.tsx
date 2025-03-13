'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface Supply {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  supplier: string;
  description: string;
  image: string;
  stock: number;
}

// Function to get supply-specific placeholder images
const getSupplyPlaceholderImage = (name: string, category: string): string => {
  const productName = name.toLowerCase();
  const productCategory = category.toLowerCase();
  
  // Map product names to specific images
  if (productName.includes('seeds') || productName.includes('seed')) return '/images/products/rice-placeholder.jpg';
  if (productName.includes('fertilizer')) return '/images/products/vegetable-placeholder.jpg';
  if (productName.includes('pesticide')) return '/images/products/herb-placeholder.jpg';
  if (productName.includes('tractor')) return '/images/products/default-product-placeholder.jpg';
  if (productName.includes('irrigation')) return '/images/products/default-product-placeholder.jpg';
  if (productName.includes('soil') || productName.includes('testing')) return '/images/products/default-product-placeholder.jpg';
  
  // Fallback to category-based images
  if (productCategory.includes('seeds')) return '/images/products/rice-placeholder.jpg';
  if (productCategory.includes('fertilizer')) return '/images/products/vegetable-placeholder.jpg';
  if (productCategory.includes('pesticide')) return '/images/products/herb-placeholder.jpg';
  if (productCategory.includes('machinery')) return '/images/products/default-product-placeholder.jpg';
  if (productCategory.includes('equipment')) return '/images/products/default-product-placeholder.jpg';
  if (productCategory.includes('tools')) return '/images/products/default-product-placeholder.jpg';
  
  // Default placeholder for unknown products
  return '/images/products/default-product-placeholder.jpg';
};

const categories = ['All', 'Seeds', 'Fertilizers', 'Pesticides', 'Machinery', 'Equipment', 'Tools'];

// Mock agricultural supplies data
const agriculturalSupplies: Supply[] = [
  {
    id: 's1',
    name: 'Premium Quality Seeds',
    category: 'Seeds',
    price: 199,
    unit: 'per packet',
    supplier: 'AgriTech Solutions',
    description: 'High-yield hybrid tomato seeds',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
    stock: 1000
  },
  {
    id: 's2',
    name: 'Organic Fertilizer',
    category: 'Fertilizers',
    price: 899,
    unit: 'per 50kg',
    supplier: 'Green Earth Co.',
    description: 'NPK-rich organic fertilizer',
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7',
    stock: 500
  },
  {
    id: 's3',
    name: 'Advanced Pesticide',
    category: 'Pesticides',
    price: 450,
    unit: 'per liter',
    supplier: 'CropGuard Inc.',
    description: 'Safe and effective pest control',
    image: 'https://images.unsplash.com/photo-1611911813383-67769b37a149',
    stock: 200
  },
  {
    id: 's4',
    name: 'Modern Tractor',
    category: 'Machinery',
    price: 750000,
    unit: 'per unit',
    supplier: 'FarmTech Machines',
    description: '45 HP tractor with advanced features',
    image: 'https://images.unsplash.com/photo-1599909631715-c0ee017d1f76',
    stock: 10
  },
  {
    id: 's5',
    name: 'Drip Irrigation Kit',
    category: 'Equipment',
    price: 15000,
    unit: 'per set',
    supplier: 'WaterSave Systems',
    description: 'Complete drip irrigation system',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5',
    stock: 50
  },
  {
    id: 's6',
    name: 'Soil Testing Kit',
    category: 'Tools',
    price: 2999,
    unit: 'per kit',
    supplier: 'AgriLab Tools',
    description: 'Professional soil analysis kit',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf',
    stock: 100
  }
];

export default function SuppliesPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'price' | 'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  if (!user || user.role !== 'FARMER') {
    return <div>Unauthorized access</div>;
  }

  const filteredSupplies = agriculturalSupplies
    .filter(supply => 
      (selectedCategory === 'All' || supply.category === selectedCategory) &&
      (supply.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       supply.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
       supply.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a: Supply, b: Supply) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      }
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });

  return (
    <ProtectedRoute allowedRoles={['FARMER']}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Agricultural Supplies</h1>
        <div className="mb-8">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search supplies, suppliers, or descriptions..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price' | 'name')}
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                </select>
                <button
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSupplies.map((supply: Supply) => (
            <div key={supply.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={supply.image}
                  alt={supply.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={true}
                  quality={75}
                  loading="eager"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getSupplyPlaceholderImage(supply.name, supply.category);
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{supply.name}</h3>
                    <p className="text-green-600 font-medium">₹{supply.price.toLocaleString('en-IN')} {supply.unit}</p>
                  </div>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {supply.category}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{supply.description}</p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Supplier: {supply.supplier}</p>
                  <p>Stock: {supply.stock} available</p>
                </div>
                <button
                  onClick={() => {
                    addToCart({
                      id: supply.id,
                      name: supply.name,
                      price: supply.price,
                      unit: supply.unit,
                      description: supply.description,
                      image: supply.image
                    });
                    alert('Product added to cart!');
                  }}
                  className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredSupplies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No supplies found matching your search criteria.</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 