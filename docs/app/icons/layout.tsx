import { Navbar, Sidebar } from '@/components/layout';
import React from 'react';

interface LayoutProp {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProp) {
  return (
    <div className="relative flex flex-col">
      <Navbar />
      <div className="container mx-auto max-w-8xl">{children}</div>
    </div>
  );
}
