'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Logo from '@/components/Logo';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function checkUserStatus() {
      if (status === 'unauthenticated') {
        router.push('/auth/signin');
      } else if (status === 'authenticated') {
        try {
          // Fetch user from API
          const response = await fetch('/api/users/me');
          const data = await response.json();

          if (data.user && data.user.onboardingCompleted) {
            router.push('/dashboard');
          } else {
            router.push('/onboarding');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          router.push('/onboarding');
        }
      }
    }

    checkUserStatus();
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-50">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Logo size="2xl" />
        </div>
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    </div>
  );
}
