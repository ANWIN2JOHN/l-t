# UI_GUARDRAILS.md

# UI Guardrails

## Purpose

This document protects the visual identity, user experience, navigation structure, and interaction patterns of the Campus Lost & Found Management System.

All frontend development must follow these rules.

The objective is:

```text
Preserve Existing UI
Prevent Unnecessary Redesigns
Maintain Consistency
Protect User Experience
```

---

# Core Principle

## Rule 1

When implementing features:

```text
Modify
Do Not Redesign
```

The goal is feature completion, not visual experimentation.

---

# Forbidden Actions

Do NOT:

```text
Replace Layouts
Replace Navigation
Replace Design System
Replace Typography
Replace Spacing System
Replace Existing Components
Replace Color System
```

unless explicitly requested.

---

# UI Philosophy

The interface should be:

```text
Simple
Clean
Modern
Professional
Mobile Friendly
Accessible
```

Avoid:

```text
Overdesigned Interfaces
Fancy Animations
Complex Dashboards
Unnecessary Visual Effects
```

---

# Branding Protection

Do not modify:

```text
Application Name
Logo
Brand Identity
Primary Colors
Institution Branding
```

unless specifically instructed.

---

# Layout Rules

## Preserve Existing Layout Structure

Do not:

```text
Move Navigation Locations
Rearrange Major Sections
Change Dashboard Structure
Change Information Hierarchy
```

without approval.

---

# Student Experience

Student workflows are the highest priority.

Primary actions:

```text
Search Found Items
Create Lost Report
View My Reports
Notifications
```

UI should optimize these actions.

---

# Admin Experience

Admin workflows focus on:

```text
Review Reports
Create Found Items
Manage Found Items
Audit Logs
Notifications
```

Admin interfaces may prioritize data density.

---

# Responsive Design Rules

Required breakpoints:

```text
Mobile
Tablet
Desktop
```

---

## Mobile First

Student interfaces must be designed mobile-first.

Students are expected to use:

```text
Phones
```

more frequently than desktops.

---

## Desktop Optimization

Admin interfaces should be optimized for:

```text
Laptop
Desktop
```

usage.

---

# Dark Mode Rules

Dark Mode is required.

Every new component must support:

```text
Light Theme
Dark Theme
```

Never implement:

```text
Light Only Components
```

---

# Color Rules

Unless explicitly instructed:

Do not introduce:

```text
Random Accent Colors
New Color Palettes
Multiple Brand Themes
```

Use existing design tokens.

---

# Typography Rules

Preserve:

```text
Font Family
Font Hierarchy
Font Sizes
Font Weights
```

Do not introduce new typography systems.

---

# Spacing Rules

Maintain existing spacing patterns.

Avoid:

```text
Inconsistent Padding
Inconsistent Margins
Mixed Spacing Systems
```

Use existing spacing scale.

---

# Navigation Rules

Do not move:

```text
Main Navigation
Sidebar Navigation
Header Navigation
```

without approval.

---

# Route Consistency

UI structure should match:

```text
ROUTING_MAP.md
```

Do not create duplicate screens.

Do not create alternative navigation paths.

---

# Form Design Rules

All forms should follow existing patterns.

Required consistency:

```text
Input Styling
Labels
Validation Messages
Buttons
Spacing
```

---

# Validation Rules

Show validation:

```text
Inline
Near Inputs
Human Readable
```

Avoid:

```text
Technical Error Messages
```

for users.

---

# Button Rules

Buttons should remain consistent.

Primary actions:

```text
Submit
Save
Approve
Create
```

Secondary actions:

```text
Cancel
Back
Close
```

Danger actions:

```text
Reject
Archive
Donate
Deactivate
```

---

# Table Rules

Admin tables should support:

```text
Sorting
Filtering
Pagination
```

Do not replace tables with card layouts unless mobile requires it.

---

# Card Rules

Student-facing content may use:

```text
Cards
Lists
Compact Views
```

Maintain consistency across screens.

---

# Notification UI Rules

Notifications should be:

```text
Simple
Readable
Actionable
```

Avoid:

```text
Popup Spam
Excessive Toasts
```

---

# Search Experience Rules

Search is a core feature.

Search interfaces must prioritize:

```text
Speed
Visibility
Ease Of Use
```

Search bar should remain prominent.

---

# Accessibility Rules

Required:

```text
Keyboard Navigation
Accessible Labels
Readable Contrast
Focus States
Screen Reader Support
```

Never remove accessibility features.

---

# Loading States

Every async action should provide:

```text
Loading Indicators
Skeleton States
Disabled Submit Buttons
```

Avoid blank screens.

---

# Empty States

Provide meaningful empty states.

Example:

```text
No Found Items Available
No Reports Submitted
No Notifications
```

Do not display blank sections.

---

# Error States

Provide user-friendly messages.

Good:

```text
Unable to load found items.
Please try again.
```

Bad:

```text
500 Internal Server Error
```

---

# Modal Rules

Use modals only for:

```text
Confirmations
Critical Actions
Short Forms
```

Avoid large workflows inside modals.

---

# Animation Rules

Keep animations minimal.

Allowed:

```text
Fade
Slide
Hover Effects
```

Avoid:

```text
Complex Motion Systems
Excessive Transitions
```

---

# Performance Rules

Do not add:

```text
Heavy UI Libraries
Unnecessary Dependencies
Large Animation Frameworks
```

without approval.

---

# Component Reuse Rules

Before creating a component:

```text
Check COMPONENT_MAP.md
```

Reuse existing components whenever possible.

Avoid duplicate implementations.

---

# Antigravity Rules

Before modifying UI:

Read:

```text
PROJECT_RULES.md
APP_REQUIREMENTS.md
DESIGN_SYSTEM.md
COMPONENT_MAP.md
ROUTING_MAP.md
```

When implementing a feature:

```text
Use Existing Components
Preserve Existing Layouts
Preserve Existing Navigation
Preserve Existing Design Patterns
```

Do not redesign unless explicitly instructed.

---

# Final Rule

If a feature can be implemented by:

```text
Extending Existing UI
```

always choose that approach over:

```text
Creating New UI Patterns
```

Consistency is more important than creativity.
