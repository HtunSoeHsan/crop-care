"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Leaf, 
  Beaker, 
  Shield, 
  Lightbulb,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  Brain,
  Database,
  AlertCircle
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { ScanDetectionResult, ChatMessage, ChatRequest, ApiService } from '@/lib/api-service';

interface PlantDiseaseChatbotProps {
  scanResults?: ScanDetectionResult | null;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const PlantDiseaseChatbot = ({ 
  scanResults, 
  isOpen, 
  onToggle, 
  className = "" 
}: PlantDiseaseChatbotProps) => {
  const t = useTranslations('chatbot');
  const locale = useLocale();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your Plant Disease AI Specialist powered by local LLM. I can help you with disease prevention, treatment recommendations, and plant care advice. What would you like to know?',
      timestamp: new Date(),
      suggestions: [
        'How to prevent plant diseases?',
        'What are common plant symptoms?',
        'Best practices for plant care',
        'Treatment options for diseases'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [llmStatus, setLlmStatus] = useState<'ready' | 'loading' | 'error'>('loading');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check LLM service health on component mount
  useEffect(() => {
    checkLlmHealth();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with scan results if available
  useEffect(() => {
    if (scanResults && messages.length === 1) {
      // Clear existing messages and start fresh with scan results
      const initialMessage: ChatMessage = {
        id: '1',
        type: 'bot',
        content: `Hello! I'm your Plant Disease AI Specialist. I can see you've scanned a plant with **${scanResults.name.en}**. I'm now ready to provide specific advice about this condition, prevention strategies, and treatment options. What would you like to know?`,
        timestamp: new Date(),
        suggestions: [
          `Tell me about ${scanResults.name.en}`,
          'How to treat this condition?',
          'Prevention strategies',
          'Care recommendations'
        ]
      };
      setMessages([initialMessage]);
    }
  }, [scanResults]);

  // Check LLM service health
  const checkLlmHealth = async () => {
    try {
      setLlmStatus('loading');
      const health = await ApiService.getChatbotHealth();
      
      if (health.status === 'healthy') {
        setLlmStatus('ready');
      } else {
        setLlmStatus('error');
      }
    } catch (error) {
      console.error('LLM health check failed:', error);
      setLlmStatus('error');
    }
  };

  // Show loading state when scan results are being processed
  const isInitializing = scanResults && messages.length === 1;

  const generateAIResponse = async (userMessage: string): Promise<ChatMessage> => {
    try {
      // Prepare context for the LLM
      const context: ChatRequest['context'] = {};
      
      if (scanResults) {
        context.scanResults = scanResults;
        context.plantType = scanResults.plantType.en;
      }

      // Send message to LLM service
      const response = await ApiService.sendChatMessage({
        message: userMessage,
        context
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to get response from AI');
      }

      // Create bot message from LLM response
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.data.answer,
        timestamp: new Date(),
        suggestions: response.data.suggestions,
        relatedInfo: response.data.relatedInfo
      };

      return botMessage;

    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback response if LLM fails
      return {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `I apologize, but I'm having trouble connecting to my AI service right now. Please try again in a moment, or you can check our disease database for information about plant diseases and treatments.`,
        timestamp: new Date(),
        suggestions: [
          'Try again',
          'Check disease database',
          'Contact support',
          'Browse plant care guides'
        ]
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(userMessage.content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusIcon = () => {
    switch (llmStatus) {
      case 'ready':
        return <Brain className="h-4 w-4 text-green-500" />;
      case 'loading':
        return <Database className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Brain className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (llmStatus) {
      case 'ready':
        return 'AI Ready';
      case 'loading':
        return 'AI Loading...';
      case 'error':
        return 'AI Offline';
      default:
        return 'AI Unknown';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Card className={`w-96 shadow-2xl border-0 bg-white/95 backdrop-blur-sm transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[600px]'
      }`}>
        {/* Header */}
        <CardHeader className={`pb-3 ${isMinimized ? 'cursor-pointer' : ''}`} onClick={() => isMinimized && setIsMinimized(false)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Plant AI Assistant</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {getStatusIcon()}
                  <span>{getStatusText()}</span>
                  {llmStatus === 'ready' && (
                    <Badge variant="secondary" className="text-xs">
                      <Brain className="h-3 w-3 mr-1" />
                      Local LLM
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="flex-1 p-4 pb-2">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.type === 'bot' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">
                              {message.content}
                        </div>
                        
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <div className="text-xs text-muted-foreground font-medium">
                              Suggested questions:
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                  className="text-xs h-auto py-1 px-2"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                          </div>
                        )}
                      </div>

                      {message.type === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            {/* Input */}
            <CardContent className="p-4 pt-2">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about plant diseases, treatments, or care..."
                  className="flex-1"
                  disabled={isLoading || llmStatus === 'error'}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || llmStatus === 'error'}
                  size="sm"
                  className="px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {llmStatus === 'error' && (
                <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  AI service is currently unavailable. Please try again later.
            </div>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default PlantDiseaseChatbot; 