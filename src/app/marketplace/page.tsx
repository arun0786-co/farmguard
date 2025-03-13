'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'Seeds' | 'Fertilizers' | 'Tools' | 'Equipment';
  stock: number;
  vendorId: string;
  vendorName: string;
};

type CartItem = {
  id: string;
  quantity: number;
};

type SalesData = {
  total: number;
  monthly: number;
  daily: number;
};

type UserRole = 'CONSUMER' | 'VENDOR' | 'ADMIN';

type User = {
  id: string;
  name: string;
  role: UserRole;
};

// Sample products with vendor information
const products: Product[] = [
  {
    id: '1',
    name: 'Premium Tomato Seeds',
    price: 199,
    description: 'High-yield hybrid tomato seeds, disease-resistant variety',
    image: '/placeholder-product.jpg', // Using a placeholder image
    category: 'Seeds',
    stock: 50,
    vendorId: 'v1',
    vendorName: 'Green Farms'
  },
  {
    id: '2',
    name: 'Organic NPK Fertilizer',
    price: 899,
    description: 'Balanced nutrition for all crops, 100% organic',
    image: '/placeholder-product.jpg',
    category: 'Fertilizers',
    stock: 30,
    vendorId: 'v2',
    vendorName: 'Organic Solutions'
  },
  {
    id: '3',
    name: 'Drip Irrigation Kit',
    price: 2499,
    description: 'Complete drip irrigation system for 1 acre',
    image: '/placeholder-product.jpg',
    category: 'Equipment',
    stock: 10,
    vendorId: 'v1',
    vendorName: 'Green Farms'
  },
  {
    id: '4',
    name: 'Premium Rice Seeds',
    price: 299,
    description: 'High-yielding rice variety, suitable for all seasons',
    image: '/placeholder-product.jpg',
    category: 'Seeds',
    stock: 40,
    vendorId: 'v3',
    vendorName: 'Rice Tech'
  },
  {
    id: '5',
    name: 'Neem Oil Pesticide',
    price: 449,
    description: 'Natural pest control solution, safe for organic farming',
    image: '/placeholder-product.jpg',
    category: 'Fertilizers',
    stock: 25,
    vendorId: 'v2',
    vendorName: 'Organic Solutions'
  },
  {
    id: '6',
    name: 'Farming Tool Set',
    price: 1299,
    description: 'Essential farming tools kit with storage bag',
    image: '/placeholder-product.jpg',
    category: 'Tools',
    stock: 15,
    vendorId: 'v1',
    vendorName: 'Green Farms'
  }
];

const formatPrice = (price: number) => {
  return `₹${price.toLocaleString('en-IN')}`;
};

// Initial sales data
const initialSalesData: SalesData[] = [
  { total: 2450, monthly: 1200, daily: 350 },
  { total: 3200, monthly: 1500, daily: 420 },
  { total: 2800, monthly: 1300, daily: 380 }
];

export default function MarketplacePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCart, setShowCart] = useState(false);
  const [salesData, setSalesData] = useState<SalesData>(initialSalesData[0]);
  const [salesIndex, setSalesIndex] = useState(0);
  const [selectedVendor, setSelectedVendor] = useState<string>('all');

  useEffect(() => {
    // Load cart from localStorage
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          setCart([]);
          localStorage.setItem('cart', '[]');
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart([]);
      localStorage.setItem('cart', '[]');
    }

    // Rotate sales data every 3 seconds
    const interval = setInterval(() => {
      setSalesIndex((prevIndex) => (prevIndex + 1) % initialSalesData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update sales data when index changes
  useEffect(() => {
    setSalesData(initialSalesData[salesIndex]);
  }, [salesIndex]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { id: productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem?.quantity === 1) {
        return prevCart.filter(item => item.id !== productId);
      }
      return prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.id);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Get unique vendors
  const vendors = ['all', ...new Set(products.map(p => p.vendorId))];
  const vendorNames = new Map(products.map(p => [p.vendorId, p.vendorName]));

  // Filter products based on category and vendor
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const vendorMatch = selectedVendor === 'all' || product.vendorId === selectedVendor;
    
    // If user is a vendor, only show their products
    if (user?.role === 'VENDOR') {
      return product.vendorId === user.id && categoryMatch;
    }
    
    return categoryMatch && vendorMatch;
  });

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <ProtectedRoute requiredPermission="marketplace">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agricultural Marketplace</h1>
              <p className="mt-2 text-gray-600">
                {user?.role === 'VENDOR' 
                  ? 'Manage your products and track sales' 
                  : 'Quality farming supplies at competitive prices'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {user?.role === 'VENDOR' && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Sales Overview</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600">Total Sales</p>
                      <p className="text-2xl font-bold text-green-700">{formatPrice(salesData.total)}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600">Monthly Sales</p>
                      <p className="text-2xl font-bold text-green-700">{formatPrice(salesData.monthly)}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600">Daily Sales</p>
                      <p className="text-2xl font-bold text-green-700">{formatPrice(salesData.daily)}</p>
                    </div>
                  </div>
                </div>
              )}
              {user?.role === 'CONSUMER' && (
                <button
                  onClick={toggleCart}
                  className="relative bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-800 hover:bg-green-50'
              }`}
            >
              All Categories
            </button>
            {['Seeds', 'Fertilizers', 'Tools', 'Equipment'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-800 hover:bg-green-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {user?.role === 'CONSUMER' && (
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => setSelectedVendor('all')}
                className={`px-4 py-2 rounded-lg ${
                  selectedVendor === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-800 hover:bg-green-50'
                }`}
              >
                All Vendors
              </button>
              {vendors.filter(v => v !== 'all').map(vendorId => (
                <button
                  key={vendorId}
                  onClick={() => setSelectedVendor(vendorId)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedVendor === vendorId
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-800 hover:bg-green-50'
                  }`}
                >
                  {vendorNames.get(vendorId)}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
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
                    <span className="text-sm text-gray-600">{product.vendorName}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{product.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                      <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                    </div>
                    {user?.role === 'CONSUMER' && (
                      <button
                        onClick={() => addToCart(product.id)}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shopping Cart Sidebar */}
          {showCart && user?.role === 'CONSUMER' && (
            <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                <button
                  onClick={toggleCart}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-600">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => {
                      const product = products.find(p => p.id === item.id);
                      if (!product) return null;
                      return (
                        <div key={item.id} className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <p className="text-gray-600">{formatPrice(product.price)} × {item.quantity}</p>
                            <p className="text-sm text-gray-600">From: {product.vendorName}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => addToCart(item.id)}
                              className="text-gray-600 hover:text-gray-800"
                              disabled={item.quantity >= (products.find(p => p.id === item.id)?.stock || 0)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-medium text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-green-600">{formatPrice(getCartTotal())}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Floating Cart Button */}
          {user?.role === 'CONSUMER' && (
            <div className="fixed bottom-4 right-4">
              <button
                onClick={toggleCart}
                className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                <span>Cart ({getCartItemCount()})</span>
                <span className="font-bold">{formatPrice(getCartTotal())}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}