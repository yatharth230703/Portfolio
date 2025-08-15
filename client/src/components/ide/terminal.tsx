import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Terminal as TerminalIcon, Plus, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TerminalMessage {
  timestamp: string;
  content: string;
  type: "sent" | "status" | "error" | "platform";
  platform?: string;
  success?: boolean;
}

export function Terminal() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [terminalHeight, setTerminalHeight] = useState(128); // Default height: 128px (h-32)
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Height constraints
  const MIN_HEIGHT = 40; // Just enough for the header bar
  const MAX_HEIGHT = window.innerHeight * 0.5; // Half of the viewport height

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { content: string }) => {
      const response = await apiRequest("POST", "/api/messages", data);
      return response.json();
    },
    onSuccess: (data) => {
      const timestamp = new Date().toLocaleTimeString();
      const newMessages: TerminalMessage[] = [
        {
          timestamp,
          content: message,
          type: "sent"
        }
      ];

      // Add platform-specific status messages
      if (data.results && Array.isArray(data.results)) {
        data.results.forEach((result: any) => {
          newMessages.push({
            timestamp,
            content: `${result.success ? '✓' : '✗'} ${result.platform}: ${result.message}`,
            type: "platform",
            platform: result.platform,
            success: result.success
          } as TerminalMessage);
        });
        
        // Add summary message
        const successCount = data.successfulCount || 0;
        const totalCount = data.results?.length || 0;
        if (successCount > 0) {
          newMessages.push({
            timestamp,
            content: `✓ Message sent to ${successCount}/${totalCount} platforms (Email, SMS, WhatsApp & Slack)`,
            type: "status"
          } as TerminalMessage);
        }
      } else {
        // Fallback for backward compatibility
        newMessages.push({
          timestamp,
          content: "✓ Message forwarded to all platforms",
          type: "status"
        } as TerminalMessage);
      }

      // Replace all previous messages with new ones (clear history)
      setMessages(newMessages);
      setMessage("");
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
    }
  });

  const handleSend = () => {
    if (message.trim()) {
      sendMessageMutation.mutate({ content: message.trim() });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
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

  // Add/remove event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Update max height when window resizes
  useEffect(() => {
    const handleResize = () => {
      const newMaxHeight = window.innerHeight * 0.5;
      if (terminalHeight > newMaxHeight) {
        setTerminalHeight(newMaxHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [terminalHeight]);

  return (
    <div 
      ref={resizeRef}
      className="bg-editor border-t border-ide flex-shrink-0 relative"
      style={{ height: `${terminalHeight}px` }}
    >
      {/* Resize handle */}
      <div 
        className={`absolute -top-1 left-0 right-0 h-1 cursor-ns-resize transition-colors ${
          isResizing ? 'bg-accent-blue/40' : 'bg-transparent hover:bg-accent-blue/20'
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex justify-center">
          <GripVertical className={`h-1 w-4 ${isResizing ? 'text-accent-blue' : 'text-accent-blue/40'}`} />
        </div>
      </div>
      
      <div className={`flex items-center gap-1 px-2 py-1 bg-sidebar border-b border-ide text-xs ${
        terminalHeight <= MIN_HEIGHT ? 'bg-sidebar/80' : ''
      }`}>
        <TerminalIcon className="h-3 w-3 accent-blue" />
        <span className="text-secondary-ide">TERMINAL</span>
        {terminalHeight <= MIN_HEIGHT && (
          <span className="text-accent-blue/60 text-xs ml-2">(Drag to expand)</span>
        )}
        <div className="flex ml-auto gap-1">
          <Button variant="ghost" size="sm" className="text-secondary-ide hover:text-primary-ide h-5 w-5 p-0">
            <Plus className="h-2.5 w-2.5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-secondary-ide hover:text-primary-ide h-5 w-5 p-0">
            <X className="h-2.5 w-2.5" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-2 overflow-y-auto font-mono text-xs">
        <div className="space-y-1">
          <div className="flex">
            <span className="success-green">portfolio@dev:~$</span>
            <span className="text-primary-ide ml-1">Send me a message directly!</span>
          </div>
          <div className="text-secondary-ide">// Terminal connects to Email, SMS, WhatsApp & Slack</div>
          
          {/* Message Input */}
          <div className="flex items-start gap-1 mt-4">
            <span className="success-green">{'>'}</span>
            <div className="flex-1">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-primary-ide border-none outline-none resize-none p-0 font-mono text-xs"
                placeholder="Type message... (Email, SMS, WhatsApp & Slack)"
                rows={1}
              />
              <div className="flex justify-between items-center mt-1">
                <div className="text-secondary-ide text-xs">Ctrl+Enter</div>
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  size="sm"
                  className="bg-accent-blue hover:bg-blue-600 text-white h-5 px-2 text-xs"
                >
                  {sendMessageMutation.isPending ? "..." : "Send"}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Terminal Output */}
          <div className="space-y-1 mt-4 min-h-32 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className="text-secondary-ide text-xs py-1 px-2 rounded">
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
                {msg.type === "sent" ? `Sent: "${msg.content}"` : msg.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
