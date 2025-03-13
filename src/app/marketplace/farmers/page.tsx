'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ProductGrid from '@/components/common/ProductGrid';
import SearchAndFilter from '@/components/common/SearchAndFilter';

interface FarmerProduct {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  image: string;
  farmer: string;
  location: string;
  stock: number;
}

// Mock data for farmer products
const farmerProducts: FarmerProduct[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    price: 40,
    unit: 'per kg',
    description: 'Locally grown, organic tomatoes',
    image: '/products/tomatoes.jpg',
    farmer: 'Raj Kumar',
    location: 'Karnataka',
    stock: 100
  },
  {
    id: '2',
    name: 'Organic Rice',
    price: 60,
    unit: 'per kg',
    description: 'Premium quality basmati rice',
    image: '/products/rice.jpg',
    farmer: 'Anita Desai',
    location: 'Punjab',
    stock: 500
  },
  {
    id: '3',
    name: 'Fresh Mangoes',
    price: 80,
    unit: 'per dozen',
    description: 'Sweet and juicy Alphonso mangoes',
    image: '/products/mangoes.jpg',
    farmer: 'Suresh Patel',
    location: 'Maharashtra',
    stock: 200
  }
];

export default function FarmerProductsPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-yellow-800">
            Please log in to view and purchase products from our farmers.
          </p>
        </div>
      </div>
    );
  }

  const filteredProducts = farmerProducts
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const handleAddToCart = (product: FarmerProduct) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      description: product.description,
      image: product.image
    };
    addToCart(cartItem);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Farm Fresh Products</h1>
      
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOption={sortOption}
        onSortChange={setSortOption}
        sortOptions={[
          { value: 'name-asc', label: 'Name (A-Z)' },
          { value: 'name-desc', label: 'Name (Z-A)' },
          { value: 'price-asc', label: 'Price (Low to High)' },
          { value: 'price-desc', label: 'Price (High to Low)' }
        ]}
      />

      <ProductGrid
        products={filteredProducts}
        onAddToCart={handleAddToCart}
        emptyMessage="No products found matching your search criteria."
      />
    </div>
  );
} 