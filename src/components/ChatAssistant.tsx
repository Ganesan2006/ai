import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { api } from '../utils/api';
import { Alert, AlertDescription } from './ui/alert';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
}

export function ChatAssistant({ isOpen, onClose, accessToken }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiresSetup, setRequiresSetup] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat history
    const loadHistory = async () => {
      try {
        const { history } = await api.getChatHistory(accessToken);
        setMessages(history || []);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };
    
    if (isOpen && accessToken) {
      loadHistory();
    }
  }, [isOpen, accessToken]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const { response, requiresSetup: needsSetup } = await api.chat(
        userMessage.content,
        conversationHistory,
        accessToken
      );

      if (needsSetup) {
        setRequiresSetup(true);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <CardTitle>AI Learning Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {requiresSetup && (
            <div className="p-4 border-b">
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  To enable AI-powered responses, please add your OpenAI API key in the project settings.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <ScrollArea className="h-96 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <Bot className="w-12 h-12 mb-4 text-gray-400" />
                <p>Hi! I'm your AI learning mentor.</p>
                <p className="text-sm mt-2">Ask me anything about your learning path!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={`flex-1 rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white ml-12'
                          : 'bg-gray-100 text-gray-900 mr-12'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-700" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <Button onClick={handleSend} disabled={loading || !inputValue.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
