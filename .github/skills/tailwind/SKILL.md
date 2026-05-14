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
- [ ] All colors use semantic tokens (`bg-background`, `text-foreground`, etc.)
- [ ] `cn()` used wherever conditional or merged classes appear
- [ ] Responsive breakpoints added for layout components
- [ ] `dark:` variants work or CSS variable tokens handle it automatically
- [ ] shadcn components imported from `@/components/ui/` (not npm)
- [ ] No hardcoded hex colors or pixel values outside of `@theme`
- [ ] Accessible: labels linked to inputs, buttons have descriptive text
- [ ] Spacing and typography follow the Tailwind scale (no arbitrary values unless justified)
