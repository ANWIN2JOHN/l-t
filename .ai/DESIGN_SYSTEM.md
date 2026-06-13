# DESIGN_SYSTEM.md

## Existing Design System

Technology:

```text
Tailwind CSS v4
shadcn/ui
CSS Variables
Dark Mode
```

---

## Theme Tokens

Current implementation:

```css
--background
--foreground

--card
--card-foreground

--primary
--primary-foreground

--secondary
--secondary-foreground

--muted
--muted-foreground

--accent
--accent-foreground

--destructive
--destructive-foreground
```

Source:

```text
src/styles/theme.css
```

---

## Border Radius

Current:

```css
--radius: 0.625rem
```

Use existing radius scale.

Do not introduce new radius systems.

---

## Typography

Current:

```text
h1
h2
h3
h4
```

defined globally inside:

```text
src/styles/theme.css
```

Use Tailwind typography utilities.

Do not create custom typography systems.

---

## Component Strategy

Primary UI library:

```text
shadcn/ui
```

Use existing components before creating new ones.

Priority:

```text
Button
Card
Dialog
Table
Sheet
Select
Badge
Input
Textarea
```

---

## Status Colors

Approved:

```text
Success
```

Rejected:

```text
Destructive
```

Pending:

```text
Warning/Secondary
```

Available:

```text
Success
```

Donated:

```text
Destructive
```

---

## Layout Style

Current design language:

```text
Modern
Card-Based
Dashboard-Oriented
University System
```

Avoid:

```text
Glassmorphism
Neumorphism
Fancy Animations
Marketing Website Styles
```

---

## Dark Mode

Already supported.

All new pages must support:

```text
Light Mode
Dark Mode
```

using existing theme variables.

---

## Design Rule

When building new screens:

```text
Reuse Existing shadcn Components
Reuse Existing Layout Patterns
Reuse Existing Dashboard Cards
```

Do not redesign the application.

Extend the current design language.
