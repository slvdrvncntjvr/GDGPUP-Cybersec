# Startup Guide

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **PostgreSQL database** (optional, if using database features)

## Project Overview

This is a full-stack TypeScript application built with:
- **Frontend**: React 18 + Vite + TailwindCSS + shadcn/ui
- **Backend**: Express.js
- **Database**: Drizzle ORM with PostgreSQL (Neon)
- **State Management**: TanStack React Query
- **Authentication**: Passport.js

## Getting Started

### 1. Navigate to Project Directory

```bash
cd "c:\Users\Vincent\GDG Cybersec\InteractiveModern\InteractiveModern"
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages (~472 packages).

### 3. Configure Database (Optional)

If you plan to use database features:

1. Set up your database connection in `drizzle.config.ts`
2. Push the schema to your database:

```bash
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

This command:
- Starts the Express backend server
- Runs Vite dev server for hot module replacement
- Serves the application on **http://localhost:5000**

### 5. Access the Application

Open your browser and navigate to:

```
http://localhost:5000
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (frontend + backend) |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push database schema changes |

## Application Routes

- `/` - Home page with hero, features, and CTA sections
- `/rooms` - Cybersecurity challenge rooms

## Troubleshooting

### Port Already in Use

If port 5000 is already in use, you'll see an error. Either:
- Stop the process using port 5000
- Or modify the port in `server/index.ts`

### Database Connection Issues

- Ensure your database credentials are correctly configured in `drizzle.config.ts`
- Verify your database server is running

### Build Errors

If you encounter build errors:
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

## Project Structure

```
InteractiveModern/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilities
│   └── index.html
├── server/              # Express backend
│   ├── index.ts         # Main server file
│   ├── routes.ts        # API routes
│   └── storage.ts       # Database storage
├── shared/              # Shared types/schemas
└── package.json         # Dependencies & scripts
```

## Notes

- The application uses session-based authentication
- Hot module replacement is enabled in development
- TailwindCSS is configured for styling
- All UI components are from shadcn/ui library
