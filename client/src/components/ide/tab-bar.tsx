import { cn } from "@/lib/utils";
import { FileCode, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface Tab {
  name: string;
  path: string;
  icon: "rust" | "python" | "cpp" | "javascript";
}

interface TabBarProps {
  tabs: Tab[];
  activeTab?: string;
  onTabSelect: (path: string) => void;
  onTabClose?: (path: string) => void;
}

const fileColors = {
  rust: "warning-orange",
  python: "accent-blue", 
  cpp: "success-green",
  javascript: "warning-orange"
};

export function TabBar({ tabs, activeTab, onTabSelect, onTabClose }: TabBarProps) {
  return (
    <div className="bg-sidebar border-b border-ide">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.path}
            onClick={() => onTabSelect(tab.path)}
            className={cn(
              "flex items-center gap-1 px-2 py-1 text-xs border-r border-ide cursor-pointer whitespace-nowrap flex-shrink-0",
              activeTab === tab.path 
                ? "bg-editor text-primary-ide" 
                : "text-secondary-ide hover:text-primary-ide"
            )}
          >
            <FileCode className={cn("h-3 w-3", fileColors[tab.icon])} />
            <span className="truncate max-w-32">{tab.name}</span>
            {onTabClose && (
              <X 
                className="h-2.5 w-2.5 text-secondary-ide hover:text-primary-ide ml-1 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.path);
                }}
              />
            )}
          </div>
        ))}
        
        {/* Theme Toggle Button */}
        <div className="ml-auto flex items-center px-2 border-l border-ide">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
