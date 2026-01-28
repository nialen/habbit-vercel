# 🚀 Project Overview: StarVoyage (Habbit-Vercel)

This document provides a comprehensive overview of the StarVoyage project architecture, purpose, and key components to help developers quickly understand the codebase.

## 🎯 Purpose
StarVoyage is a web application designed to help children build good habits through a gamified interface. It features:
- **Habit Tracking**: Visual progress for daily habits.
- **AI Advisor**: Parenting advice powered by Google Gemini (via OpenRouter).
- **Rewards System**: Incentives for completing tasks.
- **Community**: A space for parents to share experiences.
- **Visuals**: Child-friendly design with AI-generated imagery (via Replicate).

## 🛠️ Technology Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Database & Auth**: [Supabase](https://supabase.com/)
- **AI Logic**: 
  - **Text**: OpenAI Client (accessing Google Gemini models via OpenRouter)
  - **Images**: Replicate (Ideogram v2a)
- **Analytics**: Plausible
- **Deployment**: Vercel

## 📂 Project Structure

### Key Directories
- **`app/`**: Application routes (Next.js App Router).
  - `api/`: Backend API routes (handling AI requests, DB interactions).
  - `advisor/`: AI parenting advisor interface.
  - `habits/`: Main habit tracking interface.
  - `rewards/`, `community/`, etc.: Feature-specific pages.
- **`components/`**: Reusable UI components.
  - `ui/`: Base Shadcn UI components.
  - `navigation.tsx`: Main navigation logic.
- **`lib/`**: Core logic and utility functions.
  - `openai.ts`: Configures OpenAI client for the AI Advisor using `HABIT_WORDS_KEY`.
  - `supabase.ts`: Configures Supabase client.
  - `utils.ts`: General helper functions.

## 🧠 Key Logic Flows

### 1. AI Advisor (`lib/openai.ts`)
- The advisor uses a custom system prompt to act as a "Child Psychology Expert".
- It specifically targets child development stages (e.g., checks age).
- Returns structured JSON data (`analysis`, `suggestions`, `actionItems`) to the frontend.
- Uses **Google Gemini 2.5 Pro** model (via OpenRouter).

### 2. Image Generation (`app/api/generate-image/route.ts`)
- Generates child-friendly, vector-style images associated with habits or rewards.
- Uses **Replicate** API with the `ideogram-ai/ideogram-v2a` model.
- Automatically appends safety and style prompts (e.g., "safe for kids", "vector art").

### 3. Data Management
- **Supabase** handles user authentication and data persistence (habits, logs).
- Environment variables connect the app to the Supabase instance.

## 🔑 Environment Variables
These are critical for the app to function:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase connection.
- `HABIT_WORDS_KEY`: API Key for OpenRouter (Text AI).
- `HABIT_IMAGE_TOKEN`: API Token for Replicate (Image AI).
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: Analytics domain.

## 🚀 Getting Started for Developers
1. **Install dependencies**: `npm install --legacy-peer-deps`
2. **Set up `.env.local`**: Ensure all keys above are present.
3. **Run development server**: `npm run dev`
4. **Deploy**: Push to main branch (Vercel automatically deploys).

---
*Created by Antigravity on 2026-01-27*
