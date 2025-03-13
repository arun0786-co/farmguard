'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="text-center max-w-lg">
        <div className="mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Successful!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order #{orderId} has been confirmed.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-medium text-gray-800 mb-4">What's Next?</h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-center text-gray-600">
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                1
              </span>
              You will receive an order confirmation email shortly
            </li>
            <li className="flex items-center text-gray-600">
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                2
              </span>
              Our team will process your order within 24 hours
            </li>
            <li className="flex items-center text-gray-600">
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                3
              </span>
              You can track your order status in your account
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <Link
            href="/orders"
            className="block w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            View Order
          </Link>
          <Link
            href="/marketplace"
            className="block w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Continue Shopping
            {countdown > 0 && <span className="ml-1">({countdown})</span>}
          </Link>
        </div>
      </div>
    </div>
  );
} 