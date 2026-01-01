'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FiShield } from 'react-icons/fi';
import Logo from '@/components/Logo';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <div className="flex justify-center mb-3">
            <Logo size="2xl" />
          </div>
          <div className="space-y-1">
            <p className="text-lg sm:text-xl font-bold">30 Days Digital Detox</p>
            <p className="text-sm sm:text-base opacity-70 font-medium">By <a className='border-b-2 border-neutral-400' target='_blank' href="https://detoxmind.org">Detox Mind</a></p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-2xl border-4 border-base-300 rounded-3xl animate-slide-up">
          <div className="card-body p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-4 sm:mb-6">
              Welcome! 👋
            </h2>

            <div className="alert bg-info/10 border-2 border-info rounded-2xl">
              <FiShield className="w-5 h-5 shrink-0 text-info" />
              <span className="text-xs sm:text-sm font-semibold">
                We don't store your Google data. Login is only for authentication.
              </span>
            </div>

            <button
              onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
              className="btn btn-primary btn-lg w-full gap-3 mt-4 sm:mt-6 rounded-2xl font-bold text-base shadow-xl transform hover:scale-105 transition-all"
            >
              <FcGoogle className="w-7 h-7" />
              <span>Continue with Google</span>
            </button>

            <p className="mt-4 sm:mt-6 text-xs sm:text-sm opacity-70 text-center leading-relaxed font-medium">
              This is a safe, anonymous space. Your journey is private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
