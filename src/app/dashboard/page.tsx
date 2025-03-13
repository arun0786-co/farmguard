'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaRobot, FaChartBar, FaHistory, FaHome, FaHandshake } from 'react-icons/fa';
import FarmBot from '@/components/bot/FarmBot';

type UserData = {
  name: string;
  email: string;
  userType: 'FARMER' | 'CONSUMER' | 'SUPPLIER';
  phone: string;
  address: string;
};

type Tab = 'overview' | 'ai-assistant' | 'analytics' | 'activity';

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ai-assistant':
        return (
          <div className="h-[calc(100vh-200px)]">
            <FarmBot embedded={true} />
          </div>
        );
      
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Crop Health</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Health</span>
                      <span className="text-green-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Pest Risk</span>
                      <span className="text-yellow-600">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Water Levels</span>
                      <span className="text-blue-600">70%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Weather</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">25°C</p>
                      <p className="text-sm text-gray-600">Sunny</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Humidity: 65%</p>
                      <p className="text-sm">Wind: 10 km/h</p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-green-600">Ideal conditions for most crops</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Soil Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Nitrogen (N)</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Phosphorus (P)</span>
                      <span>60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Potassium (K)</span>
                      <span>80%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Farming Tips</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Soil Management</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      <li>Test soil pH regularly</li>
                      <li>Add organic matter</li>
                      <li>Practice crop rotation</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Water Management</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      <li>Water deeply but less frequently</li>
                      <li>Use mulch to retain moisture</li>
                      <li>Monitor soil moisture levels</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Pest Control</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Current Threats</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      <li>Low risk of aphids</li>
                      <li>Monitor for whiteflies</li>
                      <li>Check for signs of fungal growth</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Prevention Tips</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      <li>Use companion planting</li>
                      <li>Maintain proper spacing</li>
                      <li>Regular monitoring</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'activity':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 bg-green-100 rounded flex items-center justify-center mr-4">
                  <span className="text-lg">✨</span>
                </div>
                <div>
                  <p className="font-medium">Welcome to FarmGuard!</p>
                  <p className="text-sm text-gray-500">Account created successfully</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 bg-blue-100 rounded flex items-center justify-center mr-4">
                  <span className="text-lg">🌱</span>
                </div>
                <div>
                  <p className="font-medium">Crop Analysis Complete</p>
                  <p className="text-sm text-gray-500">Overall health: Good</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 bg-yellow-100 rounded flex items-center justify-center mr-4">
                  <span className="text-lg">📊</span>
                </div>
                <div>
                  <p className="font-medium">Soil Analysis Updated</p>
                  <p className="text-sm text-gray-500">NPK levels optimized</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome back, {userData.name}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Here's what's happening with your {userData.userType.toLowerCase()} account today.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userData.userType === 'FARMER' && (
                <>
                  <Link href="/farmbot" className="block">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <FaRobot className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">AI Assistant</h3>
                      <p className="text-gray-600 text-sm">Get crop analysis and recommendations</p>
                    </div>
                  </Link>

                  <Link href="/monitoring/upload" className="block">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">📸</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Analyze Crops</h3>
                      <p className="text-gray-600 text-sm">Upload photos for instant crop health analysis</p>
                    </div>
                  </Link>

                  <Link href="/sales/products" className="block">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">🏪</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Manage Products</h3>
                      <p className="text-gray-600 text-sm">List and manage your farm products</p>
                    </div>
                  </Link>

                  <Link href="/marketplace" className="block">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">🛍</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Shop Supplies</h3>
                      <p className="text-gray-600 text-sm">Browse farming supplies and equipment</p>
                    </div>
                  </Link>

                  <Link href="/b2b-marketplace" className="block">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <FaHandshake className="text-green-600 text-2xl" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">B2B Marketplace</h3>
                      <p className="text-gray-600 text-sm">Connect with vendors for bulk transactions</p>
                    </div>
                  </Link>
                </>
              )}

              {userData.userType === 'CONSUMER' && (
                <>
                  <Link href="/sales" className="block">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">🥬</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Browse Products</h3>
                      <p className="text-gray-600 text-sm">Shop fresh produce directly from farmers</p>
                    </div>
                  </Link>

                  <Link href="/orders" className="block">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">📦</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">My Orders</h3>
                      <p className="text-gray-600 text-sm">Track and manage your orders</p>
                    </div>
                  </Link>

                  <Link href="/farmers" className="block">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">👨‍🌾</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Find Farmers</h3>
                      <p className="text-gray-600 text-sm">Connect with local farmers</p>
                    </div>
                  </Link>
                </>
              )}

              {userData.userType === 'SUPPLIER' && (
                <>
                  <Link href="/supplier/products" className="block">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">📦</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">My Products</h3>
                      <p className="text-gray-600 text-sm">Manage your product listings</p>
                    </div>
                  </Link>

                  <Link href="/marketplace/orders" className="block">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">📋</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Orders</h3>
                      <p className="text-gray-600 text-sm">View and manage incoming orders</p>
                    </div>
                  </Link>

                  <Link href="/marketplace/analytics" className="block">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">📊</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Analytics</h3>
                      <p className="text-gray-600 text-sm">View sales and performance metrics</p>
                    </div>
                  </Link>

                  <Link href="/b2b-marketplace" className="block">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <FaHandshake className="text-green-600 text-2xl" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">B2B Marketplace</h3>
                      <p className="text-gray-600 text-sm">Connect with farmers for bulk purchases</p>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 ${
                activeTab === 'overview'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaHome className="w-5 h-5" />
              <span>Overview</span>
            </button>
            
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 ${
                activeTab === 'ai-assistant'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaRobot className="w-5 h-5" />
              <span>AI Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 ${
                activeTab === 'analytics'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaChartBar className="w-5 h-5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 ${
                activeTab === 'activity'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaHistory className="w-5 h-5" />
              <span>Activity</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {renderTabContent()}
      </div>
    </div>
  );
} 