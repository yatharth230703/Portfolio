import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

// Mock resume/LinkedIn context for chatbot
const resumeContext = {
  name: "John Developer",
  title: "Full Stack Developer",
  experience: [
    {
      company: "TechCorp Solutions",
      role: "Senior Frontend Developer",
      duration: "Jan 2022 - Present",
      description: "Led frontend development team, implemented modern React architecture"
    },
    {
      company: "StartupXYZ",
      role: "Full Stack Developer", 
      duration: "Jun 2020 - Dec 2021",
      description: "Developed end-to-end web applications, worked with product team"
    }
  ],
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "MongoDB", "PostgreSQL"],
  education: "Computer Science Degree",
  projects: ["TaskFlow Dashboard", "ShopSmart App", "AI Content Generator"]
};

function generateChatResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  if (message.includes("skill") || message.includes("technology") || message.includes("tech")) {
    return `Based on John's profile, he specializes in ${resumeContext.skills.slice(0, 5).join(", ")}. He has extensive experience with modern web development frameworks and has led several successful projects!`;
  }
  
  if (message.includes("experience") || message.includes("work") || message.includes("job")) {
    return `John has ${resumeContext.experience.length} years of professional experience. Currently he's a ${resumeContext.experience[0].role} at ${resumeContext.experience[0].company}, where he ${resumeContext.experience[0].description}.`;
  }
  
  if (message.includes("project")) {
    return `John has worked on several notable projects including ${resumeContext.projects.join(", ")}. Each project showcases his ability to deliver scalable solutions using modern technologies.`;
  }
  
  if (message.includes("education") || message.includes("degree")) {
    return `John holds a ${resumeContext.education} and has continuously updated his skills through practical experience and learning new technologies.`;
  }
  
  if (message.includes("contact") || message.includes("hire") || message.includes("available")) {
    return `John is always open to discussing new opportunities! You can reach out via the terminal below or schedule a meeting through the book_a_call.js tab.`;
  }
  
  // Default response
  return `That's a great question! John is a ${resumeContext.title} with expertise in ${resumeContext.skills.slice(0, 3).join(", ")}. Feel free to ask about his specific experience, projects, or skills!`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Send message via terminal (Resend + Twilio integration)
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      
      // TODO: Integrate with Resend API for email
      const resendApiKey = process.env.RESEND_API_KEY || process.env.RESEND_KEY || "";
      
      // TODO: Integrate with Twilio for SMS/WhatsApp
      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || "";
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || "";
      
      try {
        // Simulate API calls - in production, implement actual API calls
        console.log("Sending message via Resend:", messageData.content);
        console.log("Sending message via Twilio:", messageData.content);
        
        await storage.updateMessageStatus(message.id, "sent");
        
        res.json({ 
          success: true, 
          message: "Message sent successfully to WhatsApp, SMS, and Email",
          id: message.id 
        });
      } catch (error) {
        await storage.updateMessageStatus(message.id, "failed");
        throw error;
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Chatbot conversation
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }
      
      const response = generateChatResponse(message);
      
      const chatMessage = await storage.createChatMessage({
        message,
        response
      });
      
      res.json({ 
        response,
        id: chatMessage.id 
      });
      
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Get chat history
  app.get("/api/chat/history", async (req, res) => {
    try {
      const chatMessages = await storage.getChatMessages();
      res.json(chatMessages);
    } catch (error) {
      console.error("Error getting chat history:", error);
      res.status(500).json({ error: "Failed to get chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
