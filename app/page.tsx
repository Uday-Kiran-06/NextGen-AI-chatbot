'use client';

import React, { useState, useEffect } from 'react';
import PremiumSidebar from '@/components/Sidebar/PremiumSidebar';
import ChatInterface from '@/components/Chat/ChatInterface';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

export default function Home() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
      });
    }
    // Prevent bounce scroll on iOS
    document.body.style.overscrollBehavior = 'none';
  }, []);

  const handleConversationCreated = (id: string) => {
    setActiveConversationId(id);
    setSidebarRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex h-[100dvh] w-full bg-background relative overflow-hidden">
      <PremiumSidebar
        activeId={activeConversationId}
        onSelectChat={setActiveConversationId}
        onNewChat={() => setActiveConversationId(null)}
        refreshKey={sidebarRefreshKey}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <ChatInterface
        conversationId={activeConversationId}
        onConversationCreated={handleConversationCreated}
        onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        onNewChat={() => setActiveConversationId(null)}
      />
      <PWAInstallPrompt />
    </div>
  );
}
