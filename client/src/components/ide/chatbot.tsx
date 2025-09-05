import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bot, User, Send, Circle, Loader2, X } from "lucide-react";
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

interface LinkedInContext {
  profile: {
    name: string;
    summary: string;
    contact: {
      email: string;
      github: string;
    };
    skills: string[];
    experience: Array<{
      title: string;
      company: string;
      period: string;
      location: string;
    }>;
    education: Array<{
      degree: string;
      field_of_study: string;
      school: string;
      period: string;
    }>;
    certifications: Array<{
      name: string;
      authority: string;
      issued: string;
    }>;
  };
  key_activities: Array<{
    type: string;
    date: string;
    content: string;
    note?: string;
  }>;
}

interface ResumeContext {
  personal_info: {
    name: string;
    student_id: string;
    phone: string;
    email: string;
    linkedin: string;
    github: string;
  };
  education: Array<{
    course: string;
    year: string;
    institute: string;
    grade: string;
  }>;
  experience: Array<{
    role: string;
    organization: string;
    location: string;
    duration: string;
    responsibilities: string[];
  }>;
  technical_proficiency: {
    coursework: string[];
    programming: string[];
    machine_learning: string[];
    libraries_utilities: string[];
    webscraping_automation: string[];
    tools: string[];
    databases: string[];
    generative_ai: string[];
  };
  projects: Array<{
    name: string;
    type: string;
    technologies: string[];
    description: string;
  }>;
  positions_of_responsibility: string[];
  leadership_teamwork: {
    leadership: string;
    teamwork: string;
  };
  certifications_achievements: string[];
}

interface ChatBotProps {
  onClose?: () => void;
}

export function ChatBot({ onClose }: ChatBotProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      message: "Hi! I'm your portfolio assistant. I have context from Yatharth's LinkedIn and resume. Ask me anything about his experience, skills, or projects!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [contextData, setContextData] = useState<{
    linkedin: LinkedInContext;
    resume: ResumeContext;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Load context data when component mounts
  useEffect(() => {
    const loadContextData = async () => {
      try {
        const [linkedinResponse, resumeResponse] = await Promise.all([
          fetch('/ai_context_linkedin.json'),
          fetch('/ai_context_resume.json')
        ]);
        
        const linkedinData = await linkedinResponse.json();
        const resumeData = await resumeResponse.json();
        
        setContextData({ linkedin: linkedinData, resume: resumeData });
      } catch (error) {
        console.error('Error loading context data:', error);
      }
    };

    loadContextData();
  }, []);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!contextData) {
        throw new Error('Context data not loaded');
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          linkedinContext: contextData.linkedin,
          resumeContext: contextData.resume
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      return response;
    },
    onSuccess: async (response, variables) => {
      const reader = response.body?.getReader();
      if (!reader) return;

      let assistantMessage = '';
      const assistantMessageId = Date.now().toString();

      // Add initial assistant message
      const initialAssistantMessage: ChatMessage = {
        id: assistantMessageId,
        message: '',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, initialAssistantMessage]);

      // Stream the response
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.choices?.[0]?.delta?.content) {
                  const content = parsed.choices[0].delta.content;
                  assistantMessage += content;
                  
                  // Update the assistant message in real-time
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, message: assistantMessage }
                      : msg
                  ));
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (error) {
        console.error('Error streaming response:', error);
      }
    },
    onError: (error) => {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        message: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const handleSend = () => {
    if (input.trim() && contextData) {
      const userMessage = {
        id: Date.now().toString(),
        message: input.trim(),
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
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
    <div className="w-full bg-sidebar border-l border-ide flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-2 border-b border-ide flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-accent-blue rounded-full flex items-center justify-center">
            <Bot className="h-3 w-3 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-primary-ide font-medium text-xs truncate">Portfolio Assistant</div>
            <div className="text-secondary-ide text-xs truncate">Ask about experience</div>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-1.5 h-1.5 fill-current success-green flex-shrink-0" />
            {onClose && (
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="lg:hidden h-6 w-6 p-0 text-secondary-ide hover:text-primary-ide hover:bg-hover-gray"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-2 overflow-y-auto" ref={scrollAreaRef}>
        <div className="space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.isUser ? 'justify-end' : ''}`}>
              {!msg.isUser && (
                <div className="w-5 h-5 bg-accent-blue rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-2.5 w-2.5 text-white" />
                </div>
              )}
              <div className={`p-2 rounded-lg max-w-xs ${
                msg.isUser 
                  ? 'bg-accent-blue text-white' 
                  : 'bg-editor border border-ide text-primary-ide'
              }`}>
                <p className="text-xs break-words">{msg.message}</p>
              </div>
              {msg.isUser && (
                <div className="w-5 h-5 bg-secondary-ide rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div className="w-5 h-5 bg-accent-blue rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-2.5 w-2.5 text-white" />
              </div>
              <div className="bg-editor border border-ide p-2 rounded-lg max-w-xs">
                <p className="text-xs text-primary-ide">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Chat Input */}
      <div className="p-2 border-t border-ide flex-shrink-0">
        <div className="flex gap-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about experience..."
            className="flex-1 bg-editor border-ide text-primary-ide text-xs h-6 min-w-0"
            disabled={isLoading || !contextData}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || !contextData}
            size="sm"
            className="bg-accent-blue hover:bg-blue-600 text-white h-6 w-6 p-0 flex-shrink-0"
          >
            <Send className="h-2.5 w-2.5" />
          </Button>
        </div>
        <div className="text-secondary-ide text-xs mt-1 truncate">
          AI with LinkedIn context
        </div>
      </div>
    </div>
  );
}
