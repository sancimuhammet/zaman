# Life Simulation Application

## Overview

This is a React-based life simulation application that helps users explore alternative life choices through AI-powered scenario analysis. The application allows users to input their current situation, goals, and personal information, then generates detailed simulations comparing their current path with alternative life choices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API design
- **Middleware**: Custom logging and error handling middleware

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured through Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Active Storage**: DatabaseStorage implementation using PostgreSQL for persistent data
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Fallback API**: Demo endpoint (/api/simulations/demo) for testing purposes

### Authentication and Authorization
- No authentication system is currently implemented in the codebase
- Session management infrastructure is prepared but not actively used

## Key Components

### Database Schema (`shared/schema.ts`)
- **Simulations Table**: Stores user simulations with personal details, scenarios, and AI-generated results
- **Fields**: ID, title, current situation, goals, alternative choice, demographics, personality traits, results (JSON), category, success rate, timestamps
- **Validation**: Zod schemas for form validation and data integrity

### API Endpoints (`server/routes.ts`)
- `GET /api/simulations` - Retrieve all simulations
- `GET /api/simulations/:id` - Get specific simulation
- `POST /api/simulations` - Create and process new simulation
- Integration with Google Gemini AI API for generating simulation results

### Frontend Components
- **SimulationForm**: Multi-step form for collecting user input
- **LoadingSimulation**: Visual feedback during AI processing
- **SimulationResults**: Detailed display of simulation outcomes
- **SimulationHistory**: Browse and filter past simulations
- **ProgressSteps**: Custom progress indicator component

### UI System
- Comprehensive design system using shadcn/ui
- Dark/light theme support through CSS variables
- Mobile-responsive design patterns
- Consistent styling with Tailwind CSS

## Data Flow

1. **User Input**: User fills out simulation form with personal details and scenarios
2. **Validation**: Client-side validation using Zod schemas
3. **API Processing**: Form data sent to backend API endpoint
4. **AI Integration**: Google Gemini AI API generates simulation results based on user input
5. **Data Storage**: Simulation and results stored in PostgreSQL database
6. **Result Display**: Formatted results displayed to user with comparison metrics
7. **History Management**: Past simulations stored and retrievable for future reference

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18+ with modern hooks and concurrent features
- **Database**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **AI Integration**: Google Gemini AI API for generating simulation content
- **UI Components**: Extensive Radix UI component library for accessible interfaces

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Fast development server with HMR and optimized builds
- **ESBuild**: Production bundling for backend code
- **Drizzle Kit**: Database migrations and schema management

### Styling and Design
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: Dynamic theming support
- **Responsive Design**: Mobile-first approach with breakpoint utilities

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles Node.js server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `drizzle-kit push`

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Google Gemini API key configuration for AI features
- Production/development environment detection

### Server Setup
- Express server serves both API endpoints and static frontend files
- Development mode includes Vite middleware for HMR
- Production mode serves pre-built static assets
- Custom error handling and request logging middleware

### Database Requirements
- PostgreSQL database (Neon Database recommended for serverless deployment)
- Automatic schema synchronization via Drizzle
- Migration support for schema evolution

The application is designed for easy deployment on platforms like Replit, with development and production configurations optimized for different environments.

## Recent Changes

### January 22, 2025
- ✓ Migrated from OpenAI API to Google Gemini AI API
- ✓ Removed OpenAI dependency and updated all AI integrations
- ✓ Enhanced error handling in SimulationResults component with null-safe operations
- ✓ Updated response schema validation for Gemini API
- ✓ Configured proper JSON response formatting for better consistency
- ✓ Migrated from PostgreSQL to Firebase Firestore for easier data management
- ✓ Improved AI prompts to be more intelligent and data-driven (no more automatic "10 years")
- ✓ Updated AI writing style to be more conversational, concise, and natural (per user feedback)
- ✓ Fixed Vercel deployment issues - restructured project for proper static hosting
- ✓ Created separate client/package.json for frontend-only builds
- ✓ Converted API endpoints to vanilla JavaScript for better Vercel compatibility
- ✓ Resolved Git remote configuration issues in Replit environment