import Image from 'next/image';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, Sparkles, Gem, Leaf } from 'lucide-react';

const nailServices = [
  {
    title: 'Manicura Clásica',
    description: 'Incluye moldeado de uñas, cuidado de cutículas, un masaje de manos relajante y tu elección de esmalte regular.',
    price: '$35',
    duration: '45 mins',
    icon: Sparkles,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'classic manicure',
    features: ['Moldeado de Uñas', 'Cuidado de Cutículas', 'Masaje de Manos', 'Esmalte Regular']
  },
  {
    title: 'Manicura de Gel',
    description: 'Una manicura de larga duración con esmalte de gel que se mantiene sin astillas durante semanas. Incluye todos los pasos de la manicura clásica.',
    price: '$50',
    duration: '60 mins',
    icon: Gem,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'gel manicure',
    features: ['Pasos de Manicura Clásica', 'Aplicación de Esmalte de Gel', 'Larga Duración']
  },
  {
    title: 'Pedicura de Lujo',
    description: 'Disfruta de una pedicura de spa con baño aromático, exfoliación, eliminación de callos, mascarilla hidratante, masaje prolongado y esmalte.',
    price: '$65',
    duration: '75 mins',
    icon: Leaf,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'luxury pedicure',
    features: ['Baño Aromático', 'Exfoliación', 'Eliminación de Callos', 'Mascarilla Hidratante', 'Masaje Prolongado']
  },
  {
    title: 'Extensiones de Uñas (Set Completo)',
    description: 'Añade longitud y glamour con nuestras extensiones de uñas aplicadas por expertos. Elige entre acrílico o gel.',
    price: '$70+',
    duration: '90-120 mins',
    icon: Sparkles,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'nail extensions art',
    features: ['Longitud y Forma Personalizadas', 'Opciones de Acrílico o Gel', 'Aplicación Profesional']
  },
  {
    title: 'Decoración de Uñas (Complemento)',
    description: 'Expresa tu estilo con decoración de uñas personalizada. Desde diseños simples hasta obras maestras intrincadas.',
    price: '$5+ por uña',
    duration: '15-45 mins (complemento)',
    icon: Gem,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'nail art design',
    features: ['Diseños Personalizados', 'Purpurina y Gemas', 'Arte Pintado a Mano']
  },
  {
    title: 'Tratamiento de Cera de Parafina',
    description: 'Hidrata profundamente y suaviza tus manos o pies con un tratamiento de cera de parafina tibia.',
    price: '$20 (complemento)',
    duration: '20 mins (complemento)',
    icon: Leaf,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'paraffin treatment',
    features: ['Hidratación Profunda', 'Calma la Piel', 'Mejora la Circulación']
  }
];

export default function ServicesPage() {
  return (
    <PageWrapper>
      <section className="text-center mb-16">
        <h1 className="font-headline text-5xl md:text-6xl text-primary mb-4">Nuestros Servicios Exquisitos</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Descubre una gama de tratamientos de uñas diseñados para mimar, embellecer y rejuvenecer. Cada servicio se realiza con cuidado meticuloso y productos de alta calidad.
        </p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {nailServices.map((service) => (
          <Card key={service.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-64 w-full">
              <Image
                src={service.image}
                alt={service.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={service.imageHint}
              />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="font-headline text-2xl text-primary flex items-center">
                  <service.icon className="h-7 w-7 mr-3 text-accent" />
                  {service.title}
                </CardTitle>
                <span className="text-xl font-semibold text-foreground">{service.price}</span>
              </div>
              <CardDescription className="text-sm text-muted-foreground">{service.duration}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-foreground mb-4">{service.description}</p>
              <ul className="space-y-1">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild className="w-full">
                <Link href="/book">Reservar Este Servicio</Link>
              </Button>
            </div>
          </Card>
        ))}
      </section>

      <section className="mt-20 text-center bg-card p-8 md:p-12 rounded-xl shadow-lg">
        <h2 className="font-headline text-3xl md:text-4xl text-primary mb-4">¿Listo/a para Ser Mimado/a?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Nuestros técnicos de uñas expertos están listos para brindarte una experiencia excepcional. Reserva tu cita hoy y déjanos encargarnos del resto.
        </p>
        <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
          <Link href="/book">Reserva Tu Cita Ahora</Link>
        </Button>
      </section>
    </PageWrapper>
  );
}
