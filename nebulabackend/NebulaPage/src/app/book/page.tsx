
"use client";

import { useState, useEffect, type FormEvent, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { CalendarCheck, Clock, Sparkles, UserCircle, AlertTriangle, MessageSquare, Scissors } from 'lucide-react';
import { format, addDays, differenceInCalendarDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale/es';
import Link from 'next/link';

// TODO: Backend Integration: This service list might eventually come from a backend API endpoint (e.g., /api/services)
// to allow dynamic management of services and prices.
interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
}

// TODO: Backend Integration: Define a Booking interface that matches the backend's expected booking creation payload
// and the structure of bookings fetched for the 15-day check.
interface BookingPayload { // For creating a new booking
  serviceIds: string[]; // Array of selected service IDs
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  totalPrice: number;
  totalDuration: number;
  // userId?: string; // If user is logged in, associate with user
}

interface ExistingBooking { // For checking past bookings
  id: string | number;
  service: string; // Or serviceIds if backend stores them this way
  date: string; // YYYY-MM-DD
  time: string;
}

const availableServices: Service[] = [
  { id: 'classic-mani', name: 'Manicura Clásica', duration: 45, price: 35 },
  { id: 'gel-mani', name: 'Manicura de Gel', duration: 60, price: 50 },
  { id: 'lux-pedi', name: 'Pedicura de Lujo', duration: 75, price: 65 },
  { id: 'extensions', name: 'Extensiones de Uñas', duration: 120, price: 70 },
  { id: 'nail-art', name: 'Decoración de Uñas (simple)', duration: 30, price: 15 },
];

const WHATSAPP_NUMBER = "3415321293";
const BOOKING_BUFFER_MINUTES = 30;

// TODO: Backend Integration: Time slot generation ideally should be handled by the backend
// to account for existing bookings across all users and staff availability in real-time.
// The backend would receive a date and total service duration (including buffer) and return available slots.
// For now, it remains client-side.
const generateTimeSlots = (date: Date | undefined, effectiveTotalDuration: number): string[] => {
  if (!date || effectiveTotalDuration <= 0) return [];

  const slots: string[] = [];
  const dayOfWeek = date.getDay();

  if (dayOfWeek === 0) return []; // Closed on Sundays

  let startTime = dayOfWeek === 6 ? 10 : 9;
  let endTime = dayOfWeek === 6 ? 16 : 18;

  for (let hour = startTime; hour < endTime; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const slotDate = new Date(date);
      slotDate.setHours(hour, minute, 0, 0);

      if (slotDate.getTime() < new Date().getTime()) continue;

      const slotEndWithEffectiveDuration = new Date(slotDate.getTime() + effectiveTotalDuration * 60000);

      if (slotEndWithEffectiveDuration.getHours() < endTime || (slotEndWithEffectiveDuration.getHours() === endTime && slotEndWithEffectiveDuration.getMinutes() === 0)) {
          slots.push(format(slotDate, 'HH:mm'));
      }
    }
  }
  return slots;
};


export default function BookAppointmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isBookingBlocked, setIsBookingBlocked] = useState(false);
  const [canBookAgainDate, setCanBookAgainDate] = useState<Date | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem('nebulaAuthToken');
    setIsLoggedIn(!!token);
    if (!token) {
      toast({
        title: "Inicio de Sesión Requerido",
        description: "Por favor, inicia sesión para reservar una cita.",
        variant: "destructive"
      });
      router.push('/auth/login?redirect=/book');
      return;
    }

    // TODO: Backend Integration: Fetch user's booking history to check the 15-day rule.
    // Replace localStorage.getItem('nebulaBookings') with an API call.
    // Example: const userBookings = await fetchUserBookingsAPI(userId);
    const fetchUserBookingsAndCheckBlock = async () => {
      // const userId = localStorage.getItem('userId'); // Assuming userId is stored
      // if (!userId) return;
      // const response = await fetch(`/api/users/${userId}/bookings?sortBy=date&order=desc`);
      // const bookings: ExistingBooking[] = await response.json();

      // For now, using localStorage:
      const storedBookings = localStorage.getItem('nebulaBookings');
      if (storedBookings) {
        try {
          const bookings: ExistingBooking[] = JSON.parse(storedBookings);
          if (bookings.length > 0) {
            const sortedBookings = bookings.sort((a, b) =>
              new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()
            );
            const latestBooking = sortedBookings[0];
            const latestBookingDate = parseISO(latestBooking.date);

            const daysSinceLastBooking = differenceInCalendarDays(new Date(), latestBookingDate);

            if (daysSinceLastBooking < 15) {
              setIsBookingBlocked(true);
              const nextAvailableDate = addDays(latestBookingDate, 15);
              setCanBookAgainDate(nextAvailableDate);
            }
          }
        } catch (error) {
          console.error("Error parsing bookings from localStorage", error);
          localStorage.removeItem('nebulaBookings'); // Clear corrupted data
        }
      }
    };
    fetchUserBookingsAndCheckBlock();

  }, [router, toast]);

  const handleServiceSelectionChange = (serviceId: string, checked: boolean) => {
    setSelectedServices(prev => {
      const newSelectedServices = checked
        ? [...prev, serviceId]
        : prev.filter(id => id !== serviceId);

      const currentDuration = newSelectedServices.reduce((sum, sId) => sum + (availableServices.find(s => s.id === sId)?.duration || 0), 0);
      if (currentDuration > 240) {
          toast({ title: "Límite de Duración", description: "Has seleccionado demasiados servicios para una sola cita. Por favor, reduce la selección.", variant: "destructive" });
          return prev;
      }
      return newSelectedServices;
    });
  };

  const selectedServicesDetails = useMemo(() => {
    return availableServices.filter(s => selectedServices.includes(s.id));
  }, [selectedServices]);

  const totalServiceDuration = useMemo(() => {
    return selectedServicesDetails.reduce((sum, s) => sum + s.duration, 0);
  }, [selectedServicesDetails]);

  const effectiveDurationForSlotGeneration = useMemo(() => {
    if (totalServiceDuration === 0) return 0;
    const totalWithBuffer = totalServiceDuration + BOOKING_BUFFER_MINUTES;
    const remainder = totalWithBuffer % 30;
    if (remainder === 0) {
      return totalWithBuffer;
    }
    return totalWithBuffer + (30 - remainder);
  }, [totalServiceDuration]);

  const totalBookingPrice = useMemo(() => {
    return selectedServicesDetails.reduce((sum, s) => sum + s.price, 0);
  }, [selectedServicesDetails]);

  useEffect(() => {
    if (selectedDate && totalServiceDuration > 0 && !isBookingBlocked) {
      // TODO: Backend Integration: If time slots are fetched from backend:
      // async function fetchAndSetTimeSlots() {
      //   const response = await fetch(`/api/availability?date=${format(selectedDate, 'yyyy-MM-dd')}&duration=${effectiveDurationForSlotGeneration}`);
      //   const availableSlots = await response.json();
      //   setTimeSlots(availableSlots);
      // }
      // fetchAndSetTimeSlots();
      setTimeSlots(generateTimeSlots(selectedDate, effectiveDurationForSlotGeneration));
      setSelectedTime(undefined);
    } else {
      setTimeSlots([]);
    }
  }, [selectedDate, totalServiceDuration, isBookingBlocked, effectiveDurationForSlotGeneration]);

  const handleBooking = async (event: FormEvent) => {
    event.preventDefault();
    if (isBookingBlocked) {
        toast({ title: "Reserva Bloqueada", description: "Ya tienes una reserva reciente. Intenta de nuevo más tarde.", variant: "destructive" });
        return;
    }
    if (selectedServices.length === 0) {
      toast({ title: "Servicio Requerido", description: "Por favor, selecciona al menos un servicio.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    if (!selectedDate || !selectedTime) {
      toast({ title: "Información Incompleta", description: "Por favor, selecciona fecha y hora.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const bookingPayload: BookingPayload = {
      serviceIds: selectedServices,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      totalPrice: totalBookingPrice,
      totalDuration: totalServiceDuration,
      // userId: localStorage.getItem('userId') || undefined, // Example
    };

    // TODO: Backend Integration: Replace mock promise and localStorage with an API call to create the booking.
    // try {
    //   const response = await fetch('/api/bookings', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json', /* 'Authorization': `Bearer ${token}` */ },
    //     body: JSON.stringify(bookingPayload),
    //   });
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || 'Failed to create booking');
    //   }
    //   const newBooking = await response.json(); // Contains the confirmed booking details including its ID

    //   // Handle successful booking (toast, redirect, update loyalty points via another API call if needed)
    //   toast({ title: "¡Reserva Confirmada!", description: `Tu cita para ${serviceNamesString} ...` });
    //   // The backend should handle sending notifications (email to salon).
    //   // The backend should also handle updating loyalty points for the user.
    //   router.push('/dashboard');
    // } catch (error) {
    //   console.error("Booking failed:", error);
    //   toast({ title: "Error en la Reserva", description: (error as Error).message || "No se pudo completar la reserva.", variant: "destructive" });
    // } finally {
    //   setIsLoading(false);
    // }

    // Current localStorage implementation:
    await new Promise(resolve => setTimeout(resolve, 1500));

    const serviceNamesString = selectedServicesDetails.map(s => s.name).join(', ');
    const formattedDate = selectedDate ? format(selectedDate, 'PPP', { locale: es }) : '';

    toast({
      title: "¡Reserva Confirmada!",
      description: `Tu cita para ${serviceNamesString} el ${formattedDate} a las ${selectedTime} está confirmada.`,
    });

    const bookingsString = localStorage.getItem('nebulaBookings');
    let bookings: ExistingBooking[] = [];
    if (bookingsString) {
        try {
            bookings = JSON.parse(bookingsString);
        } catch (error) {
            console.error("Error parsing bookings from localStorage, resetting.", error);
            bookings = []; // Reset if corrupted
        }
    }
    // Add the new booking with its details
    bookings.push({
      service: serviceNamesString, // For display in dashboard, backend might store serviceIds
      date: format(selectedDate!, 'yyyy-MM-dd'),
      time: selectedTime,
      id: Date.now().toString() // Mock ID, backend will generate real ID
    });
    localStorage.setItem('nebulaBookings', JSON.stringify(bookings));

    // Simulate admin notification flag
    localStorage.setItem('newBookingForAdmin', 'true');
    // TODO: Backend Integration: The email notification to the salon should be triggered by the backend upon successful booking creation.

    // Simulate loyalty points update
    const userString = localStorage.getItem('nebulaUser');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user.email) {
          user.points = (user.points || 0) + 10;
          localStorage.setItem('nebulaUser', JSON.stringify(user));
          // TODO: Backend Integration: Loyalty points update should be an API call, e.g., POST /api/users/{userId}/loyalty/add
          // or handled by the backend automatically after a booking is completed.
        }
      } catch (error) {
        console.error("Error parsing user from localStorage for points update", error);
      }
    }

    setIsLoading(false);
    router.push('/dashboard');
  };

  if (!isMounted || !isLoggedIn) {
    return (
      <PageWrapper className="text-center">
        <Sparkles className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Cargando experiencia de reserva...</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CalendarCheck className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="font-headline text-4xl">Reserva Tu Cita</CardTitle>
          <CardDescription>Selecciona servicio(s), fecha y hora.</CardDescription>
        </CardHeader>
        <CardContent>
          {isBookingBlocked && canBookAgainDate && (
            <Card className="mb-6 bg-destructive/10 border-destructive text-destructive-foreground p-6 text-center">
              <CardTitle className="flex items-center justify-center font-headline text-2xl mb-3">
                <AlertTriangle className="h-7 w-7 mr-3" /> Límite de Reserva Alcanzado
              </CardTitle>
              <CardDescription className="text-destructive-foreground/90 mb-4">
                Has realizado una reserva recientemente. Podrás reservar una nueva cita a partir del{' '}
                <strong>{format(canBookAgainDate, 'PPP', { locale: es })}</strong>.
              </CardDescription>
              <p className="text-sm text-destructive-foreground/80 mb-4">
                Si necesitas una cita con urgencia, por favor contáctanos directamente.
              </p>
              <Button asChild variant="outline" className="border-destructive text-destructive-foreground hover:bg-destructive/20">
                <Link href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Nebula Nails, necesito una cita urgente.")}`} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="mr-2 h-5 w-5" /> Contactar por WhatsApp
                </Link>
              </Button>
            </Card>
          )}

          <form onSubmit={handleBooking} className={`grid md:grid-cols-2 gap-8 items-start ${isBookingBlocked ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="space-y-6">
              <div>
                <Label className="text-lg font-medium mb-2 block font-headline text-foreground">1. Selecciona Servicio(s)</Label>
                 <div className="space-y-3 rounded-md border p-4 bg-card shadow-sm">
                    {availableServices.map(service => (
                    <div key={service.id} className="flex items-center space-x-3">
                        <Checkbox
                        id={`service-${service.id}`}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={(checked) => {
                            handleServiceSelectionChange(service.id, !!checked);
                        }}
                        disabled={isBookingBlocked}
                        aria-label={`Seleccionar ${service.name}`}
                        />
                        <Label
                          htmlFor={`service-${service.id}`}
                          className={`font-normal text-sm leading-tight cursor-pointer hover:text-primary transition-colors ${selectedServices.includes(service.id) ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                        >
                        {service.name} <span className="text-xs">(${service.price} - {service.duration} min)</span>
                        </Label>
                    </div>
                    ))}
                </div>
                {selectedServices.length === 0 && !isBookingBlocked && (
                    <p className="text-xs text-destructive mt-2">Por favor, selecciona al menos un servicio.</p>
                )}
              </div>

              <div>
                <Label className="text-lg font-medium mb-2 block font-headline text-foreground">2. Selecciona Fecha</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  fromDate={new Date()}
                  className="rounded-md border p-0 w-full bg-card shadow-sm"
                  disabled={(date) => date.getDay() === 0 || isBookingBlocked}
                  locale={es}
                />
                 <p className="text-xs text-muted-foreground mt-1 text-center">Cerramos los domingos.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-lg font-medium mb-2 block font-headline text-foreground">3. Selecciona Hora</Label>
                {selectedDate && totalServiceDuration > 0 && !isBookingBlocked ? (
                  timeSlots.length > 0 ? (
                    <RadioGroup
                      value={selectedTime}
                      onValueChange={setSelectedTime}
                      className="grid grid-cols-3 gap-2"
                      disabled={isBookingBlocked}
                    >
                      {timeSlots.map(time => (
                        <div key={time} className="flex items-center">
                          <RadioGroupItem value={time} id={`time-${time}`} className="peer sr-only" disabled={isBookingBlocked}/>
                          <Label
                            htmlFor={`time-${time}`}
                            className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary w-full text-center ${isBookingBlocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                          >
                            <Clock className="mb-1 h-5 w-5" />
                            {time}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <p className="text-muted-foreground p-4 border rounded-md text-center bg-card shadow-sm">
                      No hay horarios disponibles para el {selectedDate ? format(selectedDate, 'PPP', { locale: es }) : 'día seleccionado'} con los servicios y duración seleccionados. Por favor, prueba otra fecha o ajusta los servicios.
                    </p>
                  )
                ) : (
                  <p className="text-muted-foreground p-4 border rounded-md text-center bg-card shadow-sm">
                    {isBookingBlocked ? 'Las reservas están temporalmente deshabilitadas.' : 'Por favor, selecciona primero servicio(s) y una fecha.'}
                  </p>
                )}
              </div>

              {selectedServices.length > 0 && selectedDate && selectedTime && !isBookingBlocked && (
                <Card className="bg-secondary/30 p-4">
                  <CardTitle className="text-lg font-headline mb-3 flex items-center"><Scissors className="h-5 w-5 mr-2 text-accent"/>Resumen de la Cita</CardTitle>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-semibold">Servicios:</span>
                      <ul className="list-disc list-inside ml-4">
                        {selectedServicesDetails.map(s => <li key={s.id}>{s.name}</li>)}
                      </ul>
                    </div>
                    <p><CalendarCheck className="inline mr-2 h-4 w-4 text-accent" />Fecha: {format(selectedDate, 'PPP', { locale: es })}</p>
                    <p><Clock className="inline mr-2 h-4 w-4 text-accent" />Hora: {selectedTime}</p>
                    <p><Sparkles className="inline mr-2 h-4 w-4 text-accent" />Duración Total Estimada: {totalServiceDuration} min</p>
                    <p className="font-semibold mt-2">Precio Total: ${totalBookingPrice}</p>
                  </div>
                </Card>
              )}

              <Button
                type="submit"
                className="w-full text-lg py-3"
                disabled={isLoading || !selectedTime || selectedServices.length === 0 || !selectedDate || isBookingBlocked || totalServiceDuration === 0}
              >
                {isLoading ? 'Reservando...' : 'Confirmar Reserva'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
