import { LineNumbers, CodeBlock, Comment, Keyword } from "@/components/ui/monaco-editor";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Code, GraduationCap, Building, Rocket, Palette, Brain, FileText, FlaskConical, Search, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface ExperienceData {
  [key: string]: {
    title: string;
    company_name: string;
    duration: string;
    description: {
      point1: string;
      point2: string;
      point3?: string;
    };
  };
}

const experienceIcons = [
  Briefcase, Code, GraduationCap, Building, Rocket, Palette, Brain, FileText, FlaskConical, Search, Zap
];

const companyIcons = [
  Building, Rocket, Palette, Brain, FileText, FlaskConical, Search, Zap, Briefcase, Code, GraduationCap
];

const colorClasses = [
  "accent-blue", "success-green", "warning-orange", "accent-purple", "accent-pink", "accent-cyan"
];

export default function Experience() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/professional_experience.json');
        const data: ExperienceData = await response.json();
        
        // Transform the data to match the component's expected format
        const transformedExperiences = Object.entries(data).map(([key, exp], index) => {
          // Systematic color assignment based on index to ensure consistency
          const colors = ['accent-pink', 'accent-purple', 'warning-orange', 'success-green', 'accent-blue', 'accent-cyan', 'accent-pink'];
          const color = colors[index % colors.length];
          
          return {
            id: index + 1,
            title: exp.title,
            company: exp.company_name,
            duration: exp.duration,
            description: exp.description.point1 + (exp.description.point2 ? ` ${exp.description.point2}` : '') + (exp.description.point3 ? ` ${exp.description.point3}` : ''),
            skills: extractSkills(exp.description),
            icon: experienceIcons[index % experienceIcons.length],
            companyIcon: companyIcons[index % companyIcons.length],
            color: color
          };
        });
        
        setExperiences(transformedExperiences);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const extractSkills = (description: { point1: string; point2: string; point3?: string }) => {
    const allText = `${description.point1} ${description.point2} ${description.point3 || ''}`;
    const skillKeywords = [
      'AI', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'LLM', 'Large Language Models',
      'React', 'TypeScript', 'Node.js', 'Python', 'JavaScript', 'Fullstack', 'Frontend', 'Backend',
      'API', 'Cloud', 'Deployment', 'Testing', 'Data Collection', 'Preprocessing', 'Finetuning',
      'Automation', 'Marketing', 'Workflows', 'Integration', 'Research', 'Technical Writing',
      'Documentation', 'Object Detection', 'Waste Classification', 'Lead Management', 'Form Generation'
    ];
    
    return skillKeywords.filter(skill => 
      allText.toLowerCase().includes(skill.toLowerCase())
    ).slice(0, 3); // Limit to 3 skills per experience
  };

  const skillColors: Record<string, string> = {
    // AI & ML Related Skills - Blue Tones
    "AI": "bg-accent-blue",
    "Machine Learning": "bg-accent-blue",
    "Deep Learning": "bg-accent-blue",
    "Computer Vision": "bg-accent-blue",
    "LLM": "bg-accent-blue",
    "Large Language Models": "bg-accent-blue",
    "Object Detection": "bg-accent-blue",
    "Waste Classification": "bg-accent-blue",
    
    // Development Skills - Green Tones
    "React": "bg-success-green",
    "TypeScript": "bg-success-green",
    "JavaScript": "bg-success-green",
    "Fullstack": "bg-success-green",
    "Frontend": "bg-success-green",
    "Backend": "bg-success-green",
    "Integration": "bg-success-green",
    "Form Generation": "bg-success-green",
    
    // Infrastructure & Tools - Orange Tones
    "Node.js": "bg-warning-orange",
    "API": "bg-warning-orange",
    "Cloud": "bg-warning-orange",
    "Deployment": "bg-warning-orange",
    "Testing": "bg-warning-orange",
    "Finetuning": "bg-warning-orange",
    
    // Business & Content - Purple Tones
    "Automation": "bg-accent-purple",
    "Marketing": "bg-accent-purple",
    "Workflows": "bg-accent-purple",
    "Technical Writing": "bg-accent-purple",
    "Documentation": "bg-accent-purple",
    "Lead Management": "bg-accent-purple",
    
    // Research & Data - Cyan Tones
    "Research": "bg-accent-cyan",
    "Data Collection": "bg-accent-cyan",
    "Preprocessing": "bg-accent-cyan",
    "Python": "bg-accent-cyan"
  };

  if (loading) {
    return (
      <div className="flex-1 flex h-full">
        <LineNumbers count={30} />
        <div className="flex-1 p-4 overflow-y-auto h-full">
          <CodeBlock>
            <Comment>
              <span>// Loading professional experience...</span>
            </Comment>
          </CodeBlock>
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
            <span>// Professional Experience Timeline</span><br />
            <span>// Career Journey & Achievements</span>
          </Comment>
          
          <div>
            <Keyword>#include</Keyword> <span className="success-green">&lt;experience.h&gt;</span><br />
            <Keyword>#include</Keyword> <span className="success-green">&lt;growth.h&gt;</span>
          </div>
          
          <div className="my-6">
            <div className="warning-orange mb-4">class CareerTimeline {"{"}</div>
            <div className="ml-4 text-secondary-ide">public:</div>
            
            {/* Timeline Container */}
            <div className="ml-8 space-y-3 relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-accent-blue"></div>
              
              {experiences.map((exp, index) => {
                const IconComponent = exp.icon;
                const CompanyIconComponent = exp.companyIcon;
                
                // Get background color class based on exp.color
                const getBackgroundClass = (color: string) => {
                  switch (color) {
                    case 'accent-pink': return 'bg-accent-pink';
                    case 'accent-purple': return 'bg-accent-purple';
                    case 'warning-orange': return 'bg-warning-orange';
                    case 'success-green': return 'bg-success-green';
                    case 'accent-blue': return 'bg-accent-blue';
                    case 'accent-cyan': return 'bg-accent-cyan';
                    default: return 'bg-accent-blue';
                  }
                };
                
                return (
                  <div key={exp.id} className="flex gap-2 sm:gap-3 relative">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${getBackgroundClass(exp.color)}`}>
                      <IconComponent className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                    </div>
                    <Card className="flex-1 bg-sidebar border-ide p-2 sm:p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs sm:text-sm warning-orange truncate">{exp.title}</h3>
                          <p className="accent-blue text-xs truncate">{exp.company}</p>
                          <p className="text-secondary-ide text-xs">{exp.duration}</p>
                        </div>
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center flex-shrink-0 ${getBackgroundClass(exp.color)}`}>
                          <CompanyIconComponent className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                        </div>
                      </div>
                      <p className="text-primary-ide mb-2 text-xs break-words">
                        {exp.description}
                      </p>
                      <div className="flex gap-1 flex-wrap">
                        {exp.skills.map((skill: string) => (
                          <Badge 
                            key={skill}
                            className={`${skillColors[skill] || 'bg-accent-blue'} text-white text-xs`}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
            
            <div className="warning-orange">{"};"}</div>
          </div>
        </CodeBlock>
      </div>
    </div>
  );
}
