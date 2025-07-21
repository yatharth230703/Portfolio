import { useState, useEffect } from "react";
import { LineNumbers, CodeBlock, Comment, Keyword, Type } from "@/components/ui/monaco-editor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "TaskFlow Dashboard",
    description: "A comprehensive project management dashboard built with React and Node.js. Features real-time collaboration, task tracking, and analytics.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    tech: ["React", "Node.js", "MongoDB"],
    demoUrl: "#",
    codeUrl: "#"
  },
  {
    id: 2,
    title: "ShopSmart App",
    description: "A modern e-commerce mobile application with seamless shopping experience, payment integration, and personalized recommendations.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    tech: ["React Native", "Firebase", "Stripe"],
    demoUrl: "#",
    codeUrl: "#"
  },
  {
    id: 3,
    title: "AI Content Generator",
    description: "An intelligent content generation tool powered by machine learning algorithms. Helps users create engaging content with AI assistance.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    tech: ["Python", "TensorFlow", "Flask"],
    demoUrl: "#",
    codeUrl: "#"
  }
];

const techColors: Record<string, string> = {
  "React": "bg-accent-blue",
  "Node.js": "bg-success-green",
  "MongoDB": "bg-warning-orange",
  "React Native": "bg-accent-blue",
  "Firebase": "bg-success-green",
  "Stripe": "bg-warning-orange",
  "Python": "bg-accent-blue",
  "TensorFlow": "bg-success-green",
  "Flask": "bg-warning-orange"
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(0);

  const handleProjectSelect = (index: number) => {
    setSelectedProject(index);
  };

  return (
    <div className="flex-1 flex h-full">
      <LineNumbers count={30} />
      
      <div className="flex-1 p-4 overflow-y-auto h-full">
        <CodeBlock>
          <Comment>
            <span># Projects Portfolio Module</span><br />
            <span># Showcasing my development work</span>
          </Comment>
          
          <div>
            <Keyword>from</Keyword> <Type>portfolio</Type> <Keyword>import</Keyword> <Type>Project</Type><br />
            <Keyword>import</Keyword> <Type>creativity</Type> <Keyword>as</Keyword> <Type>magic</Type>
          </div>
          
          <div className="my-6">
            <div className="warning-orange mb-4">projects = [</div>
            
            {/* Project Cards Slider */}
            <div className="ml-4 space-y-6">
              {/* Horizontal Cards */}
              <div className="flex gap-4 overflow-x-auto pb-4">
                {projects.map((project, index) => (
                  <div 
                    key={project.id}
                    onClick={() => handleProjectSelect(index)}
                    className={`min-w-80 cursor-pointer transition-all ${
                      selectedProject === index ? 'scale-105' : 'opacity-70 hover:opacity-90'
                    }`}
                  >
                    <Card className={`bg-sidebar border-ide p-4 ${
                      selectedProject === index ? 'border-accent-blue' : ''
                    }`}>
                      <img 
                        src={project.image}
                        alt={project.title}
                        className="rounded-lg w-full h-32 object-cover border border-ide mb-3"
                      />
                      <h3 className="text-lg warning-orange mb-2">{project.title}</h3>
                      <div className="flex gap-2 flex-wrap">
                        {project.tech.map((tech) => (
                          <Badge 
                            key={tech}
                            className={`${techColors[tech]} text-white text-xs`}
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
              
              {/* Detailed View for Selected Project */}
              <Card className="bg-sidebar border-ide p-6 border-accent-blue">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <img 
                      src={projects[selectedProject].image}
                      alt={projects[selectedProject].title}
                      className="rounded-lg w-full h-64 object-cover border border-ide"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl warning-orange mb-3">{projects[selectedProject].title}</h3>
                    <p className="text-primary-ide mb-4 leading-relaxed">
                      {projects[selectedProject].description}
                    </p>
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {projects[selectedProject].tech.map((tech) => (
                        <Badge 
                          key={tech}
                          className={`${techColors[tech]} text-white`}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-2 text-accent-blue hover:text-warning-orange p-0 h-auto"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Live Demo</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-2 text-accent-blue hover:text-warning-orange p-0 h-auto"
                      >
                        <Github className="h-4 w-4" />
                        <span>View Code</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="warning-orange">]</div>
          </div>
        </CodeBlock>
      </div>
    </div>
  );
}
