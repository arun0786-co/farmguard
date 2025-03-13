'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState<'payment' | 'confirmation'>('payment');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [orderNumber, setOrderNumber] = useState<string>('');

  if (!user || (user.role !== 'CONSUMER' && user.role !== 'FARMER')) {
    return <div>Unauthorized access</div>;
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate random order number
    const randomOrderNumber = Math.random().toString(36).substring(2, 15);
    setOrderNumber(randomOrderNumber);
    clearCart(); // Clear the cart after successful order
    setStep('confirmation');
  };

  if (step === 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Thank you for your order.</p>
          <p className="text-lg font-semibold mb-2">Order Number: {orderNumber}</p>
          <div className="mt-8 p-4 bg-green-50 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Delivery Partner</h3>
            <p className="text-gray-600">Speed & Safe Transports</p>
            <p className="text-gray-600">Estimated Delivery: 3-5 business days</p>
          </div>
          <button
            onClick={() => router.push('/orders')}
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['CONSUMER', 'FARMER']}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
          <form onSubmit={handlePaymentSubmit}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                    className="form-radio text-green-600"
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'upi')}
                    className="form-radio text-green-600"
                  />
                  <span>UPI</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                    className="form-radio text-green-600"
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">UPI ID</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="username@upi"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              {paymentMethod === 'cod' ? 'Place Order' : 'Pay & Place Order'}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
} 