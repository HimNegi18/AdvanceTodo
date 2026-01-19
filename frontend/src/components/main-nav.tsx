'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export function MainNav() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 px-4 py-2 border-b">
      <Link href="/" className="text-lg font-bold">
        Todo App
      </Link>
      <div className="ml-auto flex items-center space-x-4">
        {!isAuthenticated && (
          <>
            <Link
              href="/login"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/login' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/register' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Register
            </Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <Link
              href="/dashboard"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/todos"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/todos' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Todos
            </Link>
            <span className="text-sm font-medium text-muted-foreground">Hello, {user?.name || user?.email}</span>
            <Button variant="ghost" onClick={logout} className="text-sm">
              Logout
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
