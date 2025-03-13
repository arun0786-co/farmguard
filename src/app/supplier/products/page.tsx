'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProductGrid from '@/components/common/ProductGrid';
import ProductForm from '@/components/common/ProductForm';
import SearchAndFilter from '@/components/common/SearchAndFilter';
import { FaPlus } from 'react-icons/fa';

interface SupplyProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  category: string;
  description: string;
  image: string;
  status: 'active' | 'inactive';
}

// Mock supplier's products
const initialProducts: SupplyProduct[] = [
  {
    id: 's1',
    name: 'Premium Quality Seeds',
    price: 199,
    stock: 1000,
    unit: 'per packet',
    category: 'Seeds',
    description: 'High-yield hybrid tomato seeds',
    image: '/placeholder-product.jpg',
    status: 'active'
  },
  {
    id: 's2',
    name: 'Organic Fertilizer',
    price: 899,
    stock: 500,
    unit: 'per 50kg',
    category: 'Fertilizers',
    description: 'NPK-rich organic fertilizer',
    image: '/placeholder-product.jpg',
    status: 'active'
  }
];

const categories = ['Seeds', 'Fertilizers', 'Pesticides', 'Machinery', 'Equipment', 'Tools'];

export default function SupplierProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<SupplyProduct[]>(initialProducts);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!user || user.role !== 'SUPPLIER') {
    return <div>Unauthorized access</div>;
  }

  const handleAddProduct = (formData: any) => {
    const productId = `s${Math.random().toString(36).substr(2, 9)}`;
    const product: SupplyProduct = {
      id: productId,
      image: '/placeholder-product.jpg',
      status: 'active',
      ...formData
    };
    setProducts([...products, product]);
    setIsAddingProduct(false);
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

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const [field, order] = sortBy.split('_');
      if (field === 'name') {
        return order === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (field === 'price') {
        return order === 'asc'
          ? a.price - b.price
          : b.price - a.price;
      }
      return 0;
    });

  return (
    <ProtectedRoute allowedRoles={['SUPPLIER']}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Products</h1>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2"
          >
            <FaPlus /> Add Product
          </button>
        </div>

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {isAddingProduct && (
          <div className="mb-8">
            <ProductForm
              categories={categories}
              onSubmit={handleAddProduct}
              onCancel={() => setIsAddingProduct(false)}
              title="Add New Supply"
              submitLabel="Add Supply"
            />
          </div>
        )}

        <ProductGrid
          products={filteredProducts}
          showControls={true}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteProduct}
          emptyMessage="You haven't added any supplies yet."
        />
      </div>
    </ProtectedRoute>
  );
} 