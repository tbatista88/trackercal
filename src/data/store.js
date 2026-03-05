// ============================================
// Data Store – localStorage Manager
// ============================================

const KEYS = {
    PROFILE: 'tcv2_profile',
    PRODUCTS: 'tcv2_products',
    CONSUMPTIONS: 'tcv2_consumptions',
    SETTINGS: 'tcv2_settings'
};

// --- Helpers ---
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function getJSON(key, fallback = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
    } catch {
        return fallback;
    }
}

function setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function todayStr() {
    return new Date().toISOString().split('T')[0];
}

// --- Event System ---
const listeners = {};

export function on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
    return () => {
        listeners[event] = listeners[event].filter(cb => cb !== callback);
    };
}

export function emit(event, data) {
    if (listeners[event]) {
        listeners[event].forEach(cb => cb(data));
    }
}

// ============================================
// Profile
// ============================================
export function getProfile() {
    return getJSON(KEYS.PROFILE, null);
}

export function setProfile(data) {
    const profile = {
        ...data,
        updatedAt: new Date().toISOString()
    };
    setJSON(KEYS.PROFILE, profile);
    emit('profile:updated', profile);
    return profile;
}

export function hasProfile() {
    return getProfile() !== null;
}

// ============================================
// Products
// ============================================
export function getProducts() {
    return getJSON(KEYS.PRODUCTS, []);
}

export function getProduct(id) {
    return getProducts().find(p => p.id === id) || null;
}

export function saveProduct(product) {
    const products = getProducts();
    const newProduct = {
        id: generateId(),
        name: product.name || '',
        description: product.description || '',
        caloriesPer100g: parseFloat(product.caloriesPer100g) || 0,
        photo: product.photo || null,
        createdAt: new Date().toISOString()
    };
    products.unshift(newProduct); // new at top
    setJSON(KEYS.PRODUCTS, products);
    emit('products:updated', products);
    return newProduct;
}

export function updateProduct(id, data) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...data, updatedAt: new Date().toISOString() };
    setJSON(KEYS.PRODUCTS, products);
    emit('products:updated', products);
    return products[index];
}

export function deleteProduct(id) {
    const products = getProducts().filter(p => p.id !== id);
    setJSON(KEYS.PRODUCTS, products);
    emit('products:updated', products);
}

// ============================================
// Consumptions
// ============================================
export function getConsumptions(date = null) {
    const all = getJSON(KEYS.CONSUMPTIONS, []);
    if (!date) return all;
    return all.filter(c => c.date === date);
}

export function getConsumption(id) {
    return getConsumptions().find(c => c.id === id) || null;
}

export function saveConsumption(item) {
    const all = getConsumptions();
    const consumption = {
        id: generateId(),
        productId: item.productId || null,
        productNameBackup: item.productNameBackup || '',
        productPhotoBackup: item.productPhotoBackup || null,
        caloriesPer100gBackup: item.caloriesPer100gBackup || 0,
        grams: parseFloat(item.grams) || 0,
        calories: parseFloat(item.calories) || 0,
        meal: item.meal || 'collation',
        notes: item.notes || '',
        date: item.date || todayStr(),
        createdAt: new Date().toISOString()
    };
    all.unshift(consumption);
    setJSON(KEYS.CONSUMPTIONS, all);
    emit('consumptions:updated', all);
    return consumption;
}

export function updateConsumption(id, data) {
    const all = getConsumptions();
    const index = all.findIndex(c => c.id === id);
    if (index === -1) return null;
    all[index] = { ...all[index], ...data, updatedAt: new Date().toISOString() };
    setJSON(KEYS.CONSUMPTIONS, all);
    emit('consumptions:updated', all);
    return all[index];
}

export function deleteConsumption(id) {
    const all = getConsumptions().filter(c => c.id !== id);
    setJSON(KEYS.CONSUMPTIONS, all);
    emit('consumptions:updated', all);
}

export function getDayTotal(date) {
    const items = getConsumptions(date);
    return items.reduce((sum, c) => sum + (c.calories || 0), 0);
}

export function getConsumptionsByDateRange(startDate, endDate) {
    const all = getConsumptions();
    return all.filter(c => c.date >= startDate && c.date <= endDate);
}

// ============================================
// Settings
// ============================================
export function getSettings() {
    return getJSON(KEYS.SETTINGS, {
        theme: 'light',
        notifications: false
    });
}

export function setSettings(data) {
    const settings = { ...getSettings(), ...data };
    setJSON(KEYS.SETTINGS, settings);
    emit('settings:updated', settings);
    return settings;
}

export function getTheme() {
    return getSettings().theme || 'light';
}

export function setTheme(theme) {
    setSettings({ theme });
    document.documentElement.setAttribute('data-theme', theme);
}

// ============================================
// Data Export
// ============================================
export function exportDailyText(date) {
    const profile = getProfile();
    const consumptions = getConsumptions(date);
    const total = consumptions.reduce((s, c) => s + c.calories, 0);
    const target = profile?.dailyTarget || 0;

    const meals = { 'petit-dejeuner': [], 'dejeuner': [], 'diner': [], 'collation': [] };
    consumptions.forEach(c => {
        const mealKey = c.meal || 'collation';
        if (meals[mealKey]) meals[mealKey].push(c);
        else meals['collation'].push(c);
    });

    const mealNames = {
        'petit-dejeuner': '🌅 Petit-déjeuner',
        'dejeuner': '☀️ Déjeuner',
        'diner': '🌙 Dîner',
        'collation': '🍪 Collation'
    };

    let text = `📊 Mon Suivi Calories – ${date}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🎯 Objectif : ${Math.round(target)} kcal\n`;
    text += `📈 Consommé : ${Math.round(total)} kcal\n`;
    text += `${total <= target ? '✅' : '⚠️'} ${total <= target ? 'Objectif respecté !' : 'Objectif dépassé !'}\n\n`;

    for (const [key, items] of Object.entries(meals)) {
        if (items.length === 0) continue;
        text += `${mealNames[key]}\n`;
        items.forEach(c => {
            text += `  • ${c.productNameBackup} – ${c.grams}g – ${Math.round(c.calories)} kcal\n`;
        });
        text += `\n`;
    }

    return text;
}

// ============================================
// Clear All Data
// ============================================
export function clearAllData() {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
    emit('data:cleared');
}
