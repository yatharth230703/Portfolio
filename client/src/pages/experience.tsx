import { LineNumbers, CodeBlock, Comment, Keyword } from "@/components/ui/monaco-editor";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Code, GraduationCap, Building, Rocket, Palette } from "lucide-react";

const experiences = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    duration: "Jan 2022 - Present",
    description: "Led the frontend development team in building scalable React applications. Implemented modern architecture patterns and mentored junior developers.",
    skills: ["React", "TypeScript", "Team Lead"],
    icon: Briefcase,
    companyIcon: Building,
    color: "accent-blue"
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "StartupXYZ",
    duration: "Jun 2020 - Dec 2021",
    description: "Developed end-to-end web applications from concept to deployment. Worked closely with product team to deliver user-centric solutions.",
    skills: ["Node.js", "MongoDB", "AWS"],
    icon: Code,
    companyIcon: Rocket,
    color: "success-green"
  },
  {
    id: 3,
    title: "Frontend Developer Intern",
    company: "Digital Agency Inc",
    duration: "Jan 2020 - May 2020",
    description: "Built responsive websites and learned modern frontend development practices. Collaborated with design team to implement pixel-perfect UIs.",
    skills: ["HTML/CSS", "JavaScript", "jQuery"],
    icon: GraduationCap,
    companyIcon: Palette,
    color: "warning-orange"
  }
];

const skillColors: Record<string, string> = {
  "React": "bg-accent-blue",
  "TypeScript": "bg-success-green",
  "Team Lead": "bg-warning-orange",
  "Node.js": "bg-accent-blue",
  "MongoDB": "bg-success-green",
  "AWS": "bg-warning-orange",
  "HTML/CSS": "bg-accent-blue",
  "JavaScript": "bg-success-green",
  "jQuery": "bg-warning-orange"
};

export default function Experience() {
  return (
    <div className="flex-1 flex h-full">
      <LineNumbers count={30} />
      
      <div className="flex-1 p-4 overflow-y-auto h-full">
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
            <div className="ml-8 space-y-6 relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-accent-blue"></div>
              
              {experiences.map((exp, index) => {
                const IconComponent = exp.icon;
                const CompanyIconComponent = exp.companyIcon;
                
                return (
                  <div key={exp.id} className="flex gap-6 relative">
                    <div className={`w-12 h-12 bg-${exp.color} rounded-full flex items-center justify-center flex-shrink-0 relative z-10`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <Card className="flex-1 bg-sidebar border-ide p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg warning-orange">{exp.title}</h3>
                          <p className="accent-blue">{exp.company}</p>
                          <p className="text-secondary-ide text-sm">{exp.duration}</p>
                        </div>
                        <div className={`w-12 h-12 bg-${exp.color} rounded flex items-center justify-center`}>
                          <CompanyIconComponent className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <p className="text-primary-ide mb-3">
                        {exp.description}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {exp.skills.map((skill) => (
                          <Badge 
                            key={skill}
                            className={`${skillColors[skill]} text-white text-xs`}
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
