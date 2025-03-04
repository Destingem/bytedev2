# ByteDev2 Development Guide

## Commands
- `yarn dev` - Run development server with turbopack
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Code Style Guidelines
- **TypeScript**: Strict mode, explicit interfaces for props and data models
- **Components**: "use client" directive at top, React.forwardRef for form components, displayName property
- **Imports**: React first, third-party libs next, local imports (@/*) last with line breaks between groups
- **Naming**: PascalCase for components/interfaces, camelCase for variables/functions
- **Formatting**: Functional components with arrow function syntax
- **Styling**: Tailwind CSS with cn() utility for conditional classes
- **Error Handling**: try/catch blocks, explicit error states, console.error for logging, fallback content

## Project Structure
- `/app` - Next.js app router files (pages, layouts, API routes)
- `/components` - Reusable React components
- `/lib` - Services and utilities
- `/types` - TypeScript interfaces/types
- `/utils` - Helper functions and utilities

## Best Practices
- Always destructure props in function parameters
- Set displayName for components that use forwardRef
- Use explicit error handling with descriptive messages
- Follow API route pattern with request validation and appropriate status codes