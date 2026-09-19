# My Daily Dashboard Design System

## 1. Atmosphere & Identity

A calm, dark personal command center. The signature is a fixed, ink-blue navigation rail that makes a dense set of tools feel like a small desktop workspace rather than a long, undifferentiated page. The supplied CalcLab reference informed the left rail and compact category controls; the existing mint data accent remains the dashboard's visual anchor.

## 2. Color

| Role | Token | Value | Usage |
|---|---|---:|---|
| Canvas | `--bg` | `#0b1020` | App background |
| Rail | `--rail` | `#111827` | Sidebar |
| Surface | `--surface` | `#151e33` | Cards and inputs |
| Surface raised | `--surface-raised` | `#1a2641` | Active navigation and dialogs |
| Text | `--text` | `#f4f7ff` | Primary content |
| Muted text | `--muted` | `#9ba9c3` | Metadata and labels |
| Border | `--line` | `#2a3859` | Separators and card outlines |
| Accent | `--accent` | `#91a6ff` | Navigation and focus |
| Data accent | `--mint` | `#65e6c1` | Values and time indicators |
| Warning | `--error` | `#ff9ab0` | Validation feedback |

## 3. Typography

Primary font: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`. Mono font: `ui-monospace, SFMono-Regular, Menlo, monospace`. Page title uses 32px/700, card titles use 18px/700, body uses 14px/1.5, and labels use 12px/700 with tracking.

## 4. Spacing & Layout

Base unit is 4px. The desktop shell uses a 264px fixed rail and a fluid workspace with 32px page padding. Cards use 24px padding, 16px gaps, and a responsive grid. At 760px the rail becomes a horizontal navigation strip and the workspace becomes a one-column document.

## 5. Components

### App shell
- Structure: sidebar navigation plus one workspace containing one visible category panel.
- States: active navigation has accent-tinted surface; hover uses a lighter rail surface; focus uses a visible accent ring.
- Accessibility: navigation uses buttons with `aria-controls` and `aria-current`.

### Dashboard card
- Structure: bordered dark surface with an uppercase label and functional content.
- States: default, hover lift, focus-visible descendants, loading/error content provided by each feature.

### Category panel
- Structure: labelled `<section>` toggled with `hidden`.
- States: active panel; inactive panels are removed from layout and keyboard order.

## 6. Motion & Interaction

Category transitions use a 180ms opacity/transform entrance. Navigation and buttons use 160ms ease-out feedback. Reduced-motion users receive no transform or entrance animation.

## 7. Depth & Surface

Mixed depth: tonal navy surfaces, a 1px cool border, and a low black-blue shadow. The rail is darker than the content field so navigation stays visually anchored.

## 8. Accessibility Constraints & Accepted Debt

Target WCAG 2.2 AA: semantic labels, keyboard-operable navigation and dialogs, visible focus states, and reduced-motion support. TradingView embeds are external content and retain their provider-defined accessibility behavior.
