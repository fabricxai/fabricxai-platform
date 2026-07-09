import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FabricXAI – Garments Intelligent Platform',
  description: 'AI-powered platform for garments manufacturing — orders, production, quality, finance, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0D1117] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
