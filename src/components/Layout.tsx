import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Wallet, Settings, Moon, Sun, IndianRupee, TrendingUp, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/store/useThemeStore';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import Avatar from '@/components/Avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { User } from '@supabase/supabase-js';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isWide, setIsWide] = useState<boolean>(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : false));
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const navItems = [
    { icon: Wallet, label: 'Expenses', path: '/home' },
    { icon: IndianRupee, label: 'Lending', path: '/lending' },
    { icon: TrendingUp, label: 'Investments', path: '/investments' },
    { icon: BarChart, label: 'Insights', path: '/insights' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!mounted) return;
        setUser(session?.user ?? null);
      } catch (err) {
        // ignore
      }
    })();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      // unsubscribe if present (cast to known shape so TS/linter are happy)
      const sub = (data as { subscription?: { unsubscribe?: () => void } } | null)?.subscription;
      sub?.unsubscribe?.();
    };
  }, []);

  // Keep isWide in sync when the window is resized
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setIsWide(window.innerWidth >= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Grid layout when wide: sidebar + content columns */}
      <div
        className={cn('min-h-screen', isWide ? 'grid' : 'flex flex-col')}
        style={isWide ? { gridTemplateColumns: `${isCollapsed ? 80 : 256}px 1fr` } : undefined}
      >
        {/* Sidebar */}
        {isWide && (
          <aside className="bg-card border-r border-border p-4">
            <div className={cn('flex items-center mb-6', isCollapsed ? 'justify-center': 'justify-between')}>
              <div className="flex items-center gap-3">
                {!isCollapsed && <img src="/android-chrome-512x512.png" alt="FinSight logo" className="h-8 w-8 rounded-md" />}
                {!isCollapsed && <h2 className="text-lg font-semibold">FinSight</h2>}
              </div>
              <button
                onClick={() => setIsCollapsed((v) => !v)}
                className="p-2 rounded-md hover:bg-accent transition-colors"
                aria-label="Toggle sidebar"
              >
                {/* simple hamburger icon using CSS */}
                <span className="block w-3 h-0.5 bg-foreground my-0.5" />
                <span className="block w-3 h-0.5 bg-foreground my-0.5" />
                <span className="block w-3 h-0.5 bg-foreground my-0.5" />
              </button>
            </div>

            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                      isActive ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-accent text-foreground',
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </aside>
        )}

        {/* Content column: header + main + mobile nav */}
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-sm bg-opacity-90">
            {/* Header */}
            <div className={cn('container mx-auto px-4 h-16 flex items-center', (isWide && !isCollapsed) ? 'justify-end' : 'justify-between')}>
              {(!isWide || isCollapsed) && <div className="flex items-center gap-3">
                <img src="/android-chrome-512x512.png" alt="FinSight logo" className="h-8 w-8 rounded-md" />
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  FinSight
                </h1>
              </div>}

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <Moon className="w-5 h-5 text-foreground" />
                  ) : (
                    <Sun className="w-5 h-5 text-foreground" />
                  )}
                </button>

                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2">
                        {(() => {
                          const meta = (user as unknown) as { user_metadata?: { avatar_url?: string } };
                          const avatar = meta?.user_metadata?.avatar_url ?? ((user as unknown) as { avatar_url?: string })?.avatar_url;
                          const email = ((user as unknown) as { email?: string })?.email;
                          if (avatar) {
                            return <Avatar src={avatar} alt={email || 'avatar'} className="h-8 w-8 rounded-full object-cover" />;
                          }
                          const initials = email ? email.charAt(0).toUpperCase() : 'U';
                          return (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                              {initials}
                            </div>
                          );
                        })()}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>
                        {((user as unknown) as { email?: string })?.email}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => navigate('/settings')}>Profile</DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={async () => {
                          await supabase.auth.signOut();
                          setUser(null);
                          navigate('/');
                        }}
                      >
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </div>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

          {/* Bottom Navigation - Mobile */}
          <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50">
            <div className="flex items-center justify-around h-20">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link key={item.path} to={item.path} className="flex-1 flex flex-col items-center justify-center gap-1 relative">
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-x-4 top-[58px] h-1 bg-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Icon className={cn('w-6 h-6 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')} />
                    <span className={cn('text-xs font-medium transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};
