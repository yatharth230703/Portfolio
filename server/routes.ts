import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";
import { Groq } from 'groq-sdk';
import path from 'path';
import { SocialMediaService } from "./socialMediaService";

// Function to get Groq client (will be called after dotenv loads)
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not set');
  }
  
  console.log('Initializing Groq client with API key length:', apiKey.length);
  console.log('API key starts with:', apiKey.substring(0, 10) + '...');
  return new Groq({ apiKey });
}

// System prompt for the AI assistant
const systemPrompt = `You are Yatharth Bisht's AI assistant. You have access to his professional background from LinkedIn and resume data.

**Your personality:**
- Act naturally and conversationally, like a helpful colleague
- Keep responses crisp and precise - avoid long lists and unnecessary details
- If a user's question is unclear or too broad, ask follow-up questions to understand what they really want to know
- Be engaging and curious about their needs

**Your knowledge:**
- You know about Yatharth's skills, experience, projects, education, and achievements
- Use this information naturally without mentioning "LinkedIn" or "Resume" sources
- Focus on being helpful rather than explaining where information comes from
- Whenever referencing information from the corpus that you have please keep in mind the timeline of the experiences he has , always use past tense for previous experiences and current tense for experiences that are till present (ongoing)


**Response style:**
- Keep it simple and direct
- If someone asks about skills, give 3-4 key ones, not a long list
- If they ask about projects, highlight 2-3 most relevant ones
- Ask clarifying questions when needed: "What specific aspect are you interested in?" or "Are you looking for technical skills or project experience?"

Current date: ${new Date().toISOString().split('T')[0]}`;

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Serve context files
  app.get('/ai_context_linkedin.json', (req, res) => {
    res.sendFile(path.resolve(import.meta.dirname, '..', 'client', 'public', 'ai_context_linkedin.json'));
  });
  
  app.get('/ai_context_resume.json', (req, res) => {
    res.sendFile(path.resolve(import.meta.dirname, '..', 'client', 'public', 'ai_context_resume.json'));
  });
  
  // Send message via terminal (Resend + Twilio + Slack integration)
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      
      // Get visitor information
      const visitorInfo = {
        ip: (req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'Unknown') as string,
        userAgent: req.headers['user-agent'] || 'Unknown'
      };
      
      try {
        // Initialize social media service and send to all platforms
        const socialMediaService = new SocialMediaService();
        const results = await socialMediaService.sendToAllPlatforms(messageData.content, visitorInfo);
        
        // Log results
        console.log("Social media sending results:", results);
        
        // Count successful and failed sends
        const successfulSends = results.filter(r => r.success);
        const failedSends = results.filter(r => !r.success);
        
        if (successfulSends.length > 0) {
          await storage.updateMessageStatus(message.id, "sent");
          
          res.json({ 
            success: true, 
            message: `Message sent successfully to ${successfulSends.length} platform(s)`,
            results: results,
            successfulCount: successfulSends.length,
            failedCount: failedSends.length,
            id: message.id 
          });
        } else {
          await storage.updateMessageStatus(message.id, "failed");
          res.status(500).json({ 
            error: "Failed to send message to any platform",
            results: results 
          });
        }
        
      } catch (error) {
        await storage.updateMessageStatus(message.id, "failed");
        console.error("Error in social media service:", error);
        res.status(500).json({ 
          error: "Failed to send message",
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // AI Chat Assistant with Groq
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, linkedinContext, resumeContext } = req.body;
      
      console.log('Chat request received:', { message, hasLinkedIn: !!linkedinContext, hasResume: !!resumeContext });
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!linkedinContext || !resumeContext) {
        return res.status(400).json({ error: "Context data is required" });
      }
      
      // Set headers for streaming
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      try {
        console.log('Calling Groq API...');
        const groq = getGroqClient();
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Here's the LinkedIn context: ${JSON.stringify(linkedinContext)}\n\nHere's the Resume context: ${JSON.stringify(resumeContext)}\n\nUser question: ${message}`
            }
          ],
          model: 'gemma2-9b-it',
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
          stream: true
        });

        console.log('Groq API response received, streaming...');
        // Stream the response with 30% slower speed
        for await (const chunk of chatCompletion) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            console.log('Streaming chunk:', content);
            res.write(`data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`);
            
            // Add delay to slow down streaming by 30%
            await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay between chunks
          }
        }
        
        // Send completion signal
        console.log('Streaming complete');
        res.write('data: [DONE]\n\n');
        res.end();
        
      } catch (groqError) {
        console.error('Groq API error:', groqError);
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: "Sorry, I encountered an error. Please try again." } }] })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
      }
      
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
