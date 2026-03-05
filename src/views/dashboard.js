// ============================================
// Dashboard View – Daily Tracking
// ============================================

import { getProfile, getConsumptions, getDayTotal, deleteConsumption, getProduct, on, exportDailyText } from '../data/store.js';
import { showToast } from '../services/toast.js';
import { navigate } from '../app.js';

const MEALS = {
    'petit-dejeuner': { icon: '🌅', label: 'Petit-déjeuner' },
    'dejeuner': { icon: '☀️', label: 'Déjeuner' },
    'diner': { icon: '🌙', label: 'Dîner' },
    'collation': { icon: '🍪', label: 'Collation' }
};

export function renderDashboard(container) {
    const profile = getProfile();
    const today = new Date().toISOString().split('T')[0];
    let selectedDate = today;
    const unsubscribers = [];

    function render() {
        const consumptions = getConsumptions(selectedDate);
        const totalCal = consumptions.reduce((s, c) => s + (c.calories || 0), 0);
        const target = profile?.dailyTarget || 2000;
        const progress = Math.min((totalCal / target) * 100, 100);
        const overTarget = totalCal > target;
        const remaining = target - totalCal;

        // Group by meal
        const mealGroups = {};
        for (const key of Object.keys(MEALS)) {
            mealGroups[key] = consumptions.filter(c => c.meal === key);
        }

        // Date display
        const dateObj = new Date(selectedDate + 'T12:00:00');
        const isToday = selectedDate === today;
        const dateStr = isToday ? 'Aujourd\'hui' : dateObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

        const circumference = 2 * Math.PI * 54;
        const dashOffset = circumference - (progress / 100) * circumference;

        container.innerHTML = `
      <div class="dashboard">
        <!-- Header -->
        <div class="view-header">
          <div>
            <h1 style="font-size:var(--font-2xl);">Mon Suivi</h1>
            <p style="font-size:var(--font-sm);color:var(--text-tertiary);">${dateStr}</p>
          </div>
          <div class="flex gap-sm">
            <button class="btn btn-icon btn-secondary" id="btn-date-prev" aria-label="Jour précédent">←</button>
            ${!isToday ? `<button class="btn btn-sm btn-ghost" id="btn-date-today">Auj.</button>` : ''}
            <button class="btn btn-icon btn-secondary" id="btn-date-next" aria-label="Jour suivant" ${isToday ? 'disabled style="opacity:0.4"' : ''}>→</button>
          </div>
        </div>
        
        <!-- Calorie Ring -->
        <div class="dashboard-ring-section ${overTarget ? 'over-target-glow' : ''}" style="text-align:center;padding:var(--space-md);">
          <div class="progress-ring-container">
            <svg width="140" height="140" viewBox="0 0 120 120">
              <circle class="progress-ring-bg" cx="60" cy="60" r="54" />
              <circle class="progress-ring-fill ${overTarget ? 'over-target' : ''}" cx="60" cy="60" r="54" 
                      stroke-dasharray="${circumference}" 
                      stroke-dashoffset="${dashOffset}" />
            </svg>
            <div class="progress-ring-text">
              <span class="progress-ring-value" style="${overTarget ? 'color:var(--danger)' : ''}">${Math.round(totalCal)}</span>
              <span class="progress-ring-label">/ ${target} kcal</span>
            </div>
          </div>
          
          <div class="flex-center gap-lg" style="margin-top:var(--space-md);">
            <div style="text-align:center;">
              <div style="font-size:var(--font-2xl);font-weight:var(--fw-bold);color:${overTarget ? 'var(--danger)' : remaining > 0 ? 'var(--success)' : 'var(--text-primary)'};">
                ${overTarget ? '+' : ''}${Math.abs(Math.round(remaining))}
              </div>
              <small>${overTarget ? 'kcal en trop' : 'kcal restantes'}</small>
            </div>
          </div>
          
          ${overTarget ? `
            <div class="warning-banner" style="margin-top:var(--space-md);">
              <span class="warning-banner-icon">⚠️</span>
              <span class="warning-banner-text">Vous avez dépassé votre objectif de ${Math.round(totalCal - target)} kcal</span>
            </div>
          ` : ''}
        </div>
        
        <!-- Quick Actions -->
        <div class="flex gap-sm" style="padding:0 var(--space-md);margin-bottom:var(--space-md);">
          <button class="btn btn-primary btn-sm" id="btn-add-food" style="flex:1;">
            ➕ Ajouter un aliment
          </button>
          <button class="btn btn-secondary btn-sm btn-icon" id="btn-export" title="Exporter" aria-label="Exporter">
            📋
          </button>
        </div>
        
        <!-- Meal Groups -->
        <div class="dashboard-meals" style="padding:0 var(--space-md);">
          ${Object.entries(MEALS).map(([key, meal]) => {
            const items = mealGroups[key] || [];
            const mealTotal = items.reduce((s, c) => s + (c.calories || 0), 0);
            return `
              <div class="meal-group card-glass" style="margin-bottom:var(--space-sm);">
                <div class="meal-group-header" data-meal-toggle="${key}">
                  <span class="meal-group-title">${meal.icon} ${meal.label}</span>
                  <span class="meal-group-cal">${items.length > 0 ? Math.round(mealTotal) + ' kcal' : ''}</span>
                </div>
                <div class="meal-group-items" id="meal-items-${key}">
                  ${items.length === 0 ? `
                    <div style="text-align:center;padding:var(--space-sm);color:var(--text-tertiary);font-size:var(--font-sm);">
                      Appuyez sur + pour ajouter
                    </div>
                  ` : items.map(c => renderConsumptionItem(c)).join('')}
                </div>
                <button class="btn btn-ghost btn-sm" style="width:100%;margin-top:var(--space-xs);" data-add-meal="${key}">
                  + Ajouter
                </button>
              </div>
            `;
        }).join('')}
        </div>
      </div>
    `;

        attachListeners();
    }

    function renderConsumptionItem(c) {
        const product = c.productId ? getProduct(c.productId) : null;
        const photo = product?.photo || c.productPhotoBackup;
        const name = product?.name || c.productNameBackup || 'Produit inconnu';

        return `
      <div class="consumption-item" data-consumption-id="${c.id}">
        ${photo
                ? `<img class="consumption-item-photo" src="${photo}" alt="${name}" loading="lazy" />`
                : `<div class="consumption-item-photo flex-center" style="font-size:16px;">🍽️</div>`
            }
        <div class="consumption-item-info">
          <div class="consumption-item-name">${name}</div>
          <div class="consumption-item-detail">${c.grams}g${c.notes ? ' · ' + c.notes : ''}</div>
        </div>
        <div class="consumption-item-cal">${Math.round(c.calories)}</div>
        <div class="consumption-item-actions">
          <button class="btn btn-ghost btn-sm" data-edit-consumption="${c.id}" aria-label="Modifier">✏️</button>
          <button class="btn btn-ghost btn-sm" data-delete-consumption="${c.id}" aria-label="Supprimer">🗑️</button>
        </div>
      </div>
    `;
    }

    function attachListeners() {
        // Date navigation
        container.querySelector('#btn-date-prev')?.addEventListener('click', () => {
            const d = new Date(selectedDate + 'T12:00:00');
            d.setDate(d.getDate() - 1);
            selectedDate = d.toISOString().split('T')[0];
            render();
        });

        container.querySelector('#btn-date-next')?.addEventListener('click', () => {
            const d = new Date(selectedDate + 'T12:00:00');
            d.setDate(d.getDate() + 1);
            const nextDate = d.toISOString().split('T')[0];
            if (nextDate <= today) {
                selectedDate = nextDate;
                render();
            }
        });

        container.querySelector('#btn-date-today')?.addEventListener('click', () => {
            selectedDate = today;
            render();
        });

        // Add food
        container.querySelector('#btn-add-food')?.addEventListener('click', () => {
            navigate('products', ['select']);
        });

        // Add to specific meal
        container.querySelectorAll('[data-add-meal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const meal = btn.dataset.addMeal;
                navigate('products', ['select', meal]);
            });
        });

        // Export
        container.querySelector('#btn-export')?.addEventListener('click', () => {
            const text = exportDailyText(selectedDate);
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    showToast('Résumé copié dans le presse-papiers ! 📋', 'success');
                });
            } else {
                // Fallback
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                showToast('Résumé copié ! 📋', 'success');
            }
        });

        // Edit consumption
        container.querySelectorAll('[data-edit-consumption]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.editConsumption;
                showEditConsumptionModal(id);
            });
        });

        // Delete consumption
        container.querySelectorAll('[data-delete-consumption]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.deleteConsumption;
                if (confirm('Supprimer ce repas ?')) {
                    deleteConsumption(id);
                    showToast('Repas supprimé', 'info');
                    render();
                }
            });
        });
    }

    // ========================================
    // Edit Consumption Modal
    // ========================================
    function showEditConsumptionModal(consumptionId) {
        const { getConsumption, updateConsumption, getProduct: getProductFn } = require_store();
        const consumption = getConsumption(consumptionId);
        if (!consumption) return;

        const product = consumption.productId ? getProduct(consumption.productId) : null;
        const isDeleted = consumption.productId && !product;
        const name = product?.name || consumption.productNameBackup || 'Produit inconnu';
        const calPer100 = product?.caloriesPer100g || consumption.caloriesPer100gBackup || 0;

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-edit">✕</button>
        <h3 class="modal-title">Modifier la consommation</h3>
        
        ${isDeleted ? `
          <div class="warning-banner mb-md">
            <span class="warning-banner-icon">⚠️</span>
            <span class="warning-banner-text">Produit supprimé – vous ne pouvez modifier que la quantité et les calories.</span>
          </div>
        ` : ''}
        
        <div class="card-glass mb-md">
          <strong>${name}</strong>
          ${!isDeleted ? `<p style="font-size:var(--font-sm);color:var(--text-tertiary);">${calPer100} kcal / 100 g</p>` : ''}
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="edit-grams">Quantité (grammes)</label>
          <input class="input-field" type="number" id="edit-grams" value="${consumption.grams}" min="1" inputmode="numeric" />
        </div>
        
        ${isDeleted ? `
          <div class="input-group mb-md">
            <label class="input-label" for="edit-calories">Calories</label>
            <input class="input-field" type="number" id="edit-calories" value="${Math.round(consumption.calories)}" min="0" inputmode="numeric" />
          </div>
        ` : `
          <div class="card-glass mb-md">
            <div class="flex-between">
              <span>Calories calculées</span>
              <strong id="edit-cal-preview">${Math.round(consumption.calories)} kcal</strong>
            </div>
          </div>
        `}
        
        <div class="input-group mb-md">
          <label class="input-label" for="edit-notes">Notes (optionnel)</label>
          <input class="input-field" type="text" id="edit-notes" value="${consumption.notes || ''}" placeholder="Ajouter une note..." />
        </div>
        
        <button class="btn btn-primary btn-block" id="btn-save-edit">💾 Enregistrer</button>
      </div>
    `;

        document.body.appendChild(overlay);

        // Auto-calc preview
        const gramsInput = overlay.querySelector('#edit-grams');
        const calPreview = overlay.querySelector('#edit-cal-preview');

        if (gramsInput && calPreview && !isDeleted) {
            gramsInput.addEventListener('input', () => {
                const g = parseFloat(gramsInput.value) || 0;
                calPreview.textContent = Math.round((calPer100 * g) / 100) + ' kcal';
            });
        }

        // Close
        const closeModal = () => overlay.remove();
        overlay.querySelector('#modal-close-edit').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        // Save
        overlay.querySelector('#btn-save-edit').addEventListener('click', () => {
            const grams = parseFloat(gramsInput.value) || 0;
            const notes = overlay.querySelector('#edit-notes').value;
            let calories;

            if (isDeleted) {
                calories = parseFloat(overlay.querySelector('#edit-calories').value) || 0;
            } else {
                calories = (calPer100 * grams) / 100;
            }

            updateConsumption(consumptionId, { grams, calories, notes });
            showToast('Consommation modifiée ✅', 'success');
            closeModal();
            render();
        });
    }

    // Helper to avoid circular imports
    function require_store() {
        return { getConsumption: (id) => getConsumptions().find(c => c.id === id), updateConsumption: (id, data) => { /* handled by import */ }, getProduct };
    }

    // Subscribe to data changes
    const unsub = on('consumptions:updated', () => render());
    unsubscribers.push(unsub);

    render();

    return () => {
        unsubscribers.forEach(fn => fn());
    };
}
