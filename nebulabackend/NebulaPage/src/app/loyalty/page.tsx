
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Gift, Star, Sparkles, Trophy, LucideIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// TODO: Backend Integration: Reward definitions might come from a backend API (e.g., /api/loyalty/rewards)
// to allow dynamic management of rewards.
interface Reward {
  id: string;
  name: string;
  pointsRequired: number;
  description: string;
  icon: LucideIcon;
}

const availableRewards: Reward[] = [
  { id: 'discount-5', name: 'Descuento de $5 en el Próximo Servicio', pointsRequired: 50, description: 'Disfruta de un descuento de $5 en cualquier servicio de uñas.', icon: Sparkles },
  { id: 'free-polish', name: 'Mejora de Esmalte Gratis', pointsRequired: 75, description: 'Actualiza a un esmalte premium gratis.', icon: Gift },
  { id: 'hand-massage', name: 'Masaje de Manos de Cortesía', pointsRequired: 100, description: 'Añade un relajante masaje de manos de 10 minutos a tu servicio.', icon: Star },
  { id: 'discount-15', name: 'Descuento de $15 en el Próximo Servicio', pointsRequired: 200, description: 'Un generoso descuento de $15 en tu próxima visita.', icon: Trophy },
];

// TODO: Backend Integration: User interface should match the one from the backend.
interface User {
  id?: string;
  name: string;
  email: string;
  points: number;
}

export default function LoyaltyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);


  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem('nebulaAuthToken');
    // TODO: Backend Integration: Validate token.
    if (!token) {
      toast({ title: "Inicio de Sesión Requerido", description: "Por favor, inicia sesión para ver tu estado de fidelidad.", variant: "destructive" });
      router.push('/auth/login?redirect=/loyalty');
      setIsLoadingUser(false);
      return;
    }

    // TODO: Backend Integration: Fetch user data (including points) from an API (e.g., /api/users/me)
    // async function fetchUserLoyaltyData() {
    //   setIsLoadingUser(true);
    //   try {
    //     const response = await fetch('/api/users/me', { headers: { 'Authorization': `Bearer ${token}` } });
    //     if (!response.ok) throw new Error("Failed to fetch user data");
    //     const userData: User = await response.json();
    //     setUser(userData);
    //   } catch (error) {
    //     toast({ title: "Error", description: "No se pudieron cargar los datos de fidelidad.", variant: "destructive" });
    //     router.push('/dashboard'); // Or handle error appropriately
    //   } finally {
    //     setIsLoadingUser(false);
    //   }
    // }
    // fetchUserLoyaltyData();

    // Current localStorage implementation:
    const storedUser = localStorage.getItem('nebulaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
       toast({ title: "Error de Usuario", description: "No se pudieron cargar los datos del usuario.", variant: "destructive" });
       router.push('/auth/login?redirect=/loyalty');
    }
    setIsLoadingUser(false);

  }, [router, toast]);

  const handleRedeemReward = async (reward: Reward) => {
    if (user && user.points >= reward.pointsRequired) {
      // TODO: Backend Integration: Call an API to redeem the reward and update user points.
      // try {
      //   const response = await fetch(`/api/loyalty/redeem/${reward.id}`, {
      //     method: 'POST',
      //     headers: { 'Authorization': `Bearer ${localStorage.getItem('nebulaAuthToken')}` },
      //   });
      //   if (!response.ok) {
      //     const errorData = await response.json();
      //     throw new Error(errorData.message || 'Failed to redeem reward');
      //   }
      //   const updatedUserData: User = await response.json(); // Backend returns updated user data
      //   setUser(updatedUserData); // Update local user state
      //   localStorage.setItem('nebulaUser', JSON.stringify(updatedUserData)); // Update localStorage for consistency
      //   toast({ title: "¡Recompensa Canjeada!", description: `Has canjeado "${reward.name}".` });
      // } catch (error) {
      //   toast({ title: "Error al Canjear", description: (error as Error).message, variant: "destructive" });
      // }


      // Current localStorage implementation:
      const updatedUser = { ...user, points: user.points - reward.pointsRequired };
      setUser(updatedUser);
      localStorage.setItem('nebulaUser', JSON.stringify(updatedUser));
      toast({
        title: "¡Recompensa Canjeada!",
        description: `Has canjeado con éxito "${reward.name}". Se aplicará en tu próxima visita.`,
      });
    } else {
      toast({
        title: "Puntos Insuficientes",
        description: `Necesitas ${reward.pointsRequired - (user?.points || 0)} puntos más para esta recompensa.`,
        variant: "destructive",
      });
    }
  };

  if (!isMounted || isLoadingUser) {
     return (
      <PageWrapper className="text-center">
        <Sparkles className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Cargando programa de fidelidad...</p>
      </PageWrapper>
    );
  }

  if (!user) {
    // This should ideally be handled by the loading state or redirect
    return (
      <PageWrapper className="text-center">
        <p className="text-muted-foreground">Cargando datos de usuario o redirigiendo...</p>
      </PageWrapper>
    );
  }

  const nextRewardTier = availableRewards.find(r => r.pointsRequired > user.points) || availableRewards[availableRewards.length -1];
  const pointsToNextReward = nextRewardTier ? Math.max(0, nextRewardTier.pointsRequired - user.points) : 0;
  const progressToNextReward = nextRewardTier ? Math.min(100, (user.points / nextRewardTier.pointsRequired) * 100) : 100;


  return (
    <PageWrapper>
      <section className="text-center mb-12">
        <Star className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-5xl md:text-6xl text-primary mb-3">Programa de Fidelidad Nebula</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Gana puntos con cada visita y canjéalos por recompensas exclusivas. ¡Agradecemos tu fidelidad!
        </p>
      </section>

      <Card className="mb-12 shadow-xl bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center text-foreground">¡Bienvenido/a, {user.name}!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-5xl font-bold text-primary mb-2">{user.points}</p>
          <p className="text-muted-foreground mb-4">Puntos de Fidelidad</p>
          {nextRewardTier && user.points < nextRewardTier.pointsRequired && (
            <>
              <Progress value={progressToNextReward} className="w-full max-w-md mx-auto mb-2 h-3" />
              <p className="text-sm text-muted-foreground">
                ¡Estás a {pointsToNextReward} puntos de tu próxima recompensa: {nextRewardTier.name}!
              </p>
            </>
          )}
           {user.points >= nextRewardTier.pointsRequired && (
             <p className="text-sm text-accent font-semibold">¡Puedes canjear {nextRewardTier.name} o ahorrar para un nivel superior!</p>
           )}
        </CardContent>
         <CardFooter className="justify-center">
            <Button asChild>
                <Link href="/book">Reserva Tu Próxima Visita</Link>
            </Button>
         </CardFooter>
      </Card>

      <section>
        <h2 className="font-headline text-4xl text-center text-foreground mb-10">Recompensas Disponibles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableRewards.map((reward) => (
            <Card key={reward.id} className={`flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 ${user.points < reward.pointsRequired ? 'opacity-70 bg-muted/30' : 'bg-card'}`}>
              <CardHeader className="items-center text-center">
                 <reward.icon className={`h-12 w-12 mb-3 ${user.points >= reward.pointsRequired ? 'text-accent' : 'text-muted-foreground'}`} />
                <CardTitle className="font-headline text-2xl text-primary">{reward.name}</CardTitle>
                <CardDescription className="font-semibold">{reward.pointsRequired} Puntos</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow text-center">
                <p className="text-muted-foreground">{reward.description}</p>
              </CardContent>
              <CardFooter className="justify-center">
                <Button
                  onClick={() => handleRedeemReward(reward)}
                  disabled={user.points < reward.pointsRequired}
                  variant={user.points >= reward.pointsRequired ? 'default' : 'outline'}
                >
                  {user.points >= reward.pointsRequired ? 'Canjear Ahora' : 'Puntos Insuficientes'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
       <section className="mt-16 text-center bg-card p-8 rounded-xl shadow-lg">
        <h3 className="font-headline text-2xl text-foreground mb-3">Cómo Funciona</h3>
        {/* TODO: Backend Integration: Points per booking might be configurable in the backend.
            The "10 puntos por cada cita completada" should reflect what's defined in the backend rules.
        */}
        <ol className="list-decimal list-inside text-muted-foreground space-y-2 max-w-md mx-auto text-left">
          <li>Regístrate o inicia sesión en tu cuenta de Nebula Nails.</li>
          <li>Gana 10 puntos por cada cita completada.</li>
          <li>Visita esta página para seguir tus puntos y ver las recompensas disponibles.</li>
          <li>¡Canjea tus puntos por descuentos, servicios gratuitos y más!</li>
        </ol>
      </section>
    </PageWrapper>
  );
}
