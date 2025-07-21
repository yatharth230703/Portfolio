import { LineNumbers, CodeBlock, Comment, Keyword, Type } from "@/components/ui/monaco-editor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, FileText, User } from "lucide-react";

export default function Personal() {
  return (
    <div className="flex-1 flex h-full">
      <LineNumbers count={30} />
      
      <div className="flex-1 p-4 overflow-y-auto h-full">
        <CodeBlock>
          <Comment>
            <span>// Personal Information Module</span><br />
            <span>// Author: John Developer</span><br />
            <span>// Description: Developer Profile & Contact Information</span>
          </Comment>
          
          <div>
            <Keyword>struct</Keyword> <Type>Developer</Type> {"{"}
          </div>
          
          <div className="ml-4 space-y-3">
            {/* Profile Section */}
            <Card className="bg-sidebar border-ide p-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-accent-blue rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-primary-ide">John Developer</h2>
                  <p className="text-secondary-ide text-sm">Full Stack Developer</p>
                  <p className="text-secondary-ide text-xs">Building amazing web experiences</p>
                </div>
              </div>
              
              {/* Contact Links */}
              <div className="space-y-1">
                <Button variant="ghost" className="flex items-center gap-2 text-accent-blue hover:text-warning-orange p-0 h-auto justify-start text-xs">
                  <Linkedin className="h-3 w-3" />
                  <span>linkedin.com/in/johndeveloper</span>
                </Button>
                <Button variant="ghost" className="flex items-center gap-2 text-accent-blue hover:text-warning-orange p-0 h-auto justify-start text-xs">
                  <Github className="h-3 w-3" />
                  <span>github.com/johndeveloper</span>
                </Button>
                <Button variant="ghost" className="flex items-center gap-2 text-accent-blue hover:text-warning-orange p-0 h-auto justify-start text-xs">
                  <Mail className="h-3 w-3" />
                  <span>john@developer.com</span>
                </Button>
                <Button variant="ghost" className="flex items-center gap-2 text-accent-blue hover:text-warning-orange p-0 h-auto justify-start text-xs">
                  <FileText className="h-3 w-3" />
                  <span>Download Resume</span>
                </Button>
              </div>
            </Card>
            
            {/* About Me Section */}
            <Card className="bg-sidebar border-ide p-3">
              <h3 className="text-sm font-semibold warning-orange mb-2">About Me</h3>
              <p className="text-primary-ide leading-relaxed text-xs">
                Passionate full-stack developer with 3+ years of experience building scalable web applications. 
                I love creating elegant solutions to complex problems and am always excited to learn new technologies. 
                Currently focused on React, Node.js, and cloud architecture.
              </p>
            </Card>
            
            {/* Skills Section */}
            <Card className="bg-sidebar border-ide p-3">
              <h3 className="text-sm font-semibold warning-orange mb-2">Skills</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="accent-blue mb-1 text-xs">Frontend</h4>
                  <div className="space-y-0.5 text-xs text-primary-ide">
                    <div>React, TypeScript</div>
                    <div>Next.js, Tailwind CSS</div>
                    <div>Vue.js, Angular</div>
                  </div>
                </div>
                <div>
                  <h4 className="accent-blue mb-1 text-xs">Backend</h4>
                  <div className="space-y-0.5 text-xs text-primary-ide">
                    <div>Node.js, Python</div>
                    <div>PostgreSQL, MongoDB</div>
                    <div>AWS, Docker</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          <div>{"}"}</div>
        </CodeBlock>
      </div>
    </div>
  );
}
