import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaRobot, FaShoppingCart, FaHandshake } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const router = useRouter();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-green-600">
            FarmGuard
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {user && (
              <>
                <div className="text-gray-600">
                  Welcome, {user.name}
                </div>
                
                {/* B2B Marketplace Link for Farmers and Suppliers */}
                {(user.role === 'FARMER' || user.role === 'SUPPLIER') && (
                  <Link
                    href="/b2b-marketplace"
                    className="text-gray-600 hover:text-green-600 flex items-center gap-2"
                  >
                    <FaHandshake className="w-5 h-5" />
                    B2B Marketplace
                  </Link>
                )}
                
                {user.role === 'FARMER' && (
                  <>
                    <Link
                      href="/farmbot"
                      className="text-gray-600 hover:text-green-600 flex items-center gap-2"
                    >
                      <FaRobot className="w-5 h-5" />
                      FarmAI
                    </Link>
                    <Link
                      href="/cart"
                      className="text-gray-600 hover:text-green-600 relative"
                    >
                      <FaShoppingCart className="w-5 h-5" />
                      {items.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {items.length}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-green-600"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-green-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 