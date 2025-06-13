
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageWrapper from '@/components/layout/PageWrapper';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, Lock, Phone, User } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Error de Registro",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // TODO: Backend Integration: Replace localStorage with an API call to a registration endpoint.
    // const registrationData = { name, email, phone, password };
    // try {
    //   const response = await fetch('/api/auth/register', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(registrationData),
    //   });
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || 'Registration failed');
    //   }
    //   // const newUser = await response.json(); // Backend might return the created user or just a success message
    //
    //   toast({ title: "¡Registro Exitoso!", description: "Tu cuenta ha sido creada. Por favor, inicia sesión." });
    //   router.push('/auth/login');
    //
    // } catch (error) {
    //   toast({ title: "Error de Registro", description: (error as Error).message, variant: "destructive" });
    // } finally {
    //   setIsLoading(false);
    // }

    // Current mock/localStorage implementation:
    await new Promise(resolve => setTimeout(resolve, 1000));

    localStorage.setItem('registeredUserEmail', email);
    localStorage.setItem('registeredUserPassword', password);
    const mockUserData = { name, email, phone, points: 0, role: 'user' }; // Added role for example
    localStorage.setItem('nebulaUser', JSON.stringify(mockUserData));


    console.log("Usuario registrado (simulado):", { name, email, phone });
    toast({
      title: "¡Registro Exitoso!",
      description: "Tu cuenta de Nebula Nails ha sido creada. Por favor, inicia sesión.",
    });
    router.push('/auth/login');

    setIsLoading(false);
  };

  return (
    <PageWrapper className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="font-headline text-3xl">Crea Tu Cuenta</CardTitle>
          <CardDescription>Únete a Nebula Nails y comienza a reservar tus citas.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Label htmlFor="phone">Número de Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="phone" type="tel" placeholder="(123) 456-7890" value={phone} onChange={(e) => setPhone(e.target.value)} required className="pl-10" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                 <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                 <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="pl-10" />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creando Cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </CardFooter>
      </Card>
    </PageWrapper>
  );
}
