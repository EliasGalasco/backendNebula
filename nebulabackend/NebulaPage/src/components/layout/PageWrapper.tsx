import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn("container mx-auto px-4 py-8 md:py-12 animate-fade-in-up", className)}>
      {children}
    </div>
  );
}
