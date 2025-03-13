'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaSignOutAlt, FaShoppingCart, FaStore, FaRobot, FaHandshake } from 'react-icons/fa';

export default function Navigation() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Clear any existing auth data on mount
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white text-xl font-bold">
              FarmGuard
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="text-gray-300">Welcome, {user.name}</span>
                
                {user.role === 'CONSUMER' && (
                  <Link
                    href="/marketplace/farmers"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Farmer Products
                  </Link>
                )}

                {(user.role === 'FARMER' || user.role === 'SUPPLIER') && (
                  <Link
                    href="/b2b-marketplace"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                  >
                    <FaHandshake className="text-xl" />
                    <span>B2B Marketplace</span>
                  </Link>
                )}

                {(user.role === 'FARMER' || user.role === 'CONSUMER') && (
                  <Link
                    href="/marketplace/supplies"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Agricultural Supplies
                  </Link>
                )}

                {user.role === 'FARMER' && (
                  <Link
                    href="/farmer/products"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    My Products
                  </Link>
                )}

                {user.role === 'SUPPLIER' && (
                  <Link
                    href="/supplier/products"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    My Supplies
                  </Link>
                )}

                <Link
                  href="/cart"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Cart ({items.length})
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 