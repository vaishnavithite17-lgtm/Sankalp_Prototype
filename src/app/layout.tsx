import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SANKALP — Climate-Resilient & Sustainable Urban Issue Platform',
  description:
    'Direct citizen-to-authority civic issue reporting, AI Urban Impact Engine prioritization, and duplicate issue clustering.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-100">
      <body className={`${inter.className} min-h-full flex flex-col text-slate-900 bg-slate-100 antialiased`}>
        <Navbar />
        <main className="flex-1">{children}</main>

        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-xs text-center">
          <div className="max-w-7xl mx-auto px-4 space-y-1">
            <div className="font-bold text-slate-200">
              SANKALP — Smart City Civic Action & Resolution Ecosystem
            </div>
            <div>
              Built for Sustainable Cities Hackathon • Powered by Next.js, Prisma, and AI Urban Impact Engine
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
