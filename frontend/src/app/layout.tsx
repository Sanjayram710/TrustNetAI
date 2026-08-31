import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'TrustNet AI — Multimodal Content Authenticity & Trust Scoring',
  description:
    'Advanced multimodal AI platform estimating media authenticity, manipulation risk, source reliability, and claim support into an explainable 0–100 Trust Score.',
  keywords: ['AI authenticity', 'deepfake detection', 'content trust score', 'multimodal verification', 'image forensics'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070b14] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200 bg-grid-pattern">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
