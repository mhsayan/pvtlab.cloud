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

## Blog Post Workflow

### Quick Reference - Frontmatter Template

```yaml
---
author: Mahmudul Hasan Sayan  # Optional, defaults to SITE.author
pubDatetime: 2025-01-21T10:00:00Z  # Required, ISO 8601
modDatetime:  # Add only when updating existing post
title: Your Post Title  # Required
slug: custom-slug  # Optional, auto-generated from filename
featured: false  # Set true for essential docs or major releases
draft: false
tags:
  - docs  # Use established tags (see below)
ogImage: ""  # Optional, auto-generated if omitted
description: Brief 1-2 sentence summary.  # Required
---
```

### Established Tag Taxonomy

Use these standard tags for consistency:

- `docs` - Documentation/reference posts
- `configuration` - Theme/setup configuration guides
- `release` - Version announcements
- `FAQ` - Frequently asked questions
- Tech stack tags: `TypeScript`, `Astro`, `TailwindCSS`, etc.

### Naming Conventions

- **Files**: kebab-case (`how-to-configure-theme.md`)
- **Slugs**: auto-generated from filename or explicit kebab-case
- **Directories**: Use `_` prefix to exclude folder name from URL (e.g., `_releases/`)

### Content Structure Pattern

- Start with brief intro paragraph
- Add `## Table of contents` after intro (auto-populated)
- Use H2 (`##`) for main sections (NOT H1)
- Use code blocks with `file="path"` annotation for file examples
- Use `<figure>` tags for images with attribution

### Featured Post Criteria

Set `featured: true` for:
- Essential documentation (getting started, configuration)
- Major version releases
- High-value SEO/discovery content

### Directory Organization

```
src/data/blog/
├── post.md              # Regular post → /posts/post
├── 2025/post.md         # Dated post → /posts/2025/post
├── _releases/           # Underscore = folder excluded from URL
│   └── v5.md            # → /posts/v5 (not /posts/_releases/v5)
└── examples/            # Demo posts
```

### Image Guidelines

- Store in `src/assets/images/` for optimization
- Reference using `@/assets/images/file.png` or relative paths
- OG images: 1200 x 640 px recommended
- Compress with TinyPng/TinyJPG before adding

## Code Style

- ESLint configured with TypeScript and Astro plugins
- `no-console` rule is enforced (use proper logging instead)
- Prettier with astro and tailwindcss plugins
- Path alias `@/` maps to `src/`

### Before Committing (IMPORTANT)

Always run these commands before committing to avoid CI failures:

```bash
pnpm run lint         # Fix ESLint errors
pnpm run format       # Auto-format with Prettier
```

### Common ESLint Issues to Avoid

- **Unused variables**: Use `catch` instead of `catch (e)` or `catch (err)` when the error variable is not used
- **No console**: Avoid `console.log` statements in production code
- **Unused imports**: Remove any imports that are not being used

### Prettier Formatting

The CI pipeline runs `pnpm run format:check` which will fail if files are not formatted. Running `pnpm run format` locally before committing ensures all files follow the project's code style.

## CI/CD Deployment

### GitHub Actions Workflow

The project uses GitHub Actions for automated deployment to GitHub Pages.

- **Workflow file**: `.github/workflows/deploy.yml`
- **Trigger**: Push to `main` branch only (not `Develop` or other branches)
- **Manual trigger**: Available via `workflow_dispatch`
- **Package manager**: pnpm (specified in workflow)

### Deployment Process

1. Code is pushed to `main` branch
2. GitHub Actions runs:
   - Checkout repository
   - Install dependencies with pnpm
   - Build Astro site (includes Pagefind indexing)
   - Deploy to GitHub Pages
3. Site is published to custom domain `pvtlab.cloud`

### Custom Domain

- **CNAME file**: `public/CNAME` contains `pvtlab.cloud`
- **DNS**: Configured to point to GitHub Pages

### Branch Strategy

- `Develop`: Development branch for work in progress
- `main`: Production branch - merging here triggers deployment

### Troubleshooting CI Failures

1. **ESLint errors**: Run `pnpm run lint` locally and fix all errors
2. **Prettier errors**: Run `pnpm run format` locally
3. **Lockfile outdated**: Run `pnpm install` to update `pnpm-lock.yaml`
4. **Build errors**: Run `pnpm run build` locally to catch issues before pushing
