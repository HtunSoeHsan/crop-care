"use client";
import { usePathname } from 'next/navigation';
import ChatbotProvider from '@/components/chat/chatbot-provider';

export default function ConditionalChatbotProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <ChatbotProvider>
      {children}
    </ChatbotProvider>
  );
}