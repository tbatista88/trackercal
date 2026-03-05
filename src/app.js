// ============================================
// App Shell – Router & Navigation
// ============================================

import { hasProfile, getSettings, setTheme, getTheme, on } from './data/store.js';
import { renderOnboarding } from './views/onboarding.js';
import { renderDashboard } from './views/dashboard.js';
import { renderProducts } from './views/products.js';
import { renderHistory } from './views/history.js';
import { renderSettings } from './views/settings.js';

const app = document.getElementById('app');
let currentView = null;
let currentCleanup = null;

// Nav items
const NAV_ITEMS = [
    { id: 'dashboard', icon: '🏠', label: 'Accueil' },
    { id: 'products', icon: '🍎', label: 'Produits' },
    { id: 'history', icon: '📊', label: 'Historique' },
    { id: 'settings', icon: '⚙️', label: 'Réglages' }
];

// ============================================
// Initialize
// ============================================
function init() {
    // Apply saved theme
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);

    // Listen for hash changes
    window.addEventListener('hashchange', handleRoute);

    // Initial route
    if (!hasProfile()) {
        renderView('onboarding');
    } else {
        handleRoute();
    }

    // Listen for profile creation
    on('profile:updated', () => {
        if (currentView === 'onboarding') {
            navigate('dashboard');
        }
    });
}

// ============================================
// Routing
// ============================================
function handleRoute() {
    if (!hasProfile()) {
        renderView('onboarding');
        return;
    }

    const hash = window.location.hash.slice(1) || 'dashboard';
    const [view, ...params] = hash.split('/');
    renderView(view, params);
}

export function navigate(view, params = []) {
    const hash = params.length ? `${view}/${params.join('/')}` : view;
    window.location.hash = hash;
}

function renderView(viewId, params = []) {
    // Cleanup previous view
    if (currentCleanup) {
        currentCleanup();
        currentCleanup = null;
    }

    currentView = viewId;

    // Create view container
    const viewContainer = document.createElement('div');
    viewContainer.className = 'view-container view-enter';
    viewContainer.id = 'view-container';

    // Clear and render
    app.innerHTML = '';
    app.appendChild(viewContainer);

    // Render the appropriate view
    switch (viewId) {
        case 'onboarding':
            currentCleanup = renderOnboarding(viewContainer);
            break;
        case 'dashboard':
            currentCleanup = renderDashboard(viewContainer);
            renderNavBar('dashboard');
            break;
        case 'products':
            currentCleanup = renderProducts(viewContainer, params);
            renderNavBar('products');
            break;
        case 'history':
            currentCleanup = renderHistory(viewContainer);
            renderNavBar('history');
            break;
        case 'settings':
            currentCleanup = renderSettings(viewContainer);
            renderNavBar('settings');
            break;
        default:
            currentCleanup = renderDashboard(viewContainer);
            renderNavBar('dashboard');
    }
}

// ============================================
// Bottom Navigation Bar
// ============================================
function renderNavBar(activeId) {
    // Remove existing nav
    const existingNav = document.querySelector('.nav-bar');
    if (existingNav) existingNav.remove();

    const nav = document.createElement('nav');
    nav.className = 'nav-bar';
    nav.innerHTML = NAV_ITEMS.map(item => `
    <button class="nav-item ${item.id === activeId ? 'active' : ''}" data-view="${item.id}" aria-label="${item.label}">
      <span class="nav-item-icon">${item.icon}</span>
      <span>${item.label}</span>
    </button>
  `).join('');

    nav.addEventListener('click', (e) => {
        const btn = e.target.closest('.nav-item');
        if (!btn) return;
        const view = btn.dataset.view;
        navigate(view);
    });

    app.appendChild(nav);
}

// ============================================
// Start App
// ============================================
init();
