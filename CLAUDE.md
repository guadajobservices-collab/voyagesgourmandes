# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Voyages Gourmandes is a food & travel web application built with Next.js and TypeScript. It enables users to discover culinary journeys and food travel experiences.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`)
- **Linting**: ESLint with `next/core-web-vitals` and `next/typescript` configs

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking (tsc --noEmit)
```

## Architecture

- **`src/app/`** — Next.js App Router pages and layouts. Each route is a directory with `page.tsx` and optional `layout.tsx`.
- **`src/components/`** — Reusable React components.
- **`src/lib/`** — Shared utilities, API clients, and helper functions.
- **`src/types/`** — TypeScript type definitions and interfaces.
- **`@/*`** — Path alias resolving to `./src/*` (use `import { X } from "@/lib/foo"`).

### Tailwind CSS v4

This project uses Tailwind v4 with the `@tailwindcss/postcss` plugin. Tailwind is imported via `@import "tailwindcss"` in `src/app/globals.css` — there is no `tailwind.config.js` file. Customization uses CSS-based configuration (theme variables in `globals.css`), not a JS config.

## BMAD Framework

This repo includes the BMAD (Business Model Agile Development) framework scaffolding in `_bmad/`, `.claude/skills/`, `.gemini/skills/`, and `.agent/skills/`. Design artifacts go in `design-artifacts/` (subdirectories A through G). Implementation outputs go in `_bmad-output/`.
