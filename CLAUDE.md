# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based blog theme (AstroPaper) using TypeScript and TailwindCSS v4. It's a static site generator with support for markdown blog posts, dynamic OG image generation, and full-text search via Pagefind.

## Commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server at localhost:4321
pnpm run build        # Build production site (includes type checking, Astro build, and Pagefind indexing)
pnpm run preview      # Preview production build locally
pnpm run lint         # Run ESLint
pnpm run format       # Format code with Prettier
pnpm run format:check # Check formatting without changes
pnpm run sync         # Generate TypeScript types for Astro modules
```

## Architecture

### Content System
- Blog posts are stored as markdown files in `src/data/blog/`
- Content schema defined in `src/content.config.ts` with Zod validation
- Posts support frontmatter: `title`, `pubDatetime`, `modDatetime`, `description`, `tags`, `draft`, `featured`, `ogImage`, `canonicalURL`, `timezone`
- Draft posts (`draft: true`) are visible in dev but excluded from production
- Scheduled posts are filtered based on `SITE.scheduledPostMargin` (15 min buffer)

### Key Configuration
- `src/config.ts`: Site-wide settings (SITE object) - website URL, author, pagination, features
- `astro.config.ts`: Astro configuration with Shiki syntax highlighting, remark plugins, TailwindCSS v4 via Vite

### Routing Structure
- `/` - Home page with featured and recent posts
- `/posts/` - Paginated post listing
- `/posts/[slug]/` - Individual post pages
- `/tags/` - Tag listing
- `/tags/[tag]/` - Posts filtered by tag (paginated)
- `/search` - Pagefind-powered search
- `/archives/` - Archive view (toggleable via `SITE.showArchives`)

### Utility Functions (`src/utils/`)
- `postFilter.ts`: Filters out drafts and future-scheduled posts in production
- `getSortedPosts.ts`: Returns posts sorted by date
- `getPostsByTag.ts`: Filter posts by tag
- `slugify.ts`: URL-safe slug generation
- `generateOgImages.ts`: Dynamic OG image generation using Satori and resvg-js

### Layout Hierarchy
- `Layout.astro`: Base HTML structure, meta tags, theme handling
- `Main.astro`: Main content wrapper with header/footer
- `PostDetails.astro`: Single post layout with TOC support
- `AboutLayout.astro`: About page layout

## Code Style

- ESLint configured with TypeScript and Astro plugins
- `no-console` rule is enforced (use proper logging instead)
- Prettier with astro and tailwindcss plugins
- Path alias `@/` maps to `src/`
