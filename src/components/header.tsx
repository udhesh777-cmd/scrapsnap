import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Recycle } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <Recycle className="h-8 w-8 text-primary group-hover:animate-spin" style={{ animationDuration: '3s' }}/>
            <span className="text-2xl font-headline font-bold text-foreground">
              ScrapSnap
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
