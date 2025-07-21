import { useState } from "react";
import { useLocation } from "wouter";
import { FileExplorer } from "@/components/ide/file-explorer";
import { TabBar } from "@/components/ide/tab-bar";
import { Terminal } from "@/components/ide/terminal";
import { ChatBot } from "@/components/ide/chatbot";
import Personal from "./personal";
import Projects from "./projects";
import Experience from "./experience";
import Contact from "./contact";

const files = [
  { name: "1_personal.rs", path: "personal", icon: "rust" as const },
  { name: "2_projects.py", path: "projects", icon: "python" as const },
  { name: "3_experience.cpp", path: "experience", icon: "cpp" as const },
  { name: "4_book_a_call.js", path: "contact", icon: "javascript" as const },
];

export default function Portfolio() {
  const [location, setLocation] = useLocation();
  const [openTabs, setOpenTabs] = useState<string[]>(["personal"]);
  
  const currentPath = location === "/" ? "personal" : location.slice(1);
  
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

  const renderContent = () => {
    switch (currentPath) {
      case "personal":
        return <Personal />;
      case "projects":
        return <Projects />;
      case "experience":
        return <Experience />;
      case "contact":
        return <Contact />;
      default:
        return <Personal />;
    }
  };

  return (
    <div className="flex h-screen">
      <FileExplorer 
        files={files}
        onFileSelect={handleFileSelect}
        activeFile={currentPath}
      />
      
      <div className="flex-1 flex flex-col">
        <TabBar
          tabs={openTabsData}
          activeTab={currentPath}
          onTabSelect={handleTabSelect}
          onTabClose={handleTabClose}
        />
        
        <div className="flex-1 flex">
          {renderContent()}
        </div>
        
        <Terminal />
      </div>

      <ChatBot />
    </div>
  );
}
