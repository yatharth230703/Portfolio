import { cn } from "@/lib/utils";
import { FileCode, Folder, FolderOpen, Circle } from "lucide-react";

interface FileItem {
  name: string;
  path: string;
  icon: "rust" | "python" | "cpp" | "javascript" | "java";
  active?: boolean;
}

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (path: string) => void;
  activeFile?: string;
}

const fileIcons = {
  rust: "🦀",
  python: "🐍", 
  cpp: "⚡",
  javascript: "📜",
  java: "☕"
};

const fileColors = {
  rust: "warning-orange",
  python: "accent-blue", 
  cpp: "success-green",
  javascript: "warning-orange",
  java: "accent-blue"
};

export function FileExplorer({ files, onFileSelect, activeFile }: FileExplorerProps) {
  return (
    <div className="w-48 lg:w-48 xl:w-56 bg-sidebar border-r border-ide flex flex-col">
      {/* Explorer Header */}
      <div className="p-2 border-b border-ide">
        <div className="flex items-center gap-1 text-secondary-ide text-xs">
          <FolderOpen className="h-3 w-3 accent-blue" />
          <span>PORTFOLIO</span>
        </div>
      </div>
      
      {/* File Tree */}
      <div className="flex-1 p-1 overflow-y-auto">
        <div className="space-y-0.5">
          {files.map((file) => (
            <div
              key={file.path}
              onClick={() => onFileSelect(file.path)}
              className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 text-xs hover-gray rounded cursor-pointer",
                activeFile === file.path && "bg-editor text-primary-ide"
              )}
            >
              <FileCode className={cn("h-3 w-3", fileColors[file.icon])} />
              <span className="truncate">{file.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Status */}
      <div className="p-2 border-t border-ide">
        <div className="flex items-center gap-1 text-xs text-secondary-ide">
          <Circle className="w-1.5 h-1.5 fill-current success-green" />
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
}
