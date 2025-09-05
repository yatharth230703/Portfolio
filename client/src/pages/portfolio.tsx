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
  { name: "1_personal.rs", path: "personal", icon: "rust" as const },
  { name: "2_projects.py", path: "projects", icon: "python" as const },
  { name: "3_experience.cpp", path: "experience", icon: "cpp" as const },
];

export default function Portfolio() {
  const [location, setLocation] = useLocation();
  const [openTabs, setOpenTabs] = useState<string[]>(["personal"]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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
    <div className="flex h-screen">
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
        <div className={`lg:hidden bg-sidebar border-b border-ide p-2 transition-all duration-300 ${
          isChatOpen ? 'opacity-0 h-0 p-0 overflow-hidden' : 'opacity-100'
        }`}>
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
            {/* Chat Toggle Button */}
            <div
              onClick={toggleChat}
              className={`flex items-center justify-center p-1 cursor-pointer transition-colors duration-200 ${
                isChatOpen 
                  ? "text-accent-blue" 
                  : "text-secondary-ide hover:text-primary-ide"
              }`}
            >
              <MessageCircle className="h-3 w-3" />
            </div>
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
            <Terminal />
          </div>
        </div>
      </div>
      
      {/* Chatbot - Toggleable on mobile, always visible on desktop */}
      <div className={`flex-shrink-0 transition-all duration-500 ease-in-out ${
        isMobile 
          ? (isChatOpen 
              ? 'w-40 sm:w-48 opacity-100 translate-x-0 chat-slide-in' 
              : 'w-0 opacity-0 -translate-x-full chat-slide-out')
          : 'w-64 xl:w-72 opacity-100'
      }`}>
        <div className={`h-full transition-all duration-500 ease-in-out ${
          isMobile 
            ? (isChatOpen ? 'opacity-100 chat-bounce-in' : 'opacity-0')
            : 'opacity-100'
        }`}>
          <ChatBot {...(isMobile ? { onClose: toggleChat } : {})} />
        </div>
      </div>
    </div>
  );
}
