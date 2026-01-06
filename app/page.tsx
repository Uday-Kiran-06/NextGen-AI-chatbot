import Sidebar from '@/components/Sidebar/Sidebar';
import ChatInterface from '@/components/Chat/ChatInterface';

export default function Home() {
  return (
    <main className="flex h-screen w-full gap-4 p-2 md:p-4 relative">
      <Sidebar />
      <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden relative">
        <ChatInterface />
      </div>
    </main>
  );
}
