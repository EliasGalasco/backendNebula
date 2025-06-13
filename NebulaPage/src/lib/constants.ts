import type { LucideIcon } from 'lucide-react';
import { LogIn, UserPlus, LayoutDashboard, ShoppingBag, Contact, Star, Home, CalendarDays } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon?: LucideIcon;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/services', label: 'Servicios', icon: ShoppingBag },
  { href: '/book', label: 'Reservar Ahora', icon: CalendarDays },
  { href: '/loyalty', label: 'Fidelidad', icon: Star },
  { href: '/contact', label: 'Contacto', icon: Contact },
];

export const AUTH_LINKS: NavLink[] = [
  { href: '/auth/login', label: 'Iniciar Sesión', icon: LogIn, variant: 'outline' },
  { href: '/auth/register', label: 'Registrarse', icon: UserPlus, variant: 'default' },
];

export const USER_DASHBOARD_LINKS: NavLink[] = [
  { href: '/dashboard', label: 'Panel de Control', icon: LayoutDashboard, variant: 'default' },
];
