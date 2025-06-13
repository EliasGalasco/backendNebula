
"use client";

import Link from 'next/link';
import { Sparkles, Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { NAV_LINKS, AUTH_LINKS, USER_DASHBOARD_LINKS } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const NebulaLogo = () => (
  <Link href="/" className="flex items-center gap-2 text-2xl font-headline text-primary hover:text-primary/80 transition-colors">
    <Sparkles className="h-7 w-7 text-accent" />
    Nebula Nails
  </Link>
);

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setTheme] = useState('light');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem('nebulaAuthToken');
    setIsLoggedIn(!!token);

    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [pathname]); // Re-check auth on path change, theme is handled below for initial load

  useEffect(() => {
    // This effect runs once on mount to set the initial theme from localStorage
    // if it wasn't already set by the pathname-dependent effect (e.g. first load)
    if (isMounted) {
      const storedTheme = localStorage.getItem('theme');
      const initialTheme = storedTheme || 'light'; // Default to light if nothing stored
      if (theme !== initialTheme) { // Only update if different from what pathname effect might have set
         setTheme(initialTheme);
      }
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);


  const handleLogout = () => {
    localStorage.removeItem('nebulaAuthToken');
    setIsLoggedIn(false);
    router.push('/');
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newTheme;
    });
  };

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <NebulaLogo />
          <div className="h-8 w-32 rounded-md animate-pulse bg-muted" /> {/* Adjusted pulse width */}
        </div>
      </header>
    );
  }
  
  const currentNavLinks = NAV_LINKS;
  const currentAuthLinks = isLoggedIn ? USER_DASHBOARD_LINKS : AUTH_LINKS;

  const ThemeToggleButton = ({ forMobile }: { forMobile?: boolean }) => (
    <Button
      variant="ghost"
      size={forMobile ? "default" : "icon"}
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Activar tema oscuro' : 'Activar tema claro'}
      className={forMobile ? "w-full justify-start text-lg py-3" : ""}
    >
      {theme === 'light' ? <Moon className={forMobile ? "mr-2 h-5 w-5" : "h-5 w-5"} /> : <Sun className={forMobile ? "mr-2 h-5 w-5" : "h-5 w-5"} />}
      {forMobile && (theme === 'light' ? 'Tema Oscuro' : 'Tema Claro')}
    </Button>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <NebulaLogo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-2 items-center"> {/* Reduced gap for more space */}
          {currentNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggleButton />
          {currentAuthLinks.map((link) => (
             <Button key={link.href} variant={link.variant === 'outline' ? 'outline' : 'default'} size="sm" asChild>
               <Link href={link.href}>{link.label}</Link>
             </Button>
           ))}
           {isLoggedIn && (
             <Button variant="ghost" size="sm" onClick={handleLogout}>
               Cerrar Sesión
             </Button>
           )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <ThemeToggleButton />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6 bg-background">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                  <NebulaLogo />
                  <SheetClose asChild>
                     <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Cerrar menú</span>
                     </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col gap-4">
                  {currentNavLinks.map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={`text-lg font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-primary font-semibold' : 'text-foreground'}`}
                      >
                        {link.icon && <link.icon className="mr-2 h-5 w-5 inline" />}
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <hr className="my-4 border-border" />
                  {currentAuthLinks.map((link) => (
                     <SheetClose key={link.href} asChild>
                       <Button variant={link.variant === 'outline' ? 'outline' : 'default'} className="w-full justify-start text-lg py-3" asChild>
                         <Link href={link.href}>{link.icon && <link.icon className="mr-2 h-5 w-5" />}{link.label}</Link>
                       </Button>
                     </SheetClose>
                   ))}
                   {isLoggedIn && (
                     <SheetClose asChild>
                       <Button variant="ghost" className="w-full justify-start text-lg py-3" onClick={handleLogout}>
                         Cerrar Sesión
                       </Button>
                     </SheetClose>
                   )}
                  {/* <SheetClose asChild>
                     <ThemeToggleButton forMobile={true} />
                  </SheetClose> */}
                  {/* Note: Theme toggle for mobile is outside the sheet trigger, beside it. If preferred inside, uncomment above and remove from md:hidden flex */}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
