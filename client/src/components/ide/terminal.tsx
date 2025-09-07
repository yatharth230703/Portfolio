import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Terminal as TerminalIcon, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TerminalMessage {
  timestamp: string;
  content: string;
  type: "sent" | "status" | "error" | "platform";
  platform?: string;
  success?: boolean;
}

interface TerminalProps {
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export function Terminal({ isExpanded = false, onExpandedChange }: TerminalProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [terminalHeight, setTerminalHeight] = useState(400); // Increased default height to fill more space
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Height constraints
  const MIN_HEIGHT = 40; // Just enough for the header bar
  const MAX_HEIGHT = window.innerHeight * 0.4; // 40% of screen height
  
  // Calculate optimal height based on messages
  const calculateOptimalHeight = (messageCount: number) => {
    const baseHeight = 400; // Increased base height to fill more space
    const messageHeight = 24; // Approximate height per message
    const padding = 32; // Extra padding for input and spacing
    
    const calculatedHeight = baseHeight + (messageCount * messageHeight) + padding;
    return Math.min(calculatedHeight, MAX_HEIGHT);
  };
  
  // Auto-expand terminal when messages are added
  const expandTerminalForMessages = (messageCount: number) => {
    const optimalHeight = calculateOptimalHeight(messageCount);
    if (optimalHeight > terminalHeight) {
      setTerminalHeight(optimalHeight);
    }
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { content: string }) => {
      const response = await apiRequest("POST", "/api/messages", data);
      return response.json();
    },
    onSuccess: async (data) => {
      const timestamp = new Date().toLocaleTimeString();
      
      // First, show only the sent message
      const sentMessage: TerminalMessage = {
        timestamp,
        content: message,
        type: "sent"
      };
      
      // Clear previous messages and show only sent message
      setMessages([sentMessage]);
      setMessage("");
      
      // Auto-expand terminal to show the sent message
      expandTerminalForMessages(1);
      
      // Wait a moment before starting confirmations
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add platform-specific status messages one by one
      if (data.results && Array.isArray(data.results)) {
        const updatedMessages = [sentMessage];
        
        // Add each platform status with delay
        for (let i = 0; i < data.results.length; i++) {
          const result = data.results[i];
          const platformMessage: TerminalMessage = {
            timestamp,
            content: `${result.success ? '✓' : '✗'} ${result.platform}: ${result.message}`,
            type: "platform",
            platform: result.platform,
            success: result.success
          };
          
          updatedMessages.push(platformMessage);
          setMessages([...updatedMessages]);
          
          // Auto-expand terminal to show new platform message
          expandTerminalForMessages(updatedMessages.length);
          
          // Wait before next platform (0.6-1.2 seconds)
          await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 600));
        }
        
        // Add summary message after all platforms
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const successCount = data.successfulCount || 0;
        const totalCount = data.results?.length || 0;
        if (successCount > 0) {
          const summaryMessage: TerminalMessage = {
            timestamp,
            content: `✓ Message sent to ${successCount}/${totalCount} platforms (Email, SMS, WhatsApp & Slack)`,
            type: "status"
          };
          
          updatedMessages.push(summaryMessage);
          setMessages([...updatedMessages]);
          
          // Auto-expand terminal to show summary message
          expandTerminalForMessages(updatedMessages.length);
        }
      } else {
        // Fallback for backward compatibility
        await new Promise(resolve => setTimeout(resolve, 800));
        setMessages([
          sentMessage,
          {
            timestamp,
            content: "✓ Message forwarded to all platforms",
            type: "status"
          } as TerminalMessage
        ]);
        
        // Auto-expand terminal to show fallback message
        expandTerminalForMessages(2);
      }
    },
    onError: (error) => {
      const timestamp = new Date().toLocaleTimeString();
      // Clear previous messages and show only error
      setMessages([
        {
          timestamp,
          content: `✗ Failed to send message: ${error.message}`,
          type: "error"
        }
      ]);
      
      // Auto-expand terminal to show error message
      expandTerminalForMessages(1);
    }
  });

  const handleSend = () => {
    if (message.trim()) {
      sendMessageMutation.mutate({ content: message.trim() });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Resize handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const containerRect = resizeRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const newHeight = containerRect.bottom - e.clientY;
    const constrainedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
    
    setTerminalHeight(constrainedHeight);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isResizing) return;
    
    const containerRect = resizeRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    const touch = e.touches[0];
    const newHeight = containerRect.bottom - touch.clientY;
    const constrainedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
    
    setTerminalHeight(constrainedHeight);
  };

  const handleTouchEnd = () => {
    setIsResizing(false);
  };

  // Collapse and expand handlers
  const handleCollapse = () => {
    setTerminalHeight(MIN_HEIGHT);
  };

  const handleExpand = () => {
    setTerminalHeight(MAX_HEIGHT);
  };

  // Add/remove event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isResizing]);

  // Update max height when window resizes
  useEffect(() => {
    const handleResize = () => {
      const newMaxHeight = window.innerHeight * 0.4;
      if (terminalHeight > newMaxHeight) {
        setTerminalHeight(newMaxHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [terminalHeight]);

  // Handle external expansion
  useEffect(() => {
    if (isExpanded) {
      setTerminalHeight(MAX_HEIGHT);
      onExpandedChange?.(false); // Reset the external state
    }
  }, [isExpanded, onExpandedChange]);

  return (
    <div 
      ref={resizeRef}
      className="bg-editor border-t border-ide relative flex flex-col"
      style={{ height: `${terminalHeight}px` }}
    >
      <div 
        className={`flex items-center gap-1 px-2 py-1 bg-sidebar border-b border-ide text-xs cursor-ns-resize ${
          terminalHeight <= MIN_HEIGHT ? 'bg-sidebar/80' : ''
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <TerminalIcon className="h-3 w-3 accent-blue" />
        <span className="text-secondary-ide">TERMINAL</span>
        {terminalHeight <= MIN_HEIGHT && (
          <span className="text-accent-blue/60 text-xs ml-2">(Touch & drag to expand)</span>
        )}
        <div className="flex ml-auto gap-1">
          <button
            onClick={handleCollapse}
            className="p-1 hover:bg-ide/50 rounded transition-colors"
            title="Collapse terminal"
          >
            <ChevronDown className="h-3 w-3 text-secondary-ide/60 hover:text-secondary-ide" />
          </button>
          <button
            onClick={handleExpand}
            className="p-1 hover:bg-ide/50 rounded transition-colors"
            title="Expand terminal"
          >
            <ChevronUp className="h-3 w-3 text-secondary-ide/60 hover:text-secondary-ide" />
          </button>
          <ArrowUpDown className="h-3 w-3 text-secondary-ide/60" />
        </div>
      </div>
      
      <div className="flex-1 p-2 overflow-y-auto font-mono text-xs">
        <div className="space-y-1">
          <div className="flex flex-wrap">
            <span className="success-green">portfolio@dev:~$</span>
            <span className="text-primary-ide ml-1">Send me a message directly!</span>
          </div>
          <div className="text-secondary-ide">// Terminal connects to Email, SMS, WhatsApp & Slack</div>
          <div className="text-secondary-ide">// Simply press Enter to send your message</div>
          
          {/* Message Input */}
          <div className="flex items-center gap-1 mt-4">
            <span className="success-green">{'>'}</span>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-primary-ide border-none outline-none font-mono text-xs min-w-0"
              placeholder="Type message... (Email, SMS, WhatsApp & Slack)"
              disabled={sendMessageMutation.isPending}
            />
          </div>
          
          {/* Terminal Output */}
          <div className="space-y-1 mt-4 min-h-32 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className="text-secondary-ide text-xs py-1 px-2 rounded break-words">
                <span className={
                  msg.type === "sent" ? "success-green" : 
                  msg.type === "error" ? "text-red-400" : 
                  msg.type === "platform" ? (msg.success ? "success-green" : "text-red-400") :
                  "warning-orange"
                }>
                  [{msg.type === "sent" ? "SENT" : 
                    msg.type === "error" ? "ERROR" : 
                    msg.type === "platform" ? msg.platform?.toUpperCase() || "PLATFORM" :
                    "STATUS"}]
                </span>{" "}
                <span className="break-words">
                  {msg.type === "sent" ? `Sent: "${msg.content}"` : msg.content}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
