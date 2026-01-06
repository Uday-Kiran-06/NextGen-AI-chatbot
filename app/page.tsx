'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import ChatInterface from '@/components/Chat/ChatInterface';
import { AuroraBackground } from '@/components/UI/AuroraBackground';

export default function Home() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);

  const handleConversationCreated = (id: string) => {
    setActiveConversationId(id);
    setSidebarRefreshKey(prev => prev + 1);
  };

  return (
    <AuroraBackground>
      <div className="flex h-screen w-full gap-4 p-2 md:p-4 relative z-10 overflow-hidden">
        <Sidebar
          activeId={activeConversationId}
          onSelectChat={setActiveConversationId}
          onNewChat={() => setActiveConversationId(null)}
          refreshKey={sidebarRefreshKey}
        />
        <ChatInterface
          conversationId={activeConversationId}
          onConversationCreated={handleConversationCreated}
        />
      </div>
    </AuroraBackground>
  );
}
