# CLAUDE.md - AI Assistant Guide for StarVoyage (星航成长营)

This document provides essential context for AI assistants working on this codebase.

## Project Overview

**StarVoyage (星航成长营)** is a habit-tracking and parenting support platform designed for children. It helps families build positive habits through gamification, AI-powered advice, and community features.

**Target Audience**: Chinese-speaking families with children (UI is primarily in Chinese)

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15.2.4 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4.17 + Shadcn UI (Radix) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email, Google, GitHub) |
| AI | OpenAI via OpenRouter API |
| Image Gen | Replicate API |
| Analytics | Plausible Analytics |
| Deployment | Vercel (Hong Kong region) |

## Directory Structure

```
habbit-vercel/
├── app/                      # Next.js App Router pages
│   ├── api/                  # REST API endpoints
│   │   ├── advisor/          # AI parenting advice
│   │   ├── habits/           # Habit CRUD
│   │   ├── rewards/          # Reward management
│   │   ├── community/        # Posts/comments
│   │   └── user/             # User profile
│   ├── activities/           # Games & activities
│   ├── advisor/              # AI advisor page
│   ├── auth/                 # Auth pages & callbacks
│   ├── community/            # Parent forum
│   ├── habits/               # Habit tracking
│   ├── notifications/        # Notification center
│   ├── rewards/              # Reward redemption
│   ├── salon/                # Avatar customization
│   ├── settings/             # User settings
│   ├── statistics/           # Analytics dashboard
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── page.tsx              # Home/dashboard
│
├── components/               # React components
│   ├── ui/                   # Shadcn UI primitives
│   ├── auth/                 # Auth components
│   ├── auth-provider.tsx     # Auth context (826 lines)
│   ├── providers.tsx         # App providers (367 lines)
│   ├── main-dashboard.tsx    # Main dashboard
│   └── simple-navigation.tsx # Nav bar
│
├── lib/                      # Utilities
│   ├── supabase/             # Supabase clients
│   │   ├── client.ts         # Browser client
│   │   ├── server.ts         # Server client
│   │   └── safe-client.ts    # Safe wrapper
│   ├── database.ts           # DB operations (CRUD)
│   ├── openai.ts             # AI advisor logic
│   ├── analytics.ts          # Plausible wrapper
│   ├── app-mode.ts           # Environment detection
│   ├── env.ts                # Env configuration
│   ├── error-handler.ts      # Error utilities
│   └── safe-storage.ts       # LocalStorage wrapper
│
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript definitions
│   └── database.ts           # Supabase schema types
├── supabase/                 # Supabase config & migrations
├── public/                   # Static assets
├── scripts/                  # Automation scripts
└── styles/                   # Additional styles
```

## Development Commands

```bash
# Development
npm run dev                   # Start dev server
npm run dev:prod              # Dev with production env
npm run build                 # Production build
npm run lint                  # Run ESLint
npm run type-check            # TypeScript validation
npm run clean                 # Remove .next, out

# Environment
npm run setup-env             # Interactive env setup
npm run setup-env:dev         # Development env
npm run setup-env:prod        # Production env
npm run check-env             # Verify env config

# Testing
npm run test-ai               # Test AI advisor
npm run test-ai-full          # Full advisor test
npm run test-parenting        # Test parenting advice
```

## Environment Variables

Required variables (see `.env.example`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Services
HABIT_WORDS_KEY=             # OpenRouter API key
HABIT_IMAGE_TOKEN=           # Replicate API token

# App Config
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_ENV=         # development | production
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=habitkids.online
```

## Database Schema

**Tables** (defined in `types/database.ts`):

| Table | Purpose |
|-------|---------|
| `user_profiles` | Parent accounts (id, email, name, child_name, child_age, avatar_url) |
| `habits` | Habit definitions (user_id, name, icon, category, target_frequency) |
| `habit_logs` | Completion records (habit_id, user_id, completed_at, notes) |
| `rewards` | Available rewards (name, points_required, category, stock) |
| `redemptions` | Reward claims (user_id, reward_id, points_spent, status) |
| `posts` | Forum posts (title, body, author, category, tags, likes_count) |
| `comments` | Post comments (post_id, body, author) |
| `post_likes` | Like tracking for posts |
| `comment_likes` | Like tracking for comments |

## Code Conventions

### Component Patterns

1. **Client Components**: Use `"use client"` directive for interactive components
2. **Server Components**: Default for pages and data-fetching components
3. **Shadcn UI**: Use `components/ui/` primitives for consistent styling

```tsx
// Client component example
"use client"
import { Button } from "@/components/ui/button"

export function MyComponent() {
  return <Button>Click me</Button>
}
```

### Path Aliases

Use `@/` prefix for imports:
```tsx
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import type { Database } from "@/types/database"
```

### Styling Conventions

1. **Tailwind Classes**: Use Tailwind for all styling
2. **Kids-Friendly Colors**: Use `kidsPrimary`, `kidsSecondary`, `kidsAccent`, `kidsPurple` color scales
3. **Dark Mode**: Supported via `class` strategy in Tailwind
4. **Fonts**: Nunito (primary), Comic Neue (headings)

```tsx
// Example with kids-friendly colors
<div className="bg-kidsPrimary-100 text-kidsPrimary-800 rounded-2xl p-4">
  Content
</div>
```

### API Routes

API routes follow RESTful conventions in `app/api/`:

```tsx
// app/api/habits/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  // ... fetch data
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  // ... create resource
  return NextResponse.json(result, { status: 201 })
}
```

### Authentication

Auth is managed via `components/auth-provider.tsx`:

```tsx
// Using auth context
import { useAuth } from "@/components/auth-provider"

function MyComponent() {
  const { user, userProfile, isLoading, signOut } = useAuth()

  if (isLoading) return <Loading />
  if (!user) return <LoginPrompt />

  return <AuthenticatedContent user={user} />
}
```

**Protected Routes** (defined in `middleware.ts`):
- `/habits`, `/advisor`, `/activities`, `/statistics`, `/rewards`, `/community`, `/notifications`

**Public Routes**:
- `/`, `/auth`, `/auth/callback`, `/auth/auth-code-error`

### Database Operations

Use functions from `lib/database.ts`:

```tsx
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  logHabitCompletion
} from "@/lib/database"
```

### Error Handling

Use `lib/error-handler.ts` and `lib/safe-storage.ts` for robust error handling:

```tsx
import { safeLocalStorage } from "@/lib/safe-storage"

// Safe localStorage access (handles SSR)
const value = safeLocalStorage.getItem("key")
safeLocalStorage.setItem("key", "value")
```

## Important Patterns

### Supabase Client Usage

```tsx
// Client-side (browser)
import { createClient } from "@/lib/supabase/client"
const supabase = createClient()

// Server-side (API routes, server components)
import { createClient } from "@/lib/supabase/server"
const supabase = await createClient()
```

### Form Validation

Use React Hook Form + Zod:

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(1).max(18),
})

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  })
  // ...
}
```

### Analytics

```tsx
import { trackEvent, trackPageView } from "@/lib/analytics"

// Track custom events
trackEvent("habit_completed", { habitId: "123" })
```

## Testing Notes

- No automated test suite currently configured
- Use `npm run test-ai*` scripts for AI advisor testing
- Manual testing via development server

## Deployment

**Platform**: Vercel

**Key settings** (from `vercel.json`):
- Region: Hong Kong (hkg1)
- Install command: `npm install --legacy-peer-deps`
- CORS headers configured for API routes
- Security headers enabled

**CI/CD** (`.github/workflows/deploy.yml`):
- Quality checks on PRs (lint, build, type-check)
- Auto-deploy to Vercel on main branch push

## Common Tasks

### Adding a New Page

1. Create directory in `app/`
2. Add `page.tsx` with component
3. Update navigation in `components/simple-navigation.tsx` if needed
4. Add to protected routes in `middleware.ts` if authentication required

### Adding a New API Endpoint

1. Create `route.ts` in `app/api/[endpoint]/`
2. Export HTTP method handlers (GET, POST, PUT, DELETE)
3. Use server Supabase client for auth & data access

### Adding UI Components

1. Use existing Shadcn components from `components/ui/`
2. For new Shadcn components: `npx shadcn-ui@latest add [component]`
3. Custom components go in `components/`

### Database Changes

1. Update schema in `supabase/schema.sql`
2. Create migration in `supabase/migrations/`
3. Update types in `types/database.ts`
4. Update CRUD functions in `lib/database.ts`

## Language Notes

- UI text is primarily in **Chinese (Simplified)**
- Code comments may be in Chinese or English
- Variable names and code are in English

## Related Documentation

- `README.md` - Project overview and quick start
- `DEPLOYMENT.md` - Deployment guide
- `DESIGN_SYSTEM.md` - UI/design documentation
- `PROJECT_STATUS.md` - Configuration status
- `ENVIRONMENT_SETUP.md` - Environment configuration
