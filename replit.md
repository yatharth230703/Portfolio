# Portfolio IDE Application

## Overview

This is a unique portfolio website built as an IDE-style interface, showcasing a developer's personal information, projects, experience, and contact details through a modern code editor layout. The application simulates a development environment with file explorers, tabs, terminals, and a chatbot assistant.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom IDE-themed color variables
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Style**: RESTful endpoints with JSON responses
- **Session Management**: Express sessions with PostgreSQL store

### Development Environment
- **IDE Theme**: Custom VS Code-inspired dark theme with syntax highlighting
- **Hot Reload**: Vite HMR integration with Express middleware
- **Error Handling**: Runtime error overlay for development
- **TypeScript**: Strict type checking across client, server, and shared modules

## Key Components

### IDE Interface Components
1. **File Explorer**: Displays portfolio sections as code files with language-specific icons
2. **Tab Bar**: Manages open file tabs with close functionality
3. **Monaco Editor Simulation**: Code block components that mimic syntax highlighting
4. **Terminal**: Interactive message sending interface styled as a terminal
5. **ChatBot**: Resume/LinkedIn context-aware assistant for visitor interactions

### Portfolio Content Pages
1. **Personal**: Developer profile information and contact links
2. **Projects**: Showcase of development projects with images and tech stacks
3. **Experience**: Professional work history with skills and achievements
4. **Contact**: Calendar integration for meeting scheduling

### UI Components
- Comprehensive shadcn/ui component library (40+ components)
- Custom IDE-themed styling with CSS variables
- Responsive design with mobile-first approach
- Accessibility features through Radix UI primitives

## Data Flow

### Client-Side Flow
1. User navigates through IDE interface (file explorer → tabs → content)
2. React Query handles API calls for chat messages and contact forms
3. Wouter manages routing between different portfolio sections
4. State updates trigger re-renders of IDE components

### Server-Side Flow
1. Express middleware handles request logging and error catching
2. Routes process chat messages and contact form submissions
3. Database operations through Drizzle ORM with type safety
4. Responses formatted as JSON with appropriate status codes

### Database Schema
- **users**: User management (id, username, password)
- **messages**: Contact form submissions (content, email, phone, status, timestamp)
- **chat_messages**: Chatbot conversation history (message, response, timestamp)

## External Dependencies

### Core Framework Dependencies
- React ecosystem: react, react-dom, react-router alternative (wouter)
- Build tools: vite, typescript, esbuild for production builds
- Styling: tailwindcss, postcss, autoprefixer

### UI and Component Libraries
- Radix UI: Complete set of unstyled, accessible UI primitives
- Class management: clsx, tailwind-merge for conditional styling
- Icons: lucide-react for consistent iconography
- Embla carousel: For image/content carousels

### Backend Dependencies
- Server: express, http for web server
- Database: drizzle-orm, @neondatabase/serverless
- Validation: zod with drizzle-zod for schema validation
- Session management: express-session, connect-pg-simple

### Development Tools
- TypeScript configuration for strict type checking
- Vite plugins for Replit integration and error handling
- Drizzle Kit for database migrations and schema management

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to static assets in `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Database Setup**: Drizzle migrations ensure schema consistency

### Environment Configuration
- Development: Vite dev server with Express middleware integration
- Production: Node.js serves bundled Express app with static file serving
- Database: PostgreSQL connection via environment variable

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (Neon serverless recommended)
- Environment variables for database connection
- Static file serving for frontend assets

### Development vs Production
- **Development**: Hot reload, error overlays, source maps, Replit integration
- **Production**: Optimized bundles, error logging, static asset serving
- **Database**: Same schema, different connection strings per environment

## Recent Changes

**January 21, 2025 - Compact UI & Layout Fixes**
- Reduced all UI elements by 30% for better content visibility without scrolling
- Made file explorer 20% smaller (w-48, smaller icons, text-xs)
- Made tab bar more compact (reduced padding, smaller fonts, smaller close buttons)
- Made terminal 33% smaller (h-32, compact button sizes)
- Made chatbot sidebar narrower (w-64, smaller avatars, text-xs)
- Made all page content more compact (smaller cards, reduced spacing, text-xs)
- Fixed terminal layout to span only middle section between file explorer and chatbot
- Ensured both sidebars extend full height to bottom of screen

**December 21, 2025 - IDE Layout Improvements**
- Fixed terminal footer to remain always visible at bottom of interface
- Made sidebar and chatbot extend full height with terminal between them  
- Replaced projects carousel with horizontal card slider and detailed expanded view
- Ensured all page content scrolls within IDE boundaries (contained layout)
- Backend message handling already implemented securely through Express API

The application architecture supports a unique portfolio presentation that engages visitors through an interactive coding environment while maintaining professional showcase standards.