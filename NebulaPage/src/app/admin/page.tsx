
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, BarChart2, ShieldCheck, Sparkles, Bell } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

// TODO: Backend Integration: Define interfaces for AdminStats and BookingDetails from the backend
interface AdminStats {
  totalBookings: number;
  upcomingBookings: number;
  totalClients: number;
  loyaltyMembers: number;
}

interface BookingDetail {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  status: string; // e.g., 'Confirmado', 'Pendiente', 'Cancelado'
}

// Mock data - in a real app, this would come from a database
const mockAdminData_initial: AdminStats = {
  totalBookings: 0, // Placeholder, will be fetched
  upcomingBookings: 0, // Placeholder, will be fetched
  totalClients: 0, // Placeholder, will be fetched
  loyaltyMembers: 0, // Placeholder, will be fetched
};

const mockRecentBookings_initial: BookingDetail[] = []; // Placeholder, will be fetched


export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats>(mockAdminData_initial);
  const [recentBookings, setRecentBookings] = useState<BookingDetail[]>(mockRecentBookings_initial);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);


  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem('nebulaAuthToken');
    // TODO: Backend Integration: Replace localStorage token check with a proper role verification API call
    if (token === 'mock-admin-token') {
      setIsAdmin(true);
      // Fetch admin data if user is admin
      fetchAdminDashboardData();
      fetchRecentBookingsData();
    } else if (token) {
        toast({ title: "Acceso Denegado", description: "No tienes permiso para ver esta página.", variant: "destructive" });
        router.push('/dashboard');
    }
    else {
      toast({ title: "Inicio de Sesión Requerido", description: "Por favor, inicia sesión como administrador.", variant: "destructive" });
      router.push('/auth/login?redirect=/admin');
    }

    const newBookingFlag = localStorage.getItem('newBookingForAdmin');
    if (newBookingFlag === 'true') {
      toast({
        title: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Bell className="h-5 w-5 mr-2 text-primary" />
            <span>¡Nueva Reserva!</span>
          </div>
        ),
        description: "Se ha registrado una nueva cita. Por favor, revisa la lista de reservas.",
        duration: 7000,
      });
      localStorage.removeItem('newBookingForAdmin');
      // TODO: Backend Integration: This local flag should ideally be replaced by a real-time notification system (e.g., WebSockets)
      // or a pull mechanism when the admin page loads/refreshes, checking for new bookings since last view.
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, toast]); // isAdmin removed to prevent re-triggering fetch on its change after initial load

  // TODO: Backend Integration: Function to fetch admin dashboard statistics
  async function fetchAdminDashboardData() {
    setIsLoadingStats(true);
    // Replace with actual API call:
    // const response = await fetch('/api/admin/stats');
    // const data = await response.json();
    // setAdminStats(data);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    setAdminStats({
      totalBookings: 125,
      upcomingBookings: 15,
      totalClients: 88,
      loyaltyMembers: 62,
    }); // Using mock data for now
    setIsLoadingStats(false);
  }

  // TODO: Backend Integration: Function to fetch recent bookings
  async function fetchRecentBookingsData() {
    setIsLoadingBookings(true);
    // Replace with actual API call:
    // const response = await fetch('/api/admin/bookings/recent'); // Or a more general /api/bookings?limit=3&status=upcoming_or_recent
    // const data = await response.json();
    // setRecentBookings(data);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    setRecentBookings([
      { id: 'B001', clientName: 'Alicia Maravillas', service: 'Manicura de Gel', date: '2024-08-15', time: '10:00 AM', status: 'Confirmado' },
      { id: 'B002', clientName: 'Roberto el Constructor', service: 'Pedicura de Lujo', date: '2024-08-15', time: '02:00 PM', status: 'Confirmado' },
      { id: 'B003', clientName: 'Carlitos Marrón', service: 'Manicura Clásica', date: '2024-08-16', time: '11:30 AM', status: 'Pendiente' },
    ]); // Using mock data for now
    setIsLoadingBookings(false);
  }


  if (!isMounted || !isAdmin) {
    return (
      <PageWrapper className="text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-primary animate-pulse mb-4" />
        <p className="text-muted-foreground">Verificando acceso de administrador...</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <section className="mb-12 text-center">
        <ShieldCheck className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-5xl md:text-6xl text-primary mb-3">Panel de Administración</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Gestiona reservas, clientes y operaciones del salón para Nebula Nails.
        </p>
      </section>

      {/* Key Metrics */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* TODO: Backend Integration: Display real totalBookings from adminStats */}
            <div className="text-2xl font-bold">{isLoadingStats ? "..." : adminStats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">Desde siempre</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* TODO: Backend Integration: Display real upcomingBookings from adminStats */}
            <div className="text-2xl font-bold">{isLoadingStats ? "..." : adminStats.upcomingBookings}</div>
            <p className="text-xs text-muted-foreground">Próximos 7 días</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Registrados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* TODO: Backend Integration: Display real totalClients from adminStats */}
            <div className="text-2xl font-bold">{isLoadingStats ? "..." : adminStats.totalClients}</div>
            <p className="text-xs text-muted-foreground">Total de clientes activos</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Miembros del Programa de Fidelidad</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* TODO: Backend Integration: Display real loyaltyMembers from adminStats */}
            <div className="text-2xl font-bold">{isLoadingStats ? "..." : adminStats.loyaltyMembers}</div>
            <p className="text-xs text-muted-foreground">Clientes en el programa de fidelidad</p>
          </CardContent>
        </Card>
      </section>

      {/* Management Sections */}
      <section className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
              <Calendar className="h-7 w-7 mr-3 text-accent" /> Gestionar Reservas
            </CardTitle>
            <CardDescription>
              Ver y gestionar todas las citas.
              {/* TODO: Backend Integration: Implement full booking management (view all, filter, edit status, etc.).
                   This might involve a new page/component with a table or calendar view powered by API data.
                   The current list is only recent/mock bookings.
              */}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingBookings ? <p>Cargando reservas...</p> : (
              <ul className="space-y-3">
                {recentBookings.length > 0 ? recentBookings.map(booking => (
                  <li key={booking.id} className="p-3 border rounded-md bg-secondary/30 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{booking.clientName} - <span className="text-sm text-muted-foreground">{booking.service}</span></p>
                      <p className="text-xs text-muted-foreground">{format(new Date(booking.date), 'PPP', { locale: es })} a las {booking.time}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${booking.status === 'Confirmado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {booking.status}
                    </span>
                  </li>
                )) : <p>No hay reservas recientes para mostrar.</p>}
              </ul>
            )}
             <Button className="mt-4 w-full" variant="outline" onClick={() => alert("Página completa de gestión de reservas aún no implementada. Requiere integración con backend.")}>
               Ver Todas las Reservas
             </Button>
             {/* TODO: Backend Integration: The above button should navigate to a dedicated booking management page/view.
                  This page would fetch all bookings (with pagination, filters for date/status/client) from an endpoint like /api/admin/bookings.
                  It should allow actions like confirming, cancelling, or marking bookings as completed.
             */}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
              <Users className="h-7 w-7 mr-3 text-accent" /> Gestión de Clientes
            </CardTitle>
            <CardDescription>Accede a la información e historial de clientes.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground mb-4">Busca clientes, mira su historial de reservas y gestiona puntos de fidelidad.</p>
             <Button className="w-full" variant="outline" onClick={() => alert("Página de gestión de clientes aún no implementada. Requiere integración con backend.")}>
               Gestionar Clientes
             </Button>
             {/* TODO: Backend Integration: This button should navigate to a client management page.
                  This page would fetch a list of all clients from an endpoint like /api/admin/clients.
                  It should allow searching/filtering clients.
                  Clicking a client should show their details: profile info, full booking history (from /api/admin/clients/{clientId}/bookings),
                  loyalty points (from /api/admin/clients/{clientId}/loyalty), and an interface to adjust points if necessary.
             */}
          </CardContent>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="font-headline text-3xl text-foreground mb-6">Herramientas Adicionales de Administración</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {/* TODO: Backend Integration: Each of these buttons would lead to a new section/page for managing salon settings.
               - Gestionar Servicios y Precios: CRUD operations for services (/api/admin/services).
               - Configuración del Programa de Fidelidad: Define reward tiers, points per booking, etc. (/api/admin/loyalty/settings).
               - Ver Informes y Analíticas: More detailed reports beyond the basic stats (e.g., revenue, popular services, client demographics) (/api/admin/reports).
               - Configuración del Salón: Business hours, address, contact info, possibly staff management (/api/admin/salon/settings).
          */}
          <Button variant="subtle" onClick={() => alert("Gestión de servicios no implementada. Requiere backend.")}>Gestionar Servicios y Precios</Button>
          <Button variant="subtle" onClick={() => alert("Configuración del programa de fidelidad no implementada. Requiere backend.")}>Configuración del Programa de Fidelidad</Button>
          <Button variant="subtle" onClick={() => alert("Herramientas de informes no implementadas. Requiere backend.")}>Ver Informes y Analíticas</Button>
          <Button variant="subtle" onClick={() => alert("Configuración del salón no implementada. Requiere backend.")}>Configuración del Salón</Button>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Este es un panel de administración conceptual. La funcionalidad completa requiere integración con el backend.
        </p>
      </section>
    </PageWrapper>
  );
}
