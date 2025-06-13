
"use client";

import { useState, type FormEvent } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send, User, MessageSquare } from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // TODO: Backend Integration: Replace mock submission with an API call to a contact form endpoint.
    // const contactData = { name, email, subject, message };
    // try {
    //   const response = await fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(contactData),
    //   });
    //   if (!response.ok) {
    //     throw new Error('Failed to send message');
    //   }
    //   toast({ title: "¡Mensaje Enviado!", description: "Gracias por contactar. Nos pondremos en contacto pronto." });
    //   // Reset form
    //   setName(''); setEmail(''); setSubject(''); setMessage('');
    // } catch (error) {
    //   toast({ title: "Error", description: "No se pudo enviar tu mensaje. Inténtalo de nuevo.", variant: "destructive" });
    // } finally {
    //   setIsLoading(false);
    // }

    // Current mock implementation:
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Contact form submitted (simulated):", { name, email, subject, message });
    toast({
      title: "¡Mensaje Enviado!",
      description: "Gracias por contactar con Nebula Nails. Nos pondremos en contacto contigo pronto.",
    });

    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setIsLoading(false);
  };

  return (
    <PageWrapper>
      <section className="text-center mb-16">
        <Mail className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-5xl md:text-6xl text-primary mb-3">Ponte en Contacto</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          ¡Nos encantaría saber de ti! Si tienes alguna pregunta, comentario o necesitas ayuda, no dudes en contactarnos.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center">
              <Send className="h-8 w-8 mr-3 text-accent" /> Envíanos un Mensaje
            </CardTitle>
            <CardDescription>Completa el formulario a continuación y te responderemos lo antes posible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="name" placeholder="Tu Nombre" value={name} onChange={(e) => setName(e.target.value)} required className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Dirección de Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Asunto</Label>
                 <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="subject" placeholder="Motivo del contacto" value={subject} onChange={(e) => setSubject(e.target.value)} required className="pl-10" />
                  </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Tu Mensaje</Label>
                <Textarea
                  id="message"
                  placeholder="Escribe tu mensaje aquí..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="resize-none"
                />
              </div>
              <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar Mensaje'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information & Map */}
        {/* TODO: Backend Integration: Salon's contact info (address, phone, email, hours) could be fetched from a
            backend endpoint (e.g., /api/salon/info) to allow dynamic updates from an admin panel.
        */}
        <div className="space-y-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl flex items-center">
                <MapPin className="h-8 w-8 mr-3 text-accent" /> Nuestro Salón
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-foreground">Dirección</h3>
                <p className="text-muted-foreground">123 Sparkle Avenue, Glamour City, ST 54321</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">Teléfono</h3>
                <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors">(123) 456-7890</a>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">Correo Electrónico</h3>
                <a href="mailto:contact@nebulanails.com" className="text-muted-foreground hover:text-primary transition-colors">contact@nebulanails.com</a>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">Horario de Apertura</h3>
                <ul className="text-muted-foreground list-disc list-inside ml-1">
                  <li>Lunes - Viernes: 9:00 AM - 6:00 PM</li>
                  <li>Sábado: 10:00 AM - 4:00 PM</li>
                  <li>Domingo: Cerrado</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          <div className="rounded-xl overflow-hidden shadow-xl aspect-video">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Ubicación de Nebula Nails"
              width={600}
              height={400}
              className="w-full h-full object-cover"
              data-ai-hint="map salon location"
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
