# Style Guide

## Inspiration

Vercel, Linear, GitHub, Stripe, Notion, LeetCode — calm, premium SaaS. Soft surfaces, clear hierarchy, no flashy gradients.

## Color system

CSS variables in `src/styles/globals.css` drive light and dark themes:

- `--background`, `--foreground`
- `--card`, `--muted`, `--border`, `--ring`
- `--primary`, `--secondary`, `--accent`
- `--destructive`, `--success`, `--warning`
- `--easy`, `--medium`, `--hard` (difficulty)

Prefer semantic tokens (`bg-background`, `text-muted-foreground`) over raw hex.

## Typography

- **Sans:** Inter
- **Mono:** JetBrains Mono (code / markdown editor UI)

Scale:

- Hero: `text-4xl` → `text-6xl`
- Page title: `text-2xl` → `text-3xl`
- Body: `text-sm` / `text-base`
- Meta: `text-xs`

## Layout

- Max content width: `max-w-7xl` via `.container-page`
- Section rhythm: `py-16` / `py-20`
- Card radius: `rounded-xl`
- Controls: `rounded-lg`

## Motion

Use Framer Motion sparingly (`FadeIn` for page intro). Prefer 200–400ms ease curves. Avoid decorative looping animations.

## Components

- Cards for interactive or grouped content — not every block needs a card.
- Clear focus rings (`focus-visible:ring-2`).
- Difficulty badges use easy/medium/hard color tokens.

## Accessibility

- Semantic landmarks (`header`, `main`, `nav`, `footer`)
- Icon buttons include `aria-label`
- Dialogs use Radix focus management
- Forms associate labels with inputs
