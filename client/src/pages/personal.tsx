import { LineNumbers, CodeBlock, Comment, Keyword, Type } from "@/components/ui/monaco-editor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, FileText, User } from "lucide-react";

export default function Personal() {
  return (
    <div className="flex-1 flex">
      <LineNumbers count={30} />
      
      <div className="flex-1 p-4 overflow-y-auto">
        <CodeBlock>
          <Comment>
            <span>// Personal Information Module</span><br />
            <span>// Author: John Developer</span><br />
            <span>// Description: Developer Profile & Contact Information</span>
          </Comment>
          
          <div>
            <Keyword>struct</Keyword> <Type>Developer</Type> {"{"}
          </div>
          
          <div className="ml-4 space-y-6">
            {/* Profile Section */}
            <Card className="bg-sidebar border-ide p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-accent-blue rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-primary-ide">John Developer</h2>
                  <p className="text-secondary-ide">Full Stack Developer</p>
                  <p className="text-secondary-ide text-sm">Building amazing web experiences</p>
                </div>
              </div>
              
              {/* Contact Links */}
              <div className="space-y-2">
                <Button variant="ghost" className="flex items-center gap-3 text-accent-blue hover:text-warning-orange p-0 h-auto justify-start">
                  <Linkedin className="h-4 w-4" />
                  <span>linkedin.com/in/johndeveloper</span>
                </Button>
                <Button variant="ghost" className="flex items-center gap-3 text-accent-blue hover:text-warning-orange p-0 h-auto justify-start">
                  <Github className="h-4 w-4" />
                  <span>github.com/johndeveloper</span>
                </Button>
                <Button variant="ghost" className="flex items-center gap-3 text-accent-blue hover:text-warning-orange p-0 h-auto justify-start">
                  <Mail className="h-4 w-4" />
                  <span>john@developer.com</span>
                </Button>
                <Button variant="ghost" className="flex items-center gap-3 text-accent-blue hover:text-warning-orange p-0 h-auto justify-start">
                  <FileText className="h-4 w-4" />
                  <span>Download Resume</span>
                </Button>
              </div>
            </Card>
            
            {/* About Me Section */}
            <Card className="bg-sidebar border-ide p-4">
              <h3 className="text-lg font-semibold warning-orange mb-3">About Me</h3>
              <p className="text-primary-ide leading-relaxed">
                Passionate full-stack developer with 3+ years of experience building scalable web applications. 
                I love creating elegant solutions to complex problems and am always excited to learn new technologies. 
                Currently focused on React, Node.js, and cloud architecture.
              </p>
            </Card>
            
            {/* Skills Section */}
            <Card className="bg-sidebar border-ide p-4">
              <h3 className="text-lg font-semibold warning-orange mb-3">Skills</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="accent-blue mb-2">Frontend</h4>
                  <div className="space-y-1 text-sm text-primary-ide">
                    <div>React, TypeScript</div>
                    <div>Next.js, Tailwind CSS</div>
                    <div>Vue.js, Angular</div>
                  </div>
                </div>
                <div>
                  <h4 className="accent-blue mb-2">Backend</h4>
                  <div className="space-y-1 text-sm text-primary-ide">
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
