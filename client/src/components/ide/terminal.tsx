import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Terminal as TerminalIcon, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TerminalMessage {
  timestamp: string;
  content: string;
  type: "sent" | "status" | "error";
}

export function Terminal() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { content: string }) => {
      const response = await apiRequest("POST", "/api/messages", data);
      return response.json();
    },
    onSuccess: (data) => {
      const timestamp = new Date().toLocaleTimeString();
      setMessages(prev => [
        ...prev,
        {
          timestamp,
          content: message,
          type: "sent"
        },
        {
          timestamp,
          content: "✓ Message forwarded to WhatsApp, SMS, and Email",
          type: "status"
        }
      ]);
      setMessage("");
      toast({
        title: "Message sent successfully",
        description: "Your message has been forwarded to all channels.",
      });
    },
    onError: (error) => {
      const timestamp = new Date().toLocaleTimeString();
      setMessages(prev => [
        ...prev,
        {
          timestamp,
          content: `✗ Failed to send message: ${error.message}`,
          type: "error"
        }
      ]);
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
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

  return (
    <div className="h-32 bg-editor border-t border-ide flex-shrink-0">
      <div className="flex items-center gap-1 px-2 py-1 bg-sidebar border-b border-ide text-xs">
        <TerminalIcon className="h-3 w-3 accent-blue" />
        <span className="text-secondary-ide">TERMINAL</span>
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
          <div className="text-secondary-ide">// Terminal connects to Resend API + Twilio</div>
          
          {/* Terminal Output */}
          <div className="space-y-0.5 mt-2 max-h-8 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className="text-secondary-ide text-xs">
                <span className={msg.type === "sent" ? "success-green" : msg.type === "error" ? "text-red-400" : "warning-orange"}>
                  [{msg.timestamp}]
                </span>{" "}
                {msg.type === "sent" ? `Sent: "${msg.content}"` : msg.content}
              </div>
            ))}
          </div>
          
          {/* Message Input */}
          <div className="flex items-start gap-1 mt-2">
            <span className="success-green">{'>'}</span>
            <div className="flex-1">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-primary-ide border-none outline-none resize-none p-0 font-mono text-xs"
                placeholder="Type message... (WhatsApp, SMS & Email)"
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
        </div>
      </div>
    </div>
  );
}
