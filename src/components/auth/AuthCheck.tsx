'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const publicPaths = ['/auth/login', '/auth/register', '/'];

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isPublicPath = publicPaths.includes(pathname);

    if (!isLoggedIn && !isPublicPath) {
      router.push('/auth/login');
    }
  }, [pathname, router]);

  return <>{children}</>;
} 