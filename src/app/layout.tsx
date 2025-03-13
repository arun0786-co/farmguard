import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Navigation from '@/components/layout/Navigation';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import FarmBot from '@/components/bot/FarmBot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FarmGuard - Connecting Farmers and Consumers',
  description: 'A marketplace for farmers to sell their products and connect with consumers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                <div className="bg-gray-800 rounded-lg shadow-xl p-6">
                  {children}
                </div>
              </main>
              <FarmBot />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
