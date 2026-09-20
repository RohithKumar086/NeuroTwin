'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Sidebar />
      {/* Main area — offset by sidebar width. Sidebar width transitions, so we use ml-[68px] as minimum and CSS handles the rest */}
      <div className="flex flex-col flex-1 ml-[240px] min-w-0 transition-all duration-300"
        style={{ maxHeight: '100vh' }}
      >
        <TopBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
