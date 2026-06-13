# COMPONENT_MAP.md

## Existing Core Pages

Location:

```text
src/app/components
```

### LandingPage

Purpose:

```text
Public Landing Page
System Introduction
Entry Point
```

---

### LoginPage

Purpose:

```text
Authentication Entry
```

---

### RoleSelectionPage

Purpose:

```text
Student/Admin Selection
```

---

### StudentLoginPage

Purpose:

```text
Student Authentication
```

---

### StudentSignupPage

Purpose:

```text
Student Registration
```

---

### StudentDashboard

Purpose:

```text
Student Home Dashboard
```

---

### PendingApprovalsPage

Purpose:

```text
Admin Review Queue
```

---

### ReportLostItemForm

Purpose:

```text
Create Lost Report
```

---

## Existing Shared Components

### ConfirmModal

Reusable confirmation dialog.

Use for:

```text
Reject Report
Archive Item
Donate Item
Delete Actions
```

---

### InfoModal

Reusable information dialog.

Use for:

```text
Status Updates
Success Messages
Information Display
```

---

### CardNameTooltip

Reusable tooltip.

---

### SystemStatusIndicator

System status display.

---

## Existing UI Library

Location:

```text
src/app/components/ui
```

Use existing shadcn components only.

### Inputs

```text
Input
Textarea
Select
Checkbox
RadioGroup
Switch
```

### Layout

```text
Card
Sheet
Sidebar
Separator
ScrollArea
```

### Navigation

```text
Breadcrumb
Pagination
NavigationMenu
Tabs
```

### Feedback

```text
Alert
Dialog
Tooltip
Sonner
Badge
Progress
Skeleton
```

### Data Display

```text
Table
Chart
Avatar
Calendar
```

Rule:

Create business components by composing these primitives.

Do not create custom replacements.
