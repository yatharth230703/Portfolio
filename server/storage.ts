import { users, messages, chatMessages, type User, type InsertUser, type Message, type InsertMessage, type ChatMessage, type InsertChatMessage } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessageStatus(id: number, status: string): Promise<void>;
  getMessages(): Promise<Message[]>;
  createChatMessage(chatMessage: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private chatMessages: Map<number, ChatMessage>;
  private currentUserId: number;
  private currentMessageId: number;
  private currentChatMessageId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.chatMessages = new Map();
    this.currentUserId = 1;
    this.currentMessageId = 1;
    this.currentChatMessageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      id,
      content: insertMessage.content,
      email: insertMessage.email || null,
      phone: insertMessage.phone || null,
      sentAt: new Date(),
      status: "pending"
    };
    this.messages.set(id, message);
    return message;
  }

  async updateMessageStatus(id: number, status: string): Promise<void> {
    const message = this.messages.get(id);
    if (message) {
      message.status = status;
      this.messages.set(id, message);
    }
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const chatMessage: ChatMessage = {
      ...insertChatMessage,
      id,
      timestamp: new Date()
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values());
  }
}

export const storage = new MemStorage();
