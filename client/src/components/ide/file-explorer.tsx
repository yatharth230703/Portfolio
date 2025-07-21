import { cn } from "@/lib/utils";
import { FileCode, Folder, FolderOpen, Circle } from "lucide-react";

interface FileItem {
  name: string;
  path: string;
  icon: "rust" | "python" | "cpp" | "javascript";
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
  javascript: "📜"
};

const fileColors = {
  rust: "warning-orange",
  python: "accent-blue", 
  cpp: "success-green",
  javascript: "warning-orange"
};

export function FileExplorer({ files, onFileSelect, activeFile }: FileExplorerProps) {
  return (
    <div className="w-60 bg-sidebar border-r border-ide flex flex-col">
      {/* Explorer Header */}
      <div className="p-3 border-b border-ide">
        <div className="flex items-center gap-2 text-secondary-ide text-sm">
          <FolderOpen className="h-4 w-4 accent-blue" />
          <span>PORTFOLIO</span>
        </div>
      </div>
      
      {/* File Tree */}
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-1">
          {files.map((file) => (
            <div
              key={file.path}
              onClick={() => onFileSelect(file.path)}
              className={cn(
                "flex items-center gap-2 px-2 py-1 text-sm hover-gray rounded cursor-pointer",
                activeFile === file.path && "bg-editor text-primary-ide"
              )}
            >
              <FileCode className={cn("h-4 w-4", fileColors[file.icon])} />
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Status */}
      <div className="p-3 border-t border-ide">
        <div className="flex items-center gap-2 text-xs text-secondary-ide">
          <Circle className="w-2 h-2 fill-current success-green" />
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
}
