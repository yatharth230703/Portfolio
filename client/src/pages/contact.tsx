import { LineNumbers, CodeBlock, Comment, Keyword } from "@/components/ui/monaco-editor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Handshake, Users, Calendar } from "lucide-react";

const meetingTypes = [
  {
    icon: Coffee,
    title: "Coffee Chat",
    duration: "15 min casual conversation",
    color: "accent-blue"
  },
  {
    icon: Handshake,
    title: "Project Discussion", 
    duration: "30 min project consultation",
    color: "success-green"
  },
  {
    icon: Users,
    title: "Team Meeting",
    duration: "60 min team consultation", 
    color: "warning-orange"
  }
];

export default function Contact() {
  return (
    <div className="flex-1 flex h-full">
      <LineNumbers count={30} />
      
      <div className="flex-1 p-4 overflow-y-auto h-full">
        <CodeBlock>
          <Comment>
            <span>// Book a Call - Calendar Integration</span><br />
            <span>// Schedule meetings and consultations</span>
          </Comment>
          
          <div>
            <Keyword>const</Keyword> <span className="warning-orange">calendlyConfig</span> = {"{"}
          </div>
          
          {/* Calendar Integration */}
          <div className="ml-4 space-y-3">
            <Card className="bg-sidebar border-ide p-3">
              <h2 className="text-lg warning-orange mb-2">Schedule a Meeting</h2>
              <p className="text-secondary-ide mb-3 text-xs">
                Let's discuss your project, collaboration opportunities, or just have a chat about technology. 
                Choose a time that works for you!
              </p>
              
              {/* Mock Calendar Widget */}
              <Card className="bg-editor border-ide p-3">
                <div className="text-center mb-3">
                  <h3 className="text-sm text-primary-ide">Available Time Slots</h3>
                  <p className="text-secondary-ide text-xs">Select a convenient time for our meeting</p>
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center text-secondary-ide text-xs p-1">{day}</div>
                  ))}
                  
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((date) => (
                    <div
                      key={date}
                      className={`text-center p-1 rounded cursor-pointer text-xs ${
                        [4, 5, 8, 10, 11, 12].includes(date)
                          ? 'bg-accent-blue text-white hover:bg-blue-600'
                          : 'text-secondary-ide'
                      }`}
                    >
                      {date}
                    </div>
                  ))}
                </div>
                
                {/* Time Slots */}
                <div className="space-y-1">
                  <div className="text-secondary-ide text-xs mb-1">Available times:</div>
                  <div className="flex gap-1 flex-wrap">
                    {["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"].map((time) => (
                      <Button
                        key={time}
                        size="sm"
                        className="bg-success-green hover:bg-green-600 text-white h-6 px-2 text-xs"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Calendly Integration Button */}
                <div className="mt-3 text-center">
                  <Button 
                    size="sm"
                    className="bg-accent-blue hover:bg-blue-600 text-white text-xs"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Book Meeting via Calendly
                  </Button>
                </div>
              </Card>
              
              {/* Meeting Types */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                {meetingTypes.map((type, index) => {
                  const IconComponent = type.icon;
                  return (
                    <Card key={index} className="bg-editor border-ide p-2">
                      <div className={`text-${type.color} text-sm mb-1`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <h4 className="warning-orange mb-0.5 text-xs">{type.title}</h4>
                      <p className="text-secondary-ide text-xs">{type.duration}</p>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </div>
          
          <div>
            <Keyword>{"};"}  </Keyword>
          </div>
        </CodeBlock>
      </div>
    </div>
  );
}
