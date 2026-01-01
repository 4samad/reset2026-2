'use client';

import Link from 'next/link';
import Image from 'next/image';
import Logo from './Logo';
import { FaUserCircle } from 'react-icons/fa';

export default function Header() {
  return (
    <div className="navbar bg-base-100 px-4 sm:px-6">
      <div className="flex-1">
        <div className="flex items-center">
          <Image
            src="/detoxmind-logo.png"
            alt="DetoxMind Logo"
            width={80}
            height={80}
            className="h-12 sm:h-14 w-auto"
            priority
            unoptimized
          />
          <div className="divider divider-horizontal mx-0 opacity-60"></div>
          <Logo size="md" />
        </div>
      </div>
      <div className="flex-none">
        <Link href="/settings" className="btn btn-ghost btn-circle">
          <FaUserCircle className="w-8 h-8" />
        </Link>
      </div>
    </div>
  );
}
