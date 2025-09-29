import { LineNumbers, CodeBlock, Comment, Keyword, Type } from "@/components/ui/monaco-editor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, FileText, User, Brain, Code, Database, Globe, Calendar } from "lucide-react";

export default function Personal() {
  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/YATHARTH BISHT DTU RESUME.pdf';
    link.download = 'YATHARTH BISHT DTU RESUME.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-full">
      <LineNumbers count={30} />
      
      <div className="flex-1 p-2 sm:p-4 overflow-y-auto h-full">
        <CodeBlock>
          <Comment>
            <span>// Personal Information Module</span><br />
            <span>// Author: Yatharth Bisht</span><br />
            <span>// Description: AI Developer & Software Developer Profile</span>
          </Comment>
          
          <div>
            <Keyword>struct</Keyword> <Type>Developer</Type> {"{"}
          </div>
          
          <div className="ml-4 space-y-3">
            {/* Profile Section */}
            <Card className="bg-sidebar border-ide p-3">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Left Side - Profile Photo */}
                <div className="flex-shrink-0">
                  <img 
                    src="/profile_photo.webp" 
                    alt="Yatharth Bisht" 
                    className="w-32 h-32 rounded-lg object-cover border border-ide"
                  />
                </div>
                
                {/* Right Side - Profile Information and Links */}
                <div className="flex-1 flex flex-col justify-center">
                  {/* Personal Information */}
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-primary-ide">Yatharth Bisht</h2>
                    <p className="text-secondary-ide text-sm">AI Developer & Full-Stack Engineer</p>
                    <p className="text-secondary-ide text-xs">B.Tech Computer Engineering @ DTU</p>
                  </div>
                  
                  {/* Social Links in Single Line */}
                  <div className="flex flex-wrap gap-3">
                    <Button variant="ghost" className="flex items-center gap-2 text-red-400 hover:text-warning-orange p-0 h-auto text-xs">
                      <Linkedin className="h-3 w-3 flex-shrink-0" />
                      <a href="https://linkedin.com/in/yatharth-bisht-8a559b241" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        LinkedIn
                      </a>
                    </Button>
                    <Button variant="ghost" className="flex items-center gap-2 text-red-400 hover:text-warning-orange p-0 h-auto text-xs">
                      <Github className="h-3 w-3 flex-shrink-0" />
                      <a href="https://github.com/yatharth230703" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Github
                      </a>
                    </Button>
                    <Button variant="ghost" className="flex items-center gap-2 text-red-400 hover:text-warning-orange p-0 h-auto text-xs">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">vasub0723@gmail.com</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2 text-red-400 hover:text-warning-orange p-0 h-auto text-xs"
                      onClick={handleDownloadResume}
                    >
                      <FileText className="h-3 w-3 flex-shrink-0" />
                      <span>Download Resume</span>
                    </Button>
                    <Button variant="ghost" className="flex items-center gap-2 text-red-400 hover:text-warning-orange p-0 h-auto text-xs">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <a href="https://calendar.app.google/7qwYwYBLy8DRy2Tv9" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Book a Call
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* About Me Section */}
            <Card className="bg-sidebar border-ide p-3">
              <h3 className="text-sm font-semibold text-red-400 mb-2">About Me</h3>
              <p className="text-primary-ide leading-relaxed text-xs">
                Final year student at DTU, passionate about AI and Automation. Learning by building .
                Currently seeking full-time opportunities in AI Engineering, Software Development, and Fullstack.
              </p>
            </Card>

            {/* Achievements */}
            <Card className="bg-sidebar border-ide p-3">
              <h3 className="text-sm font-semibold text-red-400 mb-2">Achievements</h3>
              <div className="space-y-1 text-xs text-primary-ide">
                <div>• Amazon ML Challenge: National Rank 135/700,000</div>
                <div>• CodeChef Starters 159: Global Rank 4</div>
                <div>• Kaggle Playground S4E6: Global Rank 198</div>
                <div>• Selected for IITB-RISC Research Summit</div>
                <div>• 700+ DSA problems solved on LeetCode</div>
                <div>• Selected for Amazon ML Summer School 2025</div>
              </div>
            </Card>
          </div>
          
          <div>{"}"}</div>
        </CodeBlock>
      </div>
    </div>
  );
}
