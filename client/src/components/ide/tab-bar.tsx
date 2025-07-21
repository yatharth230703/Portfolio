import { cn } from "@/lib/utils";
import { FileCode, X } from "lucide-react";

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
      <div className="flex">
        {tabs.map((tab) => (
          <div
            key={tab.path}
            onClick={() => onTabSelect(tab.path)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm border-r border-ide cursor-pointer",
              activeTab === tab.path 
                ? "bg-editor text-primary-ide" 
                : "text-secondary-ide hover:text-primary-ide"
            )}
          >
            <FileCode className={cn("h-4 w-4", fileColors[tab.icon])} />
            <span>{tab.name}</span>
            {onTabClose && (
              <X 
                className="h-3 w-3 text-secondary-ide hover:text-primary-ide ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.path);
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
