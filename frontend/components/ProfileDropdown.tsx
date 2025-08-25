// components/ProfileDropdown.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Shield,
  Mail,
  LayoutDashboard,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  avatar?: string;
  profileImage?: string
}

export default function ProfileDropdown() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isAdminView = pathname.startsWith('/admin');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/profile`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();
        console.log("profile:", data.data);
        setUser(data.data);
      } catch (error) {
        console.error('Profile fetch error:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const handleProfileClick = () => {
    // Navigate to profile page or open profile modal
    console.log('Profile clicked');
  };

  const handleSettingsClick = () => {
    // Navigate to settings page or open settings modal
    console.log('Settings clicked');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 px-3 py-2">
        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
        <div className="w-20 h-4 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  // Don't show if no user
  if (!user) return null;

  // Generate initials for avatar fallback
  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.charAt(0).toUpperCase();
  };

  console.log("user:", user.profileImage)
  // Get role display name
  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      'admin': 'Administrator',
      'user': 'User',
      'moderator': 'Moderator',
      'expert': 'Plant Expert'
    };
    return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Get role color
  const getRoleColor = (role: string) => {
    const colorMap: Record<string, string> = {
      'admin': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'user': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'moderator': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'expert': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };
  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-auto p-2 hover:bg-accent/50 transition-all duration-200",
                  "focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "data-[state=open]:bg-accent/50"
                )}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Avatar className="h-8 w-8 ring-2 ring-background transition-all duration-200 hover:ring-primary/20 hover:scale-105">
                    <AvatarImage 
                      src={user.profileImage} 
                      alt={user.name || user.email}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20 text-primary font-semibold text-sm">
                      {getInitials(user.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="hidden sm:block text-left min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight truncate">
                      {user.name || user.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-muted-foreground leading-tight truncate">
                      {getRoleDisplayName(user.role)}
                    </p>
                  </div>
                  
                  <ChevronDown className="hidden sm:block h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 data-[state=open]:rotate-180" />
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="sm:hidden">
            <p>Click to open menu</p>
          </TooltipContent>
        </Tooltip>

      <DropdownMenuContent 
        align="end" 
        side="bottom"
        className="w-72 p-3 z-[110]"
        sideOffset={8}
        forceMount
      >
        {/* User Info Header */}
        <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 mb-3">
          <Avatar className="h-12 w-12 ring-2 ring-background shrink-0">
            <AvatarImage 
              src={user.avatar} 
              alt={user.name || user.email}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20 text-primary font-semibold text-lg">
              {getInitials(user.name, user.email)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-sm font-semibold text-foreground truncate">
              {user.name || 'No Name Set'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
            <div className="flex items-center">
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                getRoleColor(user.role)
              )}>
                <Shield className="w-3 h-3 mr-1 shrink-0" />
                {getRoleDisplayName(user.role)}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2" />

        {/* View Switching */}
        <div className="space-y-1 mb-2">
          {isAdminView ? (
            <DropdownMenuItem 
              onClick={() => router.push('/')}
              className="cursor-pointer transition-colors duration-150 hover:bg-accent/50 rounded-md"
            >
              <Home className="mr-3 h-4 w-4 shrink-0" />
              <span>Switch to App View</span>
            </DropdownMenuItem>
          ) : (
            user?.role === 'admin' && (
              <DropdownMenuItem 
                onClick={() => router.push('/admin')}
                className="cursor-pointer transition-colors duration-150 hover:bg-accent/50 rounded-md"
              >
                <LayoutDashboard className="mr-3 h-4 w-4 shrink-0" />
                <span>Switch to Admin View</span>
              </DropdownMenuItem>
            )
          )}
        </div>

        <DropdownMenuSeparator className="my-2" />

        {/* Menu Items */}
        <div className="space-y-1">
          <DropdownMenuItem 
            onClick={handleProfileClick}
            className="cursor-pointer transition-colors duration-150 hover:bg-accent/50 rounded-md"
          >
            <User className="mr-3 h-4 w-4 shrink-0" />
            <span>View Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={handleSettingsClick}
            className="cursor-pointer transition-colors duration-150 hover:bg-accent/50 rounded-md"
          >
            <Settings className="mr-3 h-4 w-4 shrink-0" />
            <span>Settings</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-2" />

        {/* Logout Section */}
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive transition-colors duration-150 hover:bg-destructive/10 rounded-md"
        >
          <LogOut className="mr-3 h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </TooltipProvider>
  );
}