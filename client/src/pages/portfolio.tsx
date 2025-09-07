import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { FileExplorer } from "@/components/ide/file-explorer";
import { TabBar } from "@/components/ide/tab-bar";
import { Terminal } from "@/components/ide/terminal";
import { ChatBot } from "@/components/ide/chatbot";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import Personal from "./personal";
import Projects from "./projects";
import Experience from "./experience";

const files = [
  { name: "Personal.rs", path: "personal", icon: "rust" as const },
  { name: "Projects.py", path: "projects", icon: "python" as const },
  { name: "Experience.cpp", path: "experience", icon: "cpp" as const },
  { name: "Chat.java", path: "chat", icon: "java" as const },
  { name: "Direct_Message.js", path: "direct-message", icon: "javascript" as const },
];

export default function Portfolio() {
  const [location, setLocation] = useLocation();
  const [openTabs, setOpenTabs] = useState<string[]>(["personal"]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);
  
  const currentPath = location === "/" ? "personal" : location.slice(1);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleFileSelect = (path: string) => {
    if (path === "chat") {
      // For Chat.java - open chatbot directly in mobile mode
      if (isMobile) {
        setIsChatOpen(true);
      }
      return;
    }
    
    if (path === "direct-message") {
      // For Direct_Message.js - expand terminal to maximum
      setIsTerminalExpanded(true);
      return;
    }
    
    setLocation(`/${path}`);
    if (!openTabs.includes(path)) {
      setOpenTabs([...openTabs, path]);
    }
  };

  const handleTabSelect = (path: string) => {
    setLocation(`/${path}`);
  };

  const handleTabClose = (path: string) => {
    const newTabs = openTabs.filter(tab => tab !== path);
    setOpenTabs(newTabs);
    
    if (currentPath === path && newTabs.length > 0) {
      setLocation(`/${newTabs[newTabs.length - 1]}`);
    } else if (newTabs.length === 0) {
      setLocation("/personal");
      setOpenTabs(["personal"]);
    }
  };

  const openTabsData = openTabs.map(tab => 
    files.find(file => file.path === tab)!
  ).filter(Boolean);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const renderContent = () => {
    switch (currentPath) {
      case "personal":
        return <Personal />;
      case "projects":
        return <Projects />;
      case "experience":
        return <Experience />;
      default:
        return <Personal />;
    }
  };

  return (
    <div className="flex h-screen overflow-x-hidden">
      {/* Mobile: Hidden sidebar, Desktop: Visible */}
      <div className="hidden lg:block">
        <FileExplorer 
          files={files}
          onFileSelect={handleFileSelect}
          activeFile={currentPath}
        />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Mobile: Show file explorer as horizontal tabs */}
        <div className="lg:hidden bg-sidebar border-b border-ide p-2">
          <div className="flex gap-1 overflow-x-auto">
            {files.map((file) => (
              <div
                key={file.path}
                onClick={() => handleFileSelect(file.path)}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded cursor-pointer whitespace-nowrap ${
                  currentPath === file.path 
                    ? "bg-editor text-primary-ide" 
                    : "text-secondary-ide hover:text-primary-ide hover-gray"
                }`}
              >
                <span className="text-xs">{file.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <TabBar
          tabs={openTabsData}
          activeTab={currentPath}
          onTabSelect={handleTabSelect}
          onTabClose={handleTabClose}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 overflow-hidden min-h-0">
            {renderContent()}
          </div>
        </div>
        
        {/* Terminal - spans full width below main content */}
        <div className="flex">
          <div className="w-8 bg-editor border-r border-ide"></div>
          <div className="flex-1">
            <Terminal isExpanded={isTerminalExpanded} onExpandedChange={setIsTerminalExpanded} />
          </div>
        </div>
      </div>
      
      {/* Chatbot - Toggleable on mobile, always visible on desktop */}
      {isMobile ? (
        <>
          {/* Mobile Overlay Backdrop */}
          {isChatOpen && (
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
              onClick={toggleChat}
            />
          )}
          
          {/* Mobile Chatbot Overlay */}
          <div className={`fixed top-0 right-0 h-full w-[70%] z-50 transition-transform duration-300 ease-in-out ${
            isChatOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <ChatBot onClose={toggleChat} />
          </div>
        </>
      ) : (
        <div className="flex-shrink-0 w-64 xl:w-72 opacity-100">
          <div className="h-full opacity-100">
            <ChatBot />
          </div>
        </div>
      )}
    </div>
  );
}
