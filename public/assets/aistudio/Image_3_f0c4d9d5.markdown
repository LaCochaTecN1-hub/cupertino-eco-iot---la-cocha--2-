---
name: Cupertino Eco-IoT
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#41474f'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#717880'
  outline-variant: '#c1c7d0'
  surface-tint: '#236391'
  primary: '#236391'
  on-primary: '#ffffff'
  primary-container: '#74acdf'
  on-primary-container: '#003f65'
  inverse-primary: '#96ccff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#005ac2'
  on-tertiary: '#ffffff'
  tertiary-container: '#79a6ff'
  on-tertiary-container: '#003981'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cee5ff'
  primary-fixed-dim: '#96ccff'
  on-primary-fixed: '#001d32'
  on-primary-fixed-variant: '#004a75'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
typography:
  large-title:
    fontFamily: Plus Jakarta Sans
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 41px
  title-1:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  title-2:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  title-3:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 25px
  headline:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
  body:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 22px
  callout:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 21px
  subheadline:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 20px
  footnote:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  caption-1:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  caption-2:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 13px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system expresses a high-fidelity Apple Human Interface Guidelines (HIG) aesthetic tailored for an environmental STEM initiative in Tucumán, Argentina. It merges the institutional civic dignity of the Argentine *Celeste* with the lush botanical vibrancy of "El Jardín de la República."

### Design Style & Attitude
- **Style Archetype:** Cupertino Refined Glassmorphism + Modern Clean HIG.
- **Atmospheric Depth:** Frosted translucency (`backdrop-blur-xl`), ultra-fine interior hairline borders, and subtle diffuse shadows simulate native iOS materials (`systemUltraThinMaterial`, `systemMaterial`).
- **Emotional Resonance:** Precise, scientific, optimistic, and deeply rooted in local ecology. The interface feels lightweight and calm, letting sensory telemetry (air quality, temperature, soil metrics) stand out crisply.
- **Form Factor Focus:** Optimized primarily for iPhone portrait viewports (390pt–430pt widths) with full fidelity to Dynamic Island, native navigation bars, Cupertino grouped insets, and bottom tab structures.

## Colors

The color system is organized into semantic layers honoring Argentine civic identity and Tucumán’s botanical landscape, calibrated for WCAG AA compliance across light and dark modes.

### Key Palettes
- **Argentine Sky Blue (Primary):** `#74ACDF` anchors core brand identity and interactive states. Deep sky accents (`#3B82F6`) provide contrast for micro-actions, links, and high-emphasis indicators.
- **Tucumán Flora Green (Accent / Secondary):** `#10B981` (with `#059669` for light mode text and `#34D399` for dark mode glows) indicates ecological balance, good air quality, active sensor telemetry, and live network sync.
- **Neutral Canvas:** Light mode operates over an authentic Cupertino grouped background `#F2F4F7`, stepping up into pure frosted cards `#FFFFFF/85`. Dark mode operates on a rich slate base `#0F172A`, moving to container fills `#1E293B/75`.

### Color Roles & Dynamic Adaptation
- **System Background:** Light `#F2F4F7` | Dark `#0F172A`
- **Secondary System Background (Inset Grouped Canvas):** Light `#E5E7EB` | Dark `#0B1120`
- **Surface Elevation (Cards / Glass Panels):** Light `rgba(255, 255, 255, 0.82)` | Dark `rgba(30, 41, 59, 0.78)`
- **Content Primary (Labels):** Light `#0F172A` | Dark `#F8FAFC`
- **Content Secondary:** Light `#64748B` | Dark `#94A3B8`
- **Content Tertiary / Hairline Borders:** Light `rgba(203, 213, 225, 0.60)` | Dark `rgba(51, 65, 85, 0.60)`
- **Environmental Alert Tiers:**
  - Optimal / Clean: `#10B981` (Tucumán Emerald)
  - Moderate / Caution: `#F59E0B` (Amber)
  - Critical / Unhealthy: `#EF4444` (Vibrant Coral)

## Typography

The typography scale closely aligns with Cupertino’s dynamic type proportions, pairing **Plus Jakarta Sans** for prominent headers with **Inter** for clean, legible body text and telemetry data.

### Structural Hierarchy
- **Large Title & Title 1 (Plus Jakarta Sans, 700):** Used for primary view transitions, collapsed/expanded iOS Large Titles, and dashboard hero telemetry cards.
- **Headlines & Subheadlines (Inter, 600/400):** Governs standard navigation bar inline titles, section headers inside grouped lists, and metric card titles.
- **Body & Callouts (Inter, 400):** Delivers fluid reading for scientific logs, sensor descriptions, and school participant attributions.
- **Footnotes & Captions (Inter, 500/600):** Used for timestamp badges, micro status updates (e.g., "Actualizado hace 2 min"), unit measures (e.g., `ppm`, `µg/m³`, `°C`), and bottom tab bar labels.

## Layout & Spacing

Layout and spatial distribution follow the Apple HIG **Grouped Inset** standard.

### Spatial Model & Breakpoints
- **Mobile Safe Areas:** 16pt (`margin: 1rem`) horizontal margin on compact devices (iPhone SE through iPhone 15 Pro Max). All top-level views observe the Dynamic Island and status bar top offset (minimum 44pt to 59pt) and home indicator bottom inset (34pt).
- **Grouped Insets:** Content modules sit inside isolated card groups with a uniform horizontal offset of 16pt from the screen edge, creating floating glass segments above the neutral base.
- **Vertical Rhythm:** 
  - Standard spacing between cards: `12pt` (`0.75rem`).
  - Spacing between distinct semantic sections: `24pt` (`1.5rem`).
  - Internal card padding: `16pt` (`1rem`) on standard cards; `12pt` (`0.75rem`) on compact IoT telemetry chips.
- **Tablet / Split View (iPadOS):** Fluid 4-to-8 column layout scaling to a maximum content container width of 680pt for single-column environmental reports, expanding into a primary/secondary split view on larger viewports.

## Elevation & Depth

Elevation eschews skeuomorphic drop shadows in favor of authentic iOS translucency and delicate hairline boundary illumination.

### Material & Surface Layers
1. **Base Ground:** Opaque flat canvas (`#F2F4F7` light, `#0F172A` dark).
2. **Backdrop Blur Translucency:**
   - Navigation Bars & Cupertino Tab Bar: `backdrop-filter: blur(20px) saturate(180%)`, surface fill `rgba(255, 255, 255, 0.72)` in light mode, `rgba(15, 23, 42, 0.75)` in dark mode.
   - Sensor Cards: `backdrop-filter: blur(16px)`, surface fill `rgba(255, 255, 255, 0.85)` in light mode, `rgba(30, 41, 59, 0.70)` in dark mode.
3. **Hairline Outlines:**
   - All elevated surfaces feature an inward or perimeter border of `0.5px` to `1px` tinted with `rgba(203, 213, 225, 0.60)` in light mode and `rgba(255, 255, 255, 0.08)` in dark mode, simulating Apple's physical glass edge refraction.
4. **Shadow Attributes:**
   - Ambient, ultra-diffused shadow: `0 4px 20px -2px rgba(15, 23, 42, 0.04)`.
   - Modals / Bottom Sheets: `0 12px 32px -4px rgba(15, 23, 42, 0.12)`.

## Shapes

The design system uses soft, continuous squircle geometry (`corner-curve: continuous`) matching Apple's hardware and software radii.

### Curvature Tiers
- **Small (Chips, Badges, Micro Toggles):** `8px` (`rounded-lg`).
- **Medium (Buttons, Segmented Controls, Inputs):** `12px` to `14px` (`rounded-xl`).
- **Large (Grouped Sensor Cards, Sheet Modals):** `20px` to `24px` (`rounded-2xl` / `rounded-3xl`), mirroring iPhone screen corner radii.
- **Pills / Floating Caps:** `9999px` strictly for floating action triggers, connectivity status pills (e.g., "En línea"), and bottom home-bar indicators.

## Components

### Buttons
- **Primary Action:** Solid Argentine Sky Blue (`#74ACDF`) or Tucumán Green (`#10B981`) fill, pure white text, medium weight, `12px` radius. Active state scales subtly (`scale: 0.98`) with `opacity: 0.85`.
- **Secondary / Ghost:** Glass fill `rgba(255, 255, 255, 0.65)` with `1px border-slate-200/60`, text in slate-800.

### Segmented Controls (Cupertino Native)
- Pill or rounded container (`10px` radius) with `rgba(226, 232, 240, 0.6)` background.
- Active segment: Solid white block with gentle ambient shadow (`0 2px 6px rgba(0,0,0,0.06)`), smooth haptic transition animation.

### Grouped Lists & Metric Cards
- Inset cards with `20px` radius, frosted glass background, divided internally by `0.5px` border line inset by `16px` on the left.
- IoT metric cells display real-time sensor figures with dynamic color icons:
  - Temperature (°C), Humidity (%), CO2 (ppm), PM2.5 particulate matter.
  - Each item displays status dots (pulsing Green `#10B981` when IoT node is sending telemetry).

### Inputs & Fields
- Grouped inset container with neutral clear background `rgba(241, 245, 249, 0.7)`, `12px` radius, `17px` body font, and native placeholder text in neutral slate-400.

### Checkboxes & Switches
- Uses native iOS toggle switch styles: standard `51x31pt` green track (`#10B981` active, `#E2E8F0` inactive) with smooth white thumb.

### Cupertino Bottom Tab Bar
- Persistent frosted bottom bar (`83pt` height including home indicator safe area).
- Active icons tinted `#3B82F6` or `#10B981`; inactive items `#94A3B8`. Micro captions in `10pt` caption-2 weight.