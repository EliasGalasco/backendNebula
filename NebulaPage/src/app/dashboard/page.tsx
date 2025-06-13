
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Star, Settings, Edit3, Sparkles, LogOut, UserCircle, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, isFuture, isToday } from 'date-fns';
import { es } from 'date-fns/locale/es';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// TODO: Backend Integration: Define interfaces for User and Booking data from the backend.
interface User {
  id?: string; // User ID from backend
  name: string;
  email: string;
  points: number;
  // Add other user fields as needed, e.g., phone, avatarUrl
}

interface Booking {
  id: string | number; // Booking ID from backend
  service: string; // Could be a comma-separated string of service names or an array of service objects/IDs
  // serviceIds?: string[]; // If backend stores service IDs
  date: string; // YYYY-MM-DD
  time: string;
  // Add other booking fields like status, price, technicianId, etc.
}

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchUserDataAndBookings = async () => {
    setIsLoadingData(true);
    const token = localStorage.getItem('nebulaAuthToken');
    // TODO: Backend Integration: Validate token with backend. If invalid, redirect.
    // const isValidToken = await validateTokenAPI(token); if (!isValidToken) { router.push(...); return; }

    if (!token) {
      toast({ title: "Acceso Denegado", description: "Por favor, inicia sesión para ver tu panel de control.", variant: "destructive" });
      router.push('/auth/login?redirect=/dashboard');
      setIsLoadingData(false);
      return;
    }

    // TODO: Backend Integration: Fetch user data from an API endpoint (e.g., /api/users/me)
    // const userResponse = await fetch('/api/users/me', { headers: { 'Authorization': `Bearer ${token}` } });
    // const userData: User = await userResponse.json();
    // setUser(userData);

    // TODO: Backend Integration: Fetch user's upcoming bookings from an API (e.g., /api/users/me/bookings?status=upcoming)
    // const bookingsResponse = await fetch('/api/users/me/bookings?status=upcoming&sortBy=date&order=asc', { headers: { 'Authorization': `Bearer ${token}` } });
    // const userBookings: Booking[] = await bookingsResponse.json();
    // setBookings(userBookings);

    // Using localStorage for now:
    const storedUser = localStorage.getItem('nebulaUser');
    if (storedUser) setUser(JSON.parse(storedUser));
    else { // If no user data, might be an issue or new login flow
        router.push('/auth/login?redirect=/dashboard');
        setIsLoadingData(false);
        return;
    }

    const storedBookings = localStorage.getItem('nebulaBookings');
    if (storedBookings) {
      const parsedBookings: Booking[] = JSON.parse(storedBookings);
      const upcomingBookings = parsedBookings
        .filter(booking => {
          const bookingDateTime = parseISO(`${booking.date}T${booking.time}`);
          return isFuture(bookingDateTime) || isToday(bookingDateTime);
        })
        .sort((a, b) => parseISO(`${a.date}T${a.time}`).getTime() - parseISO(`${b.date}T${b.time}`).getTime());
      setBookings(upcomingBookings);
    }
    setIsLoadingData(false);
  };

  useEffect(() => {
    setIsMounted(true);
    fetchUserDataAndBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleLogout = () => {
    // TODO: Backend Integration: Call an API endpoint to invalidate the session/token on the backend if necessary.
    // await fetch('/api/auth/logout', { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('nebulaAuthToken')}` } });
    localStorage.removeItem('nebulaAuthToken');
    localStorage.removeItem('nebulaUser');
    localStorage.removeItem('nebulaBookings');
    toast({ title: "Sesión Cerrada", description: "Has cerrado sesión correctamente." });
    router.push('/');
  };

  const confirmCancelBooking = (booking: Booking) => {
    setBookingToCancel(booking);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    // TODO: Backend Integration: Call an API endpoint to cancel the booking.
    // try {
    //   const response = await fetch(`/api/bookings/${bookingToCancel.id}/cancel`, {
    //     method: 'POST', // or 'PUT' or 'DELETE' depending on API design
    //     headers: { 'Authorization': `Bearer ${localStorage.getItem('nebulaAuthToken')}` },
    //   });
    //   if (!response.ok) throw new Error('Failed to cancel booking');
    //
    //   // If successful, update UI:
    //   setBookings(prevBookings => prevBookings.filter(b => b.id !== bookingToCancel.id));
    //   toast({ title: "Cita Cancelada", description: `Tu cita ha sido cancelada.` });
    // } catch (error) {
    //   toast({ title: "Error al Cancelar", description: "No se pudo cancelar la cita. Inténtalo de nuevo.", variant: "destructive" });
    // } finally {
    //   setBookingToCancel(null);
    // }

    // Current localStorage implementation:
    const currentBookings: Booking[] = JSON.parse(localStorage.getItem('nebulaBookings') || '[]');
    const updatedBookings = currentBookings.filter(b => b.id !== bookingToCancel.id);
    localStorage.setItem('nebulaBookings', JSON.stringify(updatedBookings));

    setBookings(updatedBookings.filter(booking => {
        const bookingDateTime = parseISO(`${booking.date}T${booking.time}`);
        return isFuture(bookingDateTime) || isToday(bookingDateTime);
      }).sort((a, b) => parseISO(`${a.date}T${a.time}`).getTime() - parseISO(`${b.date}T${b.time}`).getTime())
    );

    toast({
      title: "Cita Cancelada",
      description: `Tu cita para ${bookingToCancel.service} ha sido cancelada.`,
    });
    setBookingToCancel(null); // Close dialog
  };

  if (!isMounted || isLoadingData) {
     return (
      <PageWrapper className="text-center">
        <Sparkles className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Cargando panel de control...</p>
      </PageWrapper>
    );
  }

  if (!user) {
    // This case should ideally be handled by the loading state or redirect within fetchUserDataAndBookings
    return (
      <PageWrapper className="text-center">
        <p className="text-muted-foreground">No se pudieron cargar los datos del usuario. Redirigiendo...</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                 <Avatar className="h-20 w-20 border-2 border-primary">
                    {/* TODO: Backend Integration: Use user.avatarUrl if available from backend */}
                    <AvatarImage src={`https://placehold.co/100x100.png?text=${user.name.charAt(0)}`} alt={user.name} data-ai-hint="avatar abstract"/>
                    <AvatarFallback className="text-2xl bg-muted">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="font-headline text-4xl md:text-5xl text-primary">¡Bienvenido/a, {user.name}!</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-2">
                 {/* TODO: Backend Integration: Link "Editar Perfil" to a page/modal for updating user info via API (e.g., PUT /api/users/me) */}
                 <Button variant="outline" size="sm" onClick={() => toast({title: "Próximamente", description:"La edición de perfil estará disponible pronto."})}>
                    <Edit3 className="mr-2 h-4 w-4" /> Editar Perfil
                 </Button>
                 <Button variant="ghost" size="sm" onClick={handleLogout}>
                     <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                 </Button>
            </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Upcoming Appointments Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
              <CalendarDays className="h-7 w-7 mr-3 text-accent" /> Próximas Citas
            </CardTitle>
            <CardDescription>Gestiona tus visitas programadas.</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length > 0 ? (
              <ul className="space-y-4">
                {bookings.slice(0,3).map((booking) => (
                  <li key={booking.id} className="p-3 border rounded-md bg-background hover:bg-secondary/30 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <p className="font-semibold text-foreground">{booking.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(`${booking.date}T${booking.time}`), "eeee, dd 'de' MMMM, yyyy", { locale: es })} a las {booking.time}
                      </p>
                    </div>
                       <Button variant="destructive" size="sm" className="mt-2 sm:mt-0" onClick={() => confirmCancelBooking(booking)}>
                         <Trash2 className="mr-2 h-4 w-4" /> Cancelar
                       </Button>
                  </li>
                ))}
                {/* TODO: Backend Integration: If more than 3 bookings, add a "View All" link to a page showing all user bookings */}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">No tienes próximas citas.</p>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/book">Reservar una Nueva Cita</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Loyalty Status Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
              <Star className="h-7 w-7 mr-3 text-accent" /> Estado de Fidelidad
            </CardTitle>
            <CardDescription>Tus puntos y beneficios de Nebula Rewards.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {/* TODO: Backend Integration: user.points should come from the backend user data */}
            <p className="text-6xl font-bold text-primary mb-2">{user.points}</p>
            <p className="text-muted-foreground mb-4">Puntos de Fidelidad</p>
             <p className="text-sm text-muted-foreground">
              ¡Gana puntos con cada visita y canjéalos por recompensas emocionantes!
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="outline" asChild>
              <Link href="/loyalty">Ver Programa de Fidelidad</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
                <Settings className="h-7 w-7 mr-3 text-accent" /> Configuración de la Cuenta
            </CardTitle>
            <CardDescription>Gestiona las preferencias y detalles de tu cuenta.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* TODO: Backend Integration: Each button would link to a page/modal for specific account settings.
                - Información Personal: Update name, email, phone (PUT /api/users/me).
                - Preferencias: Manage communication preferences (PUT /api/users/me/preferences).
                - Historial de Reservas: View all past and upcoming bookings (GET /api/users/me/bookings?status=all).
            */}
            <Button variant="subtle" className="justify-start p-4 h-auto text-left" onClick={() => toast({title: "Próximamente", description:"La gestión de información personal estará disponible pronto."})}>
                <UserCircle className="mr-3 h-6 w-6 text-primary" />
                <div>
                    <p className="font-semibold">Información Personal</p>
                    <p className="text-xs text-muted-foreground">Actualiza tu nombre, correo electrónico, teléfono</p>
                </div>
            </Button>
             <Button variant="subtle" className="justify-start p-4 h-auto text-left" onClick={() => toast({title: "Próximamente", description:"La gestión de preferencias estará disponible pronto."})}>
                <Sparkles className="mr-3 h-6 w-6 text-primary" />
                <div>
                    <p className="font-semibold">Preferencias</p>
                    <p className="text-xs text-muted-foreground">Gestionar preferencias de comunicación</p>
                </div>
            </Button>
             <Button variant="subtle" className="justify-start p-4 h-auto text-left" onClick={() => toast({title: "Próximamente", description:"El historial de reservas estará disponible pronto."})}>
                <CalendarDays className="mr-3 h-6 w-6 text-primary" />
                <div>
                    <p className="font-semibold">Historial de Reservas</p>
                    <p className="text-xs text-muted-foreground">Ver citas pasadas</p>
                </div>
            </Button>
        </CardContent>
      </Card>

      <AlertDialog open={!!bookingToCancel} onOpenChange={(open) => !open && setBookingToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-destructive" />
                ¿Confirmar Cancelación?
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro/a de que quieres cancelar tu cita para <strong>{bookingToCancel?.service}</strong> el{' '}
              <strong>{bookingToCancel ? format(parseISO(`${bookingToCancel.date}T${bookingToCancel.time}`), "eeee, dd 'de' MMMM", { locale: es }) : ''} a las {bookingToCancel?.time}</strong>?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBookingToCancel(null)}>Volver</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelBooking} className="bg-destructive hover:bg-destructive/90">
              Sí, Cancelar Cita
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </PageWrapper>
  );
}
