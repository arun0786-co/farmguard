'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type OrderStatus = 'processing' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered';

type Order = {
  id: string;
  items: any[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  date: string;
  deliveryEstimate: string;
};

const statusSteps = [
  { status: 'processing', label: 'Order Processing' },
  { status: 'confirmed', label: 'Order Confirmed' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'out_for_delivery', label: 'Out for Delivery' },
  { status: 'delivered', label: 'Delivered' }
];

export default function OrderStatusPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('processing');

  useEffect(() => {
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        setOrder(parsedOrder);
        // Simulate order progress
        const statuses: OrderStatus[] = ['processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];
        let currentIndex = 0;

        const interval = setInterval(() => {
          if (currentIndex < statuses.length) {
            setCurrentStatus(statuses[currentIndex]);
            currentIndex++;
          } else {
            clearInterval(interval);
          }
        }, 3000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error parsing order:', error);
      }
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">No order found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-500';
      case 'confirmed':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'out_for_delivery':
        return 'bg-orange-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Order Status</h1>
            <span className="text-gray-600">Order #{order.id}</span>
          </div>

          {/* Order Progress */}
          <div className="mb-8">
            <div className="relative">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{
                    width: `${
                      ((statusSteps.findIndex(step => step.status === currentStatus) + 1) /
                        statusSteps.length) *
                      100
                    }%`
                  }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
                />
              </div>
              <div className="flex justify-between">
                {statusSteps.map((step, index) => (
                  <div
                    key={step.status}
                    className={`flex flex-col items-center ${
                      statusSteps.findIndex(s => s.status === currentStatus) >= index
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full mb-2 flex items-center justify-center ${
                        statusSteps.findIndex(s => s.status === currentStatus) >= index
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      {statusSteps.findIndex(s => s.status === currentStatus) > index ? '✓' : ''}
                    </div>
                    <span className="text-sm">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-medium">
                    {new Date(order.deliveryEstimate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                  <div className="w-20 h-20 relative">
                    <Image
                      src={item.image || '/images/placeholder.jpg'}
                      alt={item.name || 'Product'}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Shopping */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/marketplace')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 