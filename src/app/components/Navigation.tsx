import { FaUser, FaSignOutAlt, FaShoppingCart, FaStore, FaRobot, FaHandshake } from 'react-icons/fa';

// Inside the Navigation component where links are rendered
{user && (user.userType === 'FARMER' || user.userType === 'SUPPLIER') && (
  <Link href="/b2b-marketplace">
    <div className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors">
      <FaHandshake className="text-xl" />
      <span className="hidden md:inline">B2B Marketplace</span>
    </div>
  </Link>
)} 