import { useState, useEffect, useRef } from "react";
import { LineNumbers, CodeBlock, Comment, Keyword, Type } from "@/components/ui/monaco-editor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";

// ABOUTME: Projects portfolio component with cascading carousel and category filtering
// ABOUTME: Displays projects from projects.json with responsive design and interactive selection

interface Project {
  title: string;
  description: string;
  display_tech_stack: string;
  link: string;
  image: string;
  category: string;
}

interface ProjectsData {
  [key: string]: Project;
}

const categories = [
  { key: "all", label: "All Projects", color: "bg-accent-blue" },
  { key: "fullstack", label: "Fullstack", color: "bg-success-green" },
  { key: "AI-Automation", label: "AI Automation", color: "bg-warning-orange" },
  { key: "Machine Learning ( ML/DL/CV/GenAI)", label: "Machine Learning", color: "bg-purple-500" }
];

const techColors: Record<string, string> = {
  "React": "bg-accent-blue",
  "TypeScript": "bg-accent-blue", 
  "Node.js": "bg-success-green",
  "Python": "bg-warning-orange",
  "JavaScript": "bg-warning-orange",
  "Express": "bg-success-green",
  "MongoDB": "bg-success-green",
  "PostgreSQL": "bg-success-green",
  "Firebase": "bg-warning-orange",
  "TensorFlow": "bg-purple-500",
  "OpenAI": "bg-purple-500",
  "Machine Learning": "bg-purple-500",
  "AI": "bg-purple-500",
  "Automation": "bg-warning-orange"
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Load projects data
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/projects.json');
        const data: ProjectsData = await response.json();
        const projectsArray = Object.values(data);
        setProjects(projectsArray);
        if (projectsArray.length > 0) {
          setSelectedProject(projectsArray[0]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading projects:', error);
        setIsLoading(false);
      }
    };
    loadProjects();
  }, []);

  // Filter projects by category
  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  // Get project count for each category
  const getProjectCount = (categoryKey: string) => {
    if (categoryKey === "all") return projects.length;
    return projects.filter(project => project.category === categoryKey).length;
  };

  // Get tech stack as array
  const getTechStack = (techStack: string) => {
    return techStack.split(', ').slice(0, 4); // Limit to 4 tech items
  };

  // Get tech color
  const getTechColor = (tech: string) => {
    const normalizedTech = tech.trim();
    return techColors[normalizedTech] || "bg-gray-500";
  };

  // Carousel navigation
  const maxVisible = 4;
  const maxIndex = Math.max(0, filteredProjects.length - maxVisible);
  
  const handlePrev = () => {
    setCarouselIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const handleProjectSelect = (project: Project) => {
    if (project.title === selectedProject?.title) return; // Don't animate if same project
    
    setIsAnimating(true);
    setSelectedProject(project);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCarouselIndex(0);
    // Select first project in new category
    const newFilteredProjects = category === "all" 
      ? projects 
      : projects.filter(project => project.category === category);
    if (newFilteredProjects.length > 0) {
      setSelectedProject(newFilteredProjects[0]);
    }
  };

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart;
    setDragOffset(deltaX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Determine if we should move to next/previous based on drag distance
    const threshold = 50;
    if (dragOffset > threshold && carouselIndex > 0) {
      setCarouselIndex(prev => prev - 1);
    } else if (dragOffset < -threshold && carouselIndex < maxIndex) {
      setCarouselIndex(prev => prev + 1);
    }
    
    setDragOffset(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - dragStart;
    setDragOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Determine if we should move to next/previous based on drag distance
    const threshold = 50;
    if (dragOffset > threshold && carouselIndex > 0) {
      setCarouselIndex(prev => prev - 1);
    } else if (dragOffset < -threshold && carouselIndex < maxIndex) {
      setCarouselIndex(prev => prev + 1);
    }
    
    setDragOffset(0);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex h-full">
        <LineNumbers count={30} />
        <div className="flex-1 p-4 overflow-y-auto h-full flex items-center justify-center">
          <div className="text-primary-ide">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <LineNumbers count={30} />
      
      <div className="flex-1 p-2 sm:p-4 overflow-y-auto h-full">
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
            
            {/* Category Filter */}
            <div className="ml-4 mb-6">
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category.key}
                    variant="ghost"
                    onClick={() => handleCategoryChange(category.key)}
                    className={`text-xs px-2 sm:px-3 py-1 h-auto transition-all ${
                      selectedCategory === category.key
                        ? `${category.color} text-white`
                        : 'text-primary-ide hover:text-warning-orange'
                    }`}
                  >
                    <span className="hidden sm:inline">{category.label}</span>
                    <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                    <span className="ml-1">({getProjectCount(category.key)})</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Cascading Carousel */}
            <div className="ml-4 space-y-4">
              {/* Carousel Container */}
              <div className="relative">
                {/* Navigation Arrows */}
                {filteredProjects.length > maxVisible && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePrev}
                      disabled={carouselIndex === 0}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-sidebar/95 backdrop-blur-sm border-2 border-accent-blue hover:bg-accent-blue/20 hover:border-warning-orange shadow-lg hover:shadow-xl transition-all duration-200 p-1 h-8 w-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4 text-accent-blue font-bold" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNext}
                      disabled={carouselIndex >= maxIndex}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-sidebar/95 backdrop-blur-sm border-2 border-accent-blue hover:bg-accent-blue/20 hover:border-warning-orange shadow-lg hover:shadow-xl transition-all duration-200 p-1 h-8 w-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4 text-accent-blue font-bold" />
                    </Button>
                  </>
                )}

                {/* Project Preview Cards */}
                <div 
                  ref={carouselRef}
                  className="flex overflow-hidden cursor-grab active:cursor-grabbing"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    transform: `translateX(${dragOffset}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease'
                  }}
                >
                  {filteredProjects
                    .slice(carouselIndex, carouselIndex + maxVisible)
                    .map((project, index) => (
                      <div 
                        key={project.title}
                        onClick={() => !isDragging && handleProjectSelect(project)}
                        className={`flex-1 cursor-pointer transition-all duration-300 ${
                          selectedProject?.title === project.title 
                            ? 'scale-105' 
                            : 'opacity-70 hover:opacity-90'
                        }`}
                      >
                        <Card className={`bg-sidebar border-ide p-2 sm:p-3 h-full mx-1 transition-all duration-300 min-h-[120px] sm:min-h-[140px] ${
                          selectedProject?.title === project.title 
                            ? 'border-accent-blue shadow-lg ring-2 ring-accent-blue/20' 
                            : 'hover:border-warning-orange hover:shadow-md'
                        }`}>
                          <img 
                            src={project.image}
                            alt={project.title}
                            className="rounded-lg w-full h-20 sm:h-24 object-cover border border-ide mb-2 sm:mb-3"
                          />
                          <h3 className="text-xs sm:text-sm warning-orange mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2rem]">{project.title}</h3>
                          <div className="hidden sm:flex gap-1 flex-wrap min-h-0">
                            {getTechStack(project.display_tech_stack).map((tech) => (
                              <Badge 
                                key={tech}
                                className={`${getTechColor(tech)} text-white text-xs px-1 py-0.5 flex-shrink-0 max-w-full truncate tech-badge`}
                              >
                                <span className="truncate">{tech}</span>
                              </Badge>
                            ))}
                          </div>
                        </Card>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* Detailed Project View */}
              {selectedProject && (
                <Card className={`bg-sidebar border-ide p-3 sm:p-4 border-accent-blue transition-all duration-500 ease-out ${
                  isAnimating 
                    ? 'animate-in slide-in-from-bottom-4 fade-in-0' 
                    : 'animate-in slide-in-from-bottom-2 fade-in-0'
                }`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className={`transition-all duration-500 ease-out ${
                      isAnimating ? 'animate-in slide-in-from-left-4 fade-in-0' : ''
                    }`}>
                      <img 
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        className="rounded-lg w-full h-40 sm:h-48 object-cover border border-ide"
                      />
                    </div>
                    <div className={`transition-all duration-500 ease-out delay-100 ${
                      isAnimating ? 'animate-in slide-in-from-right-4 fade-in-0' : ''
                    }`}>
                      <h3 className="text-lg sm:text-xl warning-orange mb-3">{selectedProject.title}</h3>
                      <p className="text-primary-ide mb-4 leading-relaxed text-xs sm:text-sm">
                        {selectedProject.description}
                      </p>
                      <div className="flex gap-1 mb-4 flex-wrap min-h-0">
                        {getTechStack(selectedProject.display_tech_stack).map((tech) => (
                          <Badge 
                            key={tech}
                            className={`${getTechColor(tech)} text-white text-xs px-1 py-0.5 flex-shrink-0 max-w-full truncate tech-badge`}
                          >
                            <span className="truncate">{tech}</span>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-2 text-accent-blue hover:text-warning-orange p-0 h-auto text-xs sm:text-sm"
                          onClick={() => window.open(selectedProject.link, '_blank')}
                        >
                          <Github className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>View Code</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
            
            <div className="warning-orange">]</div>
          </div>
        </CodeBlock>
      </div>
    </div>
  );
}
