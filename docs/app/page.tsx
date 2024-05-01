'use client';
import { Navbar } from '@/components/layout';
import Image from 'next/image';
import Home from './home';

export default function App() {
  return (
    <div className="relative flex flex-col">
      <Navbar />
      <Home />
    </div>
  );
}
