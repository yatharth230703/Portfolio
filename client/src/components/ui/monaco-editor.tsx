import { cn } from "@/lib/utils";

interface LineNumbersProps {
  count: number;
  className?: string;
}

export function LineNumbers({ count, className }: LineNumbersProps) {
  return (
    <div className={cn("w-12 bg-editor border-r border-ide py-4 text-right text-secondary-ide text-sm font-mono", className)}>
      <div className="space-y-1 px-2">
        {Array.from({ length: count }, (_, i) => (
          <div key={i + 1}>{i + 1}</div>
        ))}
      </div>
    </div>
  );
}

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <div className={cn("font-mono text-sm space-y-4", className)}>
      {children}
    </div>
  );
}

interface CommentProps {
  children: React.ReactNode;
}

export function Comment({ children }: CommentProps) {
  return <div className="success-green text-secondary-ide">{children}</div>;
}

interface KeywordProps {
  children: React.ReactNode;
}

export function Keyword({ children }: KeywordProps) {
  return <span className="accent-blue">{children}</span>;
}

interface TypeProps {
  children: React.ReactNode;
}

export function Type({ children }: TypeProps) {
  return <span className="warning-orange">{children}</span>;
}

interface StringProps {
  children: React.ReactNode;
}

export function StringLiteral({ children }: StringProps) {
  return <span className="success-green">{children}</span>;
}
