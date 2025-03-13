'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    unit: string;
  }[];
  shippingAddress: string;
  paymentMethod: string;
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'ORD001',
    date: '2024-03-10',
    total: 2500,
    status: 'delivered',
    items: [
      {
        id: 'f1',
        name: 'Fresh Organic Tomatoes',
        quantity: 10,
        price: 40,
        unit: 'per kg'
      },
      {
        id: 'f2',
        name: 'Premium Rice',
        quantity: 20,
        price: 75,
        unit: 'per kg'
      }
    ],
    shippingAddress: '123 Farm Road, Bangalore, Karnataka',
    paymentMethod: 'UPI'
  },
  {
    id: 'ORD002',
    date: '2024-03-11',
    total: 3600,
    status: 'processing',
    items: [
      {
        id: 's1',
        name: 'Premium Quality Seeds',
        quantity: 5,
        price: 199,
        unit: 'per packet'
      },
      {
        id: 's2',
        name: 'Organic Fertilizer',
        quantity: 3,
        price: 899,
        unit: 'per 50kg'
      }
    ],
    shippingAddress: '456 Green Fields, Mumbai, Maharashtra',
    paymentMethod: 'Card'
  },
  {
    id: 'ORD003',
    date: '2024-03-12',
    total: 1500,
    status: 'pending',
    items: [
      {
        id: 'f3',
        name: 'Fresh Green Peas',
        quantity: 25,
        price: 60,
        unit: 'per kg'
      }
    ],
    shippingAddress: '789 Village Square, Punjab',
    paymentMethod: 'COD'
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function OrdersPage() {
  const { user, isAllowed } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Unauthorized Access</h2>
          <p className="mt-2 text-gray-600">Please log in to view your orders.</p>
        </div>
      </div>
    );
  }

  const filteredOrders = mockOrders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Orders</h1>
        <div className="flex gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filterStatus === status
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="mt-2 text-lg font-semibold text-green-600">₹{order.total.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                {selectedOrder?.id === order.id ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Items</h4>
                        <div className="mt-2 space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {item.name} ({item.quantity} × ₹{item.price} {item.unit})
                              </span>
                              <span className="font-medium">₹{(item.quantity * item.price).toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Shipping Address</h4>
                        <p className="mt-1 text-sm text-gray-600">{order.shippingAddress}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Payment Method</h4>
                        <p className="mt-1 text-sm text-gray-600">{order.paymentMethod}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="mt-4 text-sm text-green-600 hover:text-green-700"
                    >
                      Show Less
                    </button>
                  </>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No orders found with the selected status.</p>
          </div>
        )}
      </div>
    </div>
  );
}