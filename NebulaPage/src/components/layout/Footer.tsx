import { Sparkles, Instagram, Facebook, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2 text-xl font-headline text-primary mb-2">
              <Sparkles className="h-6 w-6 text-accent" />
              Nebula Nails
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Elegancia al alcance de tu mano.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-md font-semibold font-headline text-foreground mb-2">Enlaces Rápidos</h3>
            <ul className="space-y-1 text-sm text-center">
              <li><Link href="/book" className="text-muted-foreground hover:text-primary transition-colors">Reservar Cita</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">Nuestros Servicios</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contáctanos</Link></li>
              <li><Link href="/loyalty" className="text-muted-foreground hover:text-primary transition-colors">Programa de Fidelidad</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-md font-semibold font-headline text-foreground mb-2">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/nebula.estudiodebelleza/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://www.facebook.com/nebula.st.537294" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="mailto:contact@nebulanails.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-6 w-6" />
                <span className="sr-only">Correo Electrónico</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Nebula Nails. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
