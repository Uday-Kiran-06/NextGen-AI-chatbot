'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import ChatInterface from '@/components/Chat/ChatInterface';

export default function Home() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  // Global Zen Mode Shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault();
        setIsZenMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleConversationCreated = (id: string) => {
    setActiveConversationId(id);
    setSidebarRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex h-[100dvh] w-full bg-background relative z-10 overflow-hidden">
      <Sidebar
        activeId={activeConversationId}
        onSelectChat={setActiveConversationId}
        onNewChat={() => setActiveConversationId(null)}
        refreshKey={sidebarRefreshKey}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isZenMode={isZenMode}
      />
      <ChatInterface
        conversationId={activeConversationId}
        onConversationCreated={handleConversationCreated}
        onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        onNewChat={() => setActiveConversationId(null)}
        isZenMode={isZenMode}
        onToggleZen={() => setIsZenMode(prev => !prev)}
      />
    </div>
  );
}
