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
    <div className="h-48 bg-editor border-t border-ide">
      <div className="flex items-center gap-2 px-4 py-2 bg-sidebar border-b border-ide text-sm">
        <TerminalIcon className="h-4 w-4 accent-blue" />
        <span className="text-secondary-ide">TERMINAL</span>
        <div className="flex ml-auto gap-2">
          <Button variant="ghost" size="sm" className="text-secondary-ide hover:text-primary-ide">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-secondary-ide hover:text-primary-ide">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4 h-full overflow-y-auto font-mono text-sm">
        <div className="space-y-2">
          <div className="flex">
            <span className="success-green">portfolio@dev:~$</span>
            <span className="text-primary-ide ml-2">Send me a message directly to my phone & email!</span>
          </div>
          <div className="text-secondary-ide">// This terminal connects to Resend API + Twilio for instant messaging</div>
          
          {/* Terminal Output */}
          <div className="space-y-1 mt-4">
            {messages.map((msg, index) => (
              <div key={index} className="text-secondary-ide text-sm">
                <span className={msg.type === "sent" ? "success-green" : msg.type === "error" ? "text-red-400" : "warning-orange"}>
                  [{msg.timestamp}]
                </span>{" "}
                {msg.type === "sent" ? `Message sent: "${msg.content}"` : msg.content}
              </div>
            ))}
          </div>
          
          {/* Message Input */}
          <div className="flex items-start gap-2 mt-4">
            <span className="success-green">{'>'}</span>
            <div className="flex-1">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-primary-ide border-none outline-none resize-none p-0 font-mono"
                placeholder="Type your message here... (will be sent to WhatsApp, SMS & Email)"
                rows={3}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-secondary-ide text-xs">Press Ctrl+Enter to send</div>
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  size="sm"
                  className="bg-accent-blue hover:bg-blue-600 text-white"
                >
                  {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
