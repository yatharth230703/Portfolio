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
          <div className="ml-4 space-y-6">
            <Card className="bg-sidebar border-ide p-6">
              <h2 className="text-xl warning-orange mb-4">Schedule a Meeting</h2>
              <p className="text-secondary-ide mb-6">
                Let's discuss your project, collaboration opportunities, or just have a chat about technology. 
                Choose a time that works for you!
              </p>
              
              {/* Mock Calendar Widget */}
              <Card className="bg-editor border-ide p-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg text-primary-ide">Available Time Slots</h3>
                  <p className="text-secondary-ide text-sm">Select a convenient time for our meeting</p>
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center text-secondary-ide text-sm p-2">{day}</div>
                  ))}
                  
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((date) => (
                    <div
                      key={date}
                      className={`text-center p-2 rounded cursor-pointer ${
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
                <div className="space-y-2">
                  <div className="text-secondary-ide text-sm mb-2">Available times for selected date:</div>
                  <div className="flex gap-2 flex-wrap">
                    {["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"].map((time) => (
                      <Button
                        key={time}
                        size="sm"
                        className="bg-success-green hover:bg-green-600 text-white"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Calendly Integration Button */}
                <div className="mt-6 text-center">
                  <Button 
                    size="lg"
                    className="bg-accent-blue hover:bg-blue-600 text-white"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Meeting via Calendly
                  </Button>
                </div>
              </Card>
              
              {/* Meeting Types */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {meetingTypes.map((type, index) => {
                  const IconComponent = type.icon;
                  return (
                    <Card key={index} className="bg-editor border-ide p-4">
                      <div className={`text-${type.color} text-lg mb-2`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h4 className="warning-orange mb-1">{type.title}</h4>
                      <p className="text-secondary-ide text-sm">{type.duration}</p>
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
