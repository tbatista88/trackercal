# AGENTS.md - TrackerCal V2

## Project Overview

TrackerCal V2 is a vanilla JavaScript Progressive Web App (PWA) for calorie tracking. Built with Vite, no framework (vanilla JS ES6 modules), mobile-first design, French UI.

## Build Commands

```bash
# Development server (port 5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

**Note:** No test framework or linting tools are currently configured.

## Project Structure

```
src/
├── app.js              # App shell, router, navigation
├── data/
│   ├── calories.js     # Calorie calculation utilities
│   └── store.js        # localStorage data management + event bus
├── services/
│   ├── openfoodfacts.js # Open Food Facts API integration
│   └── toast.js        # Toast notification system
├── styles/
│   ├── variables.css   # CSS custom properties (themes)
│   ├── base.css        # Reset, typography, layout
│   ├── components.css  # UI components
│   ├── animations.css  # Keyframe animations
│   └── views.css       # View-specific styles
└── views/
    ├── onboarding.js   # Profile setup wizard
    ├── dashboard.js    # Daily calorie tracking
    ├── products.js     # Product management & barcode scanning
    ├── history.js      # Historical data & charts
    └── settings.js     # App settings
```

## Code Style Guidelines

### JavaScript

- **Modules:** ES6 modules with explicit `.js` extensions in imports
- **Naming:**
  - Files: camelCase (e.g., `store.js`, `dashboard.js`)
  - Functions: camelCase (e.g., `getProfile()`, `renderDashboard()`)
  - Constants: UPPER_SNAKE_CASE (e.g., `NAV_ITEMS`, `MEALS`, `KEYS`)
- **Exports:** Named exports only, no default exports
- **Comments:** Use banner style for sections:
  ```javascript
  // ============================================
  // Section Name – Description
  // ============================================
  ```
- **Error Handling:** Use try/catch for localStorage operations and API calls
- **Async:** Prefer async/await over raw promises

### CSS

- **Class naming:** kebab-case (e.g., `.view-container`, `.btn-primary`)
- **BEM-like modifiers:** `.btn-sm`, `.btn-lg`, `.btn-block`
- **CSS Variables:** Use category prefix (e.g., `--space-md`, `--font-lg`, `--bg-primary`)
- **Theming:** Support `data-theme="light"` and `data-theme="dark"`

### Architecture Patterns

- **State Management:** Event-based store in `data/store.js`
  - `on(event, callback)` - subscribe
  - `emit(event, data)` - publish
  - Events: `profile:updated`, `products:updated`, `consumptions:updated`, `settings:updated`, `data:cleared`
- **Routing:** Hash-based (`window.location.hash`)
  - Routes: `onboarding`, `dashboard`, `products`, `history`, `settings`
  - Use `navigate(view, params)` from `app.js`
- **Views:** Export single `renderViewName(container)` function
  - Return cleanup function from views to remove event listeners
- **Mobile-First:** Touch targets 56-64px, bottom navigation, safe area insets

### External APIs

- **Open Food Facts:** Barcode lookup for product nutrition data
- **Chart.js:** Historical data visualization (import where needed)
- **html5-qrcode:** Camera-based barcode scanning

### PWA Considerations

- Offline support via Vite PWA plugin
- Service worker auto-updates
- Manifest configured for standalone display
- Icons in `/icons/` directory
