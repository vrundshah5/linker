# Copilot Instructions

## Project: Linker

### Stack
- **Frontend** (`linker-fe`): React, TypeScript, Vite, Tailwind CSS
- **Backend** (`linker-be`): Node.js, Express, MongoDB (Mongoose)

### General Guidelines
- Use TypeScript strictly — avoid `any`
- Follow REST conventions for API routes
- Keep components small and focused (single responsibility)
- Use environment variables for all secrets and config — never hardcode

### Frontend (`linker-fe`)
- Use functional components with hooks
- Style exclusively with Tailwind CSS utility classes
- Keep API calls in a dedicated `src/services/` layer

### Backend (`linker-be`)
- Structure: `src/routes/`, `src/controllers/`, `src/models/`, `src/middleware/`
- Validate all incoming request data before processing
- Return consistent JSON response shapes: `{ success, data, message }`
