"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Leaf, Search, Home, Book, LineChart, Menu, X, CloudRain } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import ProfileDropdown from './ProfileDropdown';

const Navigation = () => {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const routes = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/scan', label: t('scan'), icon: Leaf },
    { href: '/search', label: t('search'), icon: Search },
    { href: '/resources', label: t('resources'), icon: Book },
    { href: '/dashboard', label: t('dashboard'), icon: LineChart },
    { href: '/weather', label: t('weather'), icon: CloudRain },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CropCare</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {route.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop controls */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <ModeToggle />
          <ProfileDropdown />
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2 relative mobile-controls">
          <div className="mobile-dropdown-fix">
            <LanguageSwitcher />
          </div>
          <div className="mobile-dropdown-fix">
            <ModeToggle />
          </div>
          <div className="mobile-dropdown-fix">
            <ProfileDropdown />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden container mx-auto px-4 py-4 pb-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="grid gap-4">
            {routes.map((route) => {
              const Icon = route.icon;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                    pathname === route.href
                      ? "text-primary bg-muted"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {route.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;