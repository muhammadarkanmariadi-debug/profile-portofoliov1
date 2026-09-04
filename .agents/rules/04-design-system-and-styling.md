# Design System & Styling Rules

## 1. Tailwind CSS v4 & Theme Architecture

* **CSS Variables Token System (`app/globals.css`)**:
  * All surface, text, and border colors are governed by CSS variables:
    * `--background`: Root canvas background (`#0B0B12` in Dark, `#F8F9FA` in Light).
    * `--surface`: Card and navigation surfaces (`#14141F` in Dark, `#FFFFFF` in Light).
    * `--surface-elevated`: Hovered cards and popovers (`#1A1A28` in Dark, `#F1F3F5` in Light).
    * `--primary`: Brand highlight color (`#38BDF8` / `#6C63FF`).
    * `--text-primary`: Primary headings and dominant content (`#F5F5F7` in Dark, `#1F2937` in Light).
    * `--text-muted`: Secondary metadata, captions, and descriptions (`#9A9AB0` in Dark, `#6B7280` in Light).
    * `--border`: Structural hairline borders (`rgba(255,255,255,0.08)` in Dark, `rgba(0,0,0,0.10)` in Light).
* **Inverted Theme Pattern (`.inverted-theme`)**:
  * Used for high-contrast editorial sections (e.g. Skills, About).

## 2. Typography Hierarchy

* **Heading Font**: *Plus Jakarta Sans* / *Syne* / *Clash Display* styles (`font-heading`).
* **Body Font**: *Inter* (`font-sans`).
* **Code & Accent Font**: *Geist Mono* (`font-mono`) with uppercase `tracking-[0.2em]` or `tracking-widest` for editorial indices (e.g., `01`, `02`, `03`).

## 3. UI Patterns & Aesthetics

* **Glassmorphic Panels (`.glass-card`)**:
  * Background blur with translucent borders: `backdrop-filter: blur(12px); border: 1px solid var(--border);`.
* **Browser Mockups**:
  * Dark window frame with colored macOS-style traffic lights (`#FF5F56`, `#FFBD2E`, `#27C93F`), monospace URL bar, and parallax image preview.
* **Sticky Stacking Cards**:
  * Cards stack progressively with `position: sticky; top: calc(...)`, scaling down to `0.94` and reducing brightness to `0.7` as subsequent cards scroll over them.
* **Interactive Cursor Targets**:
  * Interactive elements (buttons, links, pills, cards) should have the class `cursor-target` to trigger custom cursor snapping and scaling.
