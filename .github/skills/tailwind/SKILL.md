---
name: tailwind-v4-shadcn-ui
description: Build high-quality UI components using Tailwind CSS v4 and shadcn/ui. Use this skill whenever implementing any frontend UI — pages, forms, modals, dashboards, cards, tables, or any visual component.
tools: ["codebase", "edit", "read", "terminal"]
---

# Purpose
Implement polished, consistent, accessible UI using the Tailwind CSS v4 + shadcn/ui stack. Apply this skill for every frontend UI task to ensure quality, consistency, and best practices.

---

# Stack Overview

## Tailwind CSS v4
- Configuration lives in `app.css` / `globals.css` using the `@import "tailwindcss"` directive (no `tailwind.config.js` needed).
- Tokens are defined with `@theme` inside CSS:
  ```css
  @import "tailwindcss";

  @theme {
    --color-primary: oklch(0.55 0.22 264);
    --color-primary-foreground: oklch(0.98 0 0);
    --radius-lg: 0.75rem;
    --font-sans: "Inter", sans-serif;
  }
  ```
- Use CSS variables as utility classes: `bg-primary`, `text-primary-foreground`, `rounded-lg`.
- Dark mode via `.dark` class strategy: `dark:bg-background`.
- `@layer base`, `@layer components`, `@layer utilities` still valid.
- No `purge` config needed — Tailwind v4 scans automatically.

## shadcn/ui
- Components live in `src/components/ui/`.
- Import from local path: `import { Button } from "@/components/ui/button"`.
- All components are **copy-owned** — editing them directly is expected.
- Uses `class-variance-authority (cva)` for variant management.
- Uses `clsx` + `tailwind-merge` via a `cn()` utility in `src/lib/utils.ts`.
- Relies on CSS variables for theming — always matches the `@theme` block.

---

# Design Principles

1. **Semantic color tokens** — always use `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-muted-foreground` etc. Never hardcode `bg-white` or `text-gray-900`.
2. **Consistent spacing** — use the Tailwind spacing scale. Prefer `p-4`, `gap-6`, `mt-2` over arbitrary values.
3. **Accessible contrast** — foreground tokens are designed to contrast with their background counterparts. Keep pairings consistent.
4. **Responsive by default** — layout classes should include `sm:`, `md:`, `lg:` breakpoints where relevant.
5. **Dark mode ready** — use `dark:` variants or rely on CSS variable tokens that switch on `.dark`.

---

# Strict Rules (Non-negotiable)

## Rule 1 — Colors Must Come From Design Tokens Only

Every color applied in JSX **must** reference a token defined in the `@theme` block in `index.css` (or the project's global CSS file). This applies to:

- Tailwind utility classes: `bg-primary`, `text-foreground`, `border-border`, `text-muted-foreground`, etc.
- Inline `style` props that reference CSS variables: `color: 'var(--color-primary)'`

**Forbidden — never use:**
- Hardcoded hex, rgb, hsl, or oklch values in JSX/TSX (e.g. `style={{ color: '#6c5dd3' }}`)
- Tailwind color palette classes that are not mapped to a project token (e.g. `bg-purple-600`, `text-gray-900`, `bg-white`, `text-black`)
- `color-mix()` or other CSS functions in inline styles unless they exclusively mix two project CSS variables

If a color is needed that does not yet exist as a token, **add it to the `@theme` block first** then reference the new token.

**Valid examples:**
```tsx
// ✅ token class
<h1 className="text-foreground">Title</h1>

// ✅ CSS variable in inline style
<div style={{ background: 'var(--color-surface)' }} />

// ❌ hardcoded color
<h1 style={{ color: '#1e2022' }}>Title</h1>

// ❌ non-token Tailwind palette class
<div className="bg-white text-gray-900" />
```

---

## Rule 2 — Extract Reusable UI Primitives

Whenever a UI element appears more than once across pages, **or** is complex enough to have its own variants/states, extract it into a shared component under `src/components/ui/`.

**Mandatory extractions:**

| Element | Shared component | Location |
|---|---|---|
| Text input with icon | `<InputField />` | `src/components/ui/InputField.tsx` |
| Password input with toggle | `<PasswordInput />` | `src/components/ui/PasswordInput.tsx` |
| Form field wrapper (label + input + error) | `<FormField />` | `src/components/ui/FormField.tsx` |
| Social auth button (GitHub / Google) | `<SocialAuthButton />` | `src/components/ui/SocialAuthButton.tsx` |
| Submit / CTA button | `<Button />` | `src/components/ui/Button.tsx` |
| Auth page layout (branding panel + form panel) | `<AuthLayout />` | `src/components/layouts/AuthLayout.tsx` |

**Rules for shared components:**
- Accept a `className` prop and spread it via `cn()` so callers can extend without forking.
- Accept only the props they need — keep the interface minimal.
- Never hardcode colors inside the component — use tokens (see Rule 1).
- Export a single named export matching the file name.

**Before writing an inline element, ask:** *"Does this already exist as a shared component, or should it?"* If yes — use or create the shared component first.

---

# Component Patterns

## Layout Shell
```tsx
<div className="min-h-screen bg-background text-foreground">
  <main className="container mx-auto px-4 py-8">
    {children}
  </main>
</div>
```

## Page Heading
```tsx
<div className="mb-6">
  <h1 className="text-3xl font-bold tracking-tight">Page Title</h1>
  <p className="text-muted-foreground mt-1">Supporting description text.</p>
</div>
```

## Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

## Form Field
```tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

## Button Variants
```tsx
import { Button } from "@/components/ui/button";

<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

## Alert / Feedback
```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

## Dialog / Modal
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
    </DialogHeader>
    {/* body */}
  </DialogContent>
</Dialog>
```

## Table
```tsx
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item A</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Badge
```tsx
import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Error</Badge>
```

---

# `cn()` Utility Usage
Always merge classes with `cn()` to avoid conflicts:
```ts
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class", className)} />
```

---

# Checklist Before Shipping UI
- [ ] All colors use semantic tokens (`bg-background`, `text-foreground`, etc.) — **no hardcoded hex, rgb, or non-token Tailwind palette classes**
- [ ] Any new color needed was first added as a token to `@theme` in `index.css`
- [ ] Repeated or complex elements extracted into shared components under `src/components/ui/`
- [ ] Shared components accept `className` and merge via `cn()`
- [ ] `cn()` used wherever conditional or merged classes appear
- [ ] Responsive breakpoints added for layout components
- [ ] `dark:` variants work or CSS variable tokens handle it automatically
- [ ] shadcn components imported from `@/components/ui/` (not npm)
- [ ] No hardcoded hex colors or pixel values outside of `@theme`
- [ ] Accessible: labels linked to inputs, buttons have descriptive text
- [ ] Spacing and typography follow the Tailwind scale (no arbitrary values unless justified)
