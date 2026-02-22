'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import ChatInterface from '@/components/Chat/ChatInterface';

export default function Home() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleConversationCreated = (id: string) => {
    setActiveConversationId(id);
    setSidebarRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex h-[100dvh] w-full gap-4 p-0 md:p-4 bg-background relative z-10 overflow-hidden">
      <Sidebar
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
    </div>
  );
}
