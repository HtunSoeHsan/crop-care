
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfileDropdown from '@/components/ProfileDropdown';

const navItems = [
  { href: '/admin', label: 'Overview', icon: '🏠' },
  { 
    href: '/admin/resources', 
    label: 'Resources', 
    icon: '📚',
    submenu: [
      { href: '/admin/resources', label: 'All Resources' },
      { href: '/admin/resources/articles', label: 'Articles' },
      { href: '/admin/resources/videos', label: 'Videos' },
      { href: '/admin/resources/guides', label: 'Guides' }
    ]
  },
  { href: '/admin/foods', label: 'Foods', icon: '🥗' },
  { href: '/admin/diseases', label: 'Diseases', icon: '🦠' },
  { href: '/admin/users', label: 'Users', icon: '👤' },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white flex flex-col shadow-lg transition-all duration-300`}>
        <div className="px-6 py-6 border-b border-gray-700 flex items-center justify-between">
          {!isCollapsed && <h2 className="text-xl font-bold">CropCare Admin</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
          {navItems.map((item) => (
            <div key={item.href}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => setOpenSubmenu(openSubmenu === item.href ? null : item.href)}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 justify-between'} px-4 py-3 rounded-lg font-medium transition-all duration-200
                      ${pathname.startsWith(item.href)
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-700 text-gray-300 hover:text-white'}
                    `}
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                      <span className="text-lg">{item.icon}</span>
                      {!isCollapsed && item.label}
                    </div>
                    {!isCollapsed && (
                      <span className={`transition-transform duration-200 ${
                        openSubmenu === item.href ? 'rotate-90' : ''
                      }`}>
                        ▶
                      </span>
                    )}
                  </button>
                  {!isCollapsed && openSubmenu === item.href && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`block px-4 py-2 rounded-lg text-sm transition-all duration-200
                            ${pathname === subItem.href
                              ? 'bg-blue-500 text-white'
                              : 'hover:bg-gray-700 text-gray-400 hover:text-white'}
                          `}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${pathname === item.href
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700 text-gray-300 hover:text-white'}
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <ProfileDropdown />
          </div>
        </header>
        <section className="flex-1 p-8">{children}</section>
      </main>
    </div>
  );
};

export default AdminLayout;
