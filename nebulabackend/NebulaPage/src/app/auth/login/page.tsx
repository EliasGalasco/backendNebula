
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageWrapper from '@/components/layout/PageWrapper';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // TODO: Backend Integration: Replace localStorage checks with an API call to an authentication endpoint.
    // try {
    //   const response = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password }),
    //   });
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || 'Login failed');
    //   }
    //   const { token, user } = await response.json(); // Assuming backend returns token and user data
    //
    //   localStorage.setItem('nebulaAuthToken', token);
    //   localStorage.setItem('nebulaUser', JSON.stringify(user)); // Store user details from backend
    //   // localStorage.setItem('userId', user.id); // If backend provides user ID
    //
    //   toast({ title: "Inicio de Sesión Exitoso", description: `¡Bienvenido/a de nuevo, ${user.name}!` });
    //   const redirectPath = searchParams.get('redirect') || (user.role === 'admin' ? '/admin' : '/dashboard'); // Example role-based redirect
    //   router.push(redirectPath);
    //
    // } catch (error) {
    //   toast({ title: "Fallo en el Inicio de Sesión", description: (error as Error).message, variant: "destructive" });
    // } finally {
    //   setIsLoading(false);
    // }

    // Current mock/localStorage implementation:
    await new Promise(resolve => setTimeout(resolve, 1000));

    const registeredEmail = localStorage.getItem('registeredUserEmail');
    const registeredPassword = localStorage.getItem('registeredUserPassword');
    const storedUser = localStorage.getItem('nebulaUser');

    let loginSuccess = false;
    let redirectPath = searchParams.get('redirect') || '/dashboard';
    let userNameForGreeting = 'Usuario';

    if (registeredEmail && registeredPassword && email === registeredEmail && password === registeredPassword) {
      loginSuccess = true;
      localStorage.setItem('nebulaAuthToken', 'mock-token-registered-user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          userNameForGreeting = userData.name || userNameForGreeting;
          localStorage.setItem('nebulaUser', storedUser);
        } catch (e) {
          localStorage.setItem('nebulaUser', JSON.stringify({ name: 'Usuario Registrado', email: email, points: 0, phone: '' }));
          userNameForGreeting = 'Usuario Registrado';
        }
      } else {
         localStorage.setItem('nebulaUser', JSON.stringify({ name: 'Usuario Registrado', email: email, points: 0, phone: '' }));
         userNameForGreeting = 'Usuario Registrado';
      }
    }
    else if (email === 'admin@example.com' && password === 'adminpass') {
      loginSuccess = true;
      localStorage.setItem('nebulaAuthToken', 'mock-admin-token');
      const adminUser = { name: 'Admin Nebula', email: 'admin@example.com', points: 0, phone: '', role: 'admin' }; // Added role for example
      localStorage.setItem('nebulaUser', JSON.stringify(adminUser));
      userNameForGreeting = adminUser.name;
      if (redirectPath === '/dashboard') redirectPath = '/admin';
    }
    else if (email === 'user@example.com' && password === 'password') {
      loginSuccess = true;
      localStorage.setItem('nebulaAuthToken', 'mock-token-user');
      const testUser = { name: 'Usuario de Prueba', email: 'user@example.com', points: 150, phone: '', role: 'user' };
      localStorage.setItem('nebulaUser', JSON.stringify(testUser));
      userNameForGreeting = testUser.name;
    }


    if (loginSuccess) {
      toast({
        title: "Inicio de Sesión Exitoso",
        description: `¡Bienvenido/a de nuevo, ${userNameForGreeting}!`,
      });
      router.push(redirectPath);
    } else {
      toast({
        title: "Fallo en el Inicio de Sesión",
        description: "Credenciales incorrectas o la cuenta no existe. Verifica tus datos o regístrate si eres nuevo/a.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <PageWrapper className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="font-headline text-3xl">¡Bienvenido/a de Nuevo!</CardTitle>
          <CardDescription>Inicia sesión para acceder a tu cuenta de Nebula Nails.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Dirección de Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
               <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>
           <p className="text-xs text-muted-foreground mt-2">
            Prueba con: user@example.com / password <br/> O admin: admin@example.com / adminpass
          </p>
        </CardFooter>
      </Card>
    </PageWrapper>
  );
}
