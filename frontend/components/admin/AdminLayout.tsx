
"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Overview', icon: '🏠' },
  { href: '/admin/resources', label: 'Resources', icon: '📚' },
  { href: '/admin/healthy-foods', label: 'Healthy Foods', icon: '🥗' },
  { href: '/admin/users', label: 'Users', icon: '👤' },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800/90 text-white flex flex-col p-0 shadow-xl transition-all duration-300">
        <div className="px-6 py-8 border-b border-gray-700">
          <h2 className="text-3xl font-extrabold tracking-tight">CropCare Admin</h2>
          <p className="text-gray-400 text-sm mt-1">Management Panel</p>
        </div>
        <nav className="flex-1 flex flex-col gap-2 px-2 py-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-lg transition-all duration-200 ease-in-out
                ${pathname === item.href
                  ? 'bg-gradient-to-r from-yellow-400/20 to-yellow-300/10 text-yellow-300 shadow-inner'
                  : 'hover:bg-gray-700/70 hover:text-yellow-200 text-white/90'}
              `}
            >
              <span className="text-2xl transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-gray-700 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} CropCare
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          {/* Add user info, notifications, or actions here if needed */}
        </header>
        <section className="flex-1 p-8">{children}</section>
      </main>
    </div>
  );
};

export default AdminLayout;
