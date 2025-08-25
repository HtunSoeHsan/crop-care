"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Bot, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatTriggerButtonProps {
  onToggle: () => void;
  isOpen: boolean;
  hasScanResults?: boolean;
  className?: string;
}

const ChatTriggerButton = ({ 
  onToggle, 
  isOpen, 
  hasScanResults = false,
  className = "" 
}: ChatTriggerButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  if (isOpen) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      <div className="relative">
        {/* Status Badge */}
        {/* <Badge className={`absolute -top-2 -right-2 text-white text-xs px-2 py-1 ${
          hasScanResults 
            ? 'bg-green-500 animate-pulse' 
            : 'bg-blue-500'
        }`}>
          {hasScanResults ? (
            <>
              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
              AI Ready
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-white rounded-full mr-1" />
              Ask AI
            </>
          )}
        </Badge> */}
        
        {/* Main Chat Button */}
        <Button
          onClick={onToggle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`h-16 w-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
            hasScanResults
              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-green-500/25'
              : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:shadow-primary/25'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <Bot className="h-6 w-6 text-white" />
            <span className="text-xs text-white font-medium">
              {hasScanResults ? 'AI Ready' : 'Chat'}
            </span>
          </div>
        </Button>
        
        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>
                {hasScanResults 
                  ? 'Ask Plant Disease AI (Results Available)' 
                  : 'Ask Plant Disease AI'
                }
              </span>
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatTriggerButton; 