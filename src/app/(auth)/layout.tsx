
import Link from 'next/link';
import { Logo } from '@/components/icons';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
          <Logo className="h-8 w-8" />
          <span className="text-xl font-bold text-primary">LinkHub</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 bg-primary/5">
        {children}
      </main>
      <footer className="flex flex-col sm:flex-row justify-center items-center text-center py-6 w-full shrink-0 px-4 md:px-6 border-t gap-2">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} 9ja Pitch Connect.</p>
        <p className="text-xs text-muted-foreground">Powered by Link Hub</p>
      </footer>
    </div>
  )
}
