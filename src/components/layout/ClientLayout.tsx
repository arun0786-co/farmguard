'use client';

import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className="min-h-screen bg-gray-900">
      {children}
      {!isHomePage && (
        <footer className="bg-gray-800 text-white mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About FarmGuard</h3>
                <p className="text-gray-300">
                  Connecting farmers with consumers while providing smart farming solutions through AI-powered monitoring and marketplace access.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
                  <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
                  <li><a href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-gray-300 hover:text-white">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>Email: support@farmguard.com</li>
                  <li>Phone: +1 (555) 123-4567</li>
                  <li>Address: 123 Farm Street, Agritown, AG 12345</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
              <p>&copy; {new Date().getFullYear()} FarmGuard. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
} 