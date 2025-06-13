import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageWrapper from '@/components/layout/PageWrapper';
import { Sparkles, CalendarDays, Gift, Phone } from 'lucide-react';

const services = [
  {
    name: 'Manicura Clásica',
    description: 'Moldeado perfecto, cuidado de cutículas y el esmalte de tu elección.',
    icon: Sparkles,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'manicure nails'
  },
  {
    name: 'Pedicura de Lujo',
    description: 'Baño relajante, exfoliación, masaje y uñas de los pies hermosas.',
    icon: Gift,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'pedicure spa'
  },
  {
    name: 'Extensiones de Gel',
    description: 'Extensiones de uñas duraderas e impresionantes con esmalte de gel.',
    icon: CalendarDays, // Placeholder, ideally a nail polish or extension icon
    image: 'https://placehold.co/600x400.png',
    imageHint: 'nail extensions'
  },
];

export default function HomePage() {
  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/30 via-background to-accent/30 py-20 md:py-32 text-center shadow-lg mb-16">
        <div className="absolute inset-0 opacity-20">
           {/* Optional: Add a subtle background pattern or image here */}
        </div>
        <div className="relative container mx-auto px-4">
          <Sparkles className="mx-auto h-16 w-16 text-primary mb-6 animate-pulse" />
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-foreground mb-6">
            Bienvenido/a a <span className="text-primary">Nebula Nails</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Experimenta el arte del cuidado de uñas en un ambiente sereno y lujoso. Tu viaje hacia unas uñas hermosas comienza aquí.
          </p>
          <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/book">
              <CalendarDays className="mr-2 h-5 w-5" />
              Reserva Tu Cita
            </Link>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="mb-16">
        <h2 className="font-headline text-4xl text-center text-foreground mb-12">Nuestros Servicios Estrella</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.name} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col">
              <div className="relative h-56 w-full">
                <Image 
                  src={service.image} 
                  alt={service.name} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint={service.imageHint}
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <service.icon className="h-8 w-8 text-accent" />
                  <CardTitle className="font-headline text-2xl text-primary">{service.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
              </CardContent>
              <div className="p-6 pt-0">
                 <Button variant="outline" className="w-full" asChild>
                    <Link href="/services">Saber Más</Link>
                 </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-card p-8 md:p-12 rounded-xl shadow-lg text-center">
        <Phone className="mx-auto h-12 w-12 text-accent mb-4" />
        <h2 className="font-headline text-3xl md:text-4xl text-foreground mb-4">¿Listo/a para tu Experiencia Nebula?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Contáctanos para cualquier consulta o solicitud especial. Estamos aquí para hacer tu visita inolvidable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/book">
              <CalendarDays className="mr-2 h-5 w-5" /> Reservar Online
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/contact">
              <Phone className="mr-2 h-5 w-5" /> Contáctanos
            </Link>
          </Button>
        </div>
      </section>
    </PageWrapper>
  );
}
