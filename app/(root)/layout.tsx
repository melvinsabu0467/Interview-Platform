// app/interview/layout.tsx
import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { clearSessionLogout, isAuthenticated } from '@/lib/actions/auth.action';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect('/sign-in');

  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-12">
        <nav className="flex justify-between mb-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
            <h2 className="text-primary-100">MockMentor</h2>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button className="btn-primary max-sm:w-full">
                <p className="text-gray-950">Profile</p>
              </Button>
            </Link>

            <Button onClick={clearSessionLogout} className="btn-primary max-sm:w-full">
              <p className="text-gray-950">Log out</p>
              <Image src="/log-out.png" alt="Log out" width={28} height={8} />
            </Button>
          </div>
        </nav>

        {/* Render children here */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
