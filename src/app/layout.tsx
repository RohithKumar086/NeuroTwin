import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/layout/AppShell';
import { SystemStateProvider } from '@/hooks/useSystemState';

export const metadata: Metadata = {
  title: 'Neural Digital Twin — AI-Powered Industrial System Intelligence',
  description: 'Real-time neural representation of physical industrial systems. Predict, simulate, and optimize with graph neural networks.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <SystemStateProvider>
          <AppShell>
            {children}
          </AppShell>
        </SystemStateProvider>
      </body>
    </html>
  );
}
