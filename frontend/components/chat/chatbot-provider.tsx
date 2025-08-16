"use client";

import { useState, createContext, useContext, ReactNode } from 'react';
import PlantDiseaseChatbot from './plant-disease-chatbot';
import ChatTriggerButton from './chat-trigger-button';
import { ScanDetectionResult } from '@/lib/api-service';

// Chatbot context interface
interface ChatbotContextType {
  isOpen: boolean;
  scanResults: ScanDetectionResult | null;
  openChat: (scanResults?: ScanDetectionResult) => void;
  closeChat: () => void;
  setScanResults: (results: ScanDetectionResult | null) => void;
}

// Create context
const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

// Provider component
interface ChatbotProviderProps {
  children?: ReactNode;
}

const ChatbotProvider = ({ children }: ChatbotProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scanResults, setScanResults] = useState<ScanDetectionResult | null>(null);

  const openChat = (results?: ScanDetectionResult) => {
    if (results) {
      setScanResults(results);
    }
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const value: ChatbotContextType = {
    isOpen,
    scanResults,
    openChat,
    closeChat,
    setScanResults
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
      
      {/* Chatbot Components */}
      <ChatTriggerButton
        onToggle={() => isOpen ? closeChat() : openChat()}
        isOpen={isOpen}
        hasScanResults={!!scanResults}
      />
      
      <PlantDiseaseChatbot
        scanResults={scanResults}
        isOpen={isOpen}
        onToggle={() => isOpen ? closeChat() : openChat()}
      />
    </ChatbotContext.Provider>
  );
};

// Hook to use chatbot context
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export default ChatbotProvider; 