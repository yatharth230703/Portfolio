import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bot, User, Send, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      message: "Hi! I'm your portfolio assistant. I have context from John's LinkedIn and resume. Ask me anything about his experience, skills, or projects!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: (data, variables) => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          message: data.response,
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  });

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = {
        id: Date.now().toString(),
        message: input.trim(),
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      chatMutation.mutate(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-80 bg-sidebar border-l border-ide flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-3 border-b border-ide flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-primary-ide font-medium">Portfolio Assistant</div>
            <div className="text-secondary-ide text-xs">Ask me about my experience</div>
          </div>
          <div className="ml-auto">
            <Circle className="w-2 h-2 fill-current success-green" />
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.isUser ? 'justify-end' : ''}`}>
              {!msg.isUser && (
                <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div className={`p-3 rounded-lg max-w-xs ${
                msg.isUser 
                  ? 'bg-accent-blue text-white' 
                  : 'bg-editor border border-ide text-primary-ide'
              }`}>
                <p className="text-sm">{msg.message}</p>
              </div>
              {msg.isUser && (
                <div className="w-8 h-8 bg-secondary-ide rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-editor border border-ide p-3 rounded-lg max-w-xs">
                <p className="text-sm text-primary-ide">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Chat Input */}
      <div className="p-4 border-t border-ide flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about experience, skills, projects..."
            className="flex-1 bg-editor border-ide text-primary-ide text-sm"
            disabled={chatMutation.isPending}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || chatMutation.isPending}
            size="sm"
            className="bg-accent-blue hover:bg-blue-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-secondary-ide text-xs mt-2">
          Powered by AI with LinkedIn & resume context
        </div>
      </div>
    </div>
  );
}
