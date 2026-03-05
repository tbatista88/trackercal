// ============================================
// Settings View
// ============================================

import { getProfile, setProfile, getSettings, setTheme, getTheme, clearAllData } from '../data/store.js';
import { calculateDailyTarget } from '../data/calories.js';
import { showToast } from '../services/toast.js';
import { navigate } from '../app.js';

export function renderSettings(container) {
    const profile = getProfile();
    const settings = getSettings();
    let editMode = false;

    let formData = profile ? { ...profile } : {};

    function render() {
        const currentTheme = getTheme();

        container.innerHTML = `
      <div class="settings-view">
        <div class="view-header">
          <h1 style="font-size:var(--font-2xl);">Réglages</h1>
        </div>
        
        <div style="padding:0 var(--space-md);">
          
          <!-- Profile Section -->
          <div class="card-glass mb-md">
            <div class="flex-between mb-md">
              <h3 style="font-size:var(--font-lg);">👤 Mon profil</h3>
              <button class="btn btn-ghost btn-sm" id="btn-toggle-edit">
                ${editMode ? '✕ Annuler' : '✏️ Modifier'}
              </button>
            </div>
            
            ${editMode ? renderEditForm() : renderProfileSummary()}
          </div>
          
          <!-- Calorie Info -->
          ${profile ? `
            <div class="card-glass mb-md">
              <h3 style="font-size:var(--font-lg);margin-bottom:var(--space-sm);">🎯 Objectif calorique</h3>
              <div class="flex-between mb-sm">
                <span class="text-secondary" style="font-size:var(--font-sm);">Métabolisme de base</span>
                <strong>${profile.bmr || '–'} kcal</strong>
              </div>
              <div class="flex-between mb-sm">
                <span class="text-secondary" style="font-size:var(--font-sm);">Dépense totale (TDEE)</span>
                <strong>${profile.tdee || '–'} kcal</strong>
              </div>
              <div class="flex-between mb-sm">
                <span class="text-secondary" style="font-size:var(--font-sm);">Déficit quotidien</span>
                <strong>${profile.dailyDeficit || '–'} kcal</strong>
              </div>
              <div class="divider"></div>
              <div class="flex-between">
                <span style="font-weight:var(--fw-semibold);">Objectif quotidien</span>
                <span class="badge badge-accent" style="font-size:var(--font-md);">${profile.dailyTarget || '–'} kcal</span>
              </div>
              
              <div style="margin-top:var(--space-md);padding:var(--space-sm);background:var(--accent-light);border-radius:var(--radius-md);">
                <p style="font-size:var(--font-xs);color:var(--text-secondary);">
                  💡 <strong>Comment est calculé votre objectif ?</strong><br/>
                  Formule de Mifflin-St Jeor pour le métabolisme de base, 
                  multiplié par votre niveau d'activité (TDEE). 
                  Ensuite, un déficit est calculé pour atteindre votre objectif en ${profile.duration || '?'} mois 
                  (1 kg ≈ 7 700 kcal). Minimum : 1 200 kcal/jour.
                </p>
              </div>
            </div>
          ` : ''}
          
          <!-- Theme -->
          <div class="card-glass mb-md">
            <h3 style="font-size:var(--font-lg);margin-bottom:var(--space-sm);">🎨 Apparence</h3>
            <div class="toggle-container">
              <div>
                <strong>Mode sombre</strong>
                <p style="font-size:var(--font-xs);color:var(--text-tertiary);">Basculer entre le thème clair et sombre</p>
              </div>
              <button class="toggle-switch ${currentTheme === 'dark' ? 'active' : ''}" id="btn-toggle-theme" aria-label="Mode sombre"></button>
            </div>
          </div>
          
          <!-- Data Management -->
          <div class="card-glass mb-md">
            <h3 style="font-size:var(--font-lg);margin-bottom:var(--space-sm);">💾 Données</h3>
            <p style="font-size:var(--font-sm);color:var(--text-tertiary);margin-bottom:var(--space-md);">
              Toutes vos données sont stockées localement sur cet appareil.
            </p>
            <button class="btn btn-danger btn-block btn-sm" id="btn-clear-data">
              🗑️ Supprimer toutes les données
            </button>
          </div>
          
          <!-- About -->
          <div class="card-glass mb-lg">
            <h3 style="font-size:var(--font-lg);margin-bottom:var(--space-sm);">ℹ️ À propos</h3>
            <p style="font-size:var(--font-sm);color:var(--text-tertiary);">
              <strong>Mon Suivi Calories</strong> v1.0<br/>
              Application PWA de suivi calorique.<br/>
              Données 100% locales, aucun serveur externe.
            </p>
          </div>
          
        </div>
      </div>
    `;

        attachListeners();
    }

    function renderProfileSummary() {
        if (!profile) return '<p class="text-secondary">Aucun profil configuré</p>';

        const sexLabel = profile.sex === 'homme' ? '👨 Homme' : '👩 Femme';
        const activityLabels = {
            'sedentary': 'Sédentaire',
            'light': 'Léger',
            'moderate': 'Modéré',
            'active': 'Actif',
            'very-active': 'Très actif'
        };

        return `
      <div class="profile-summary">
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Sexe</span>
          <strong>${sexLabel}</strong>
        </div>
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Âge</span>
          <strong>${profile.age} ans</strong>
        </div>
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Taille</span>
          <strong>${profile.height} cm</strong>
        </div>
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Poids actuel</span>
          <strong>${profile.weight} kg</strong>
        </div>
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Objectif</span>
          <strong>${profile.goalWeight} kg</strong>
        </div>
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Durée</span>
          <strong>${profile.duration} mois</strong>
        </div>
        <div class="flex-between">
          <span class="text-secondary" style="font-size:var(--font-sm);">Activité</span>
          <strong>${activityLabels[profile.activityLevel] || 'Sédentaire'}</strong>
        </div>
      </div>
    `;
    }

    function renderEditForm() {
        const activityLevels = [
            { value: 'sedentary', label: 'Sédentaire' },
            { value: 'light', label: 'Léger' },
            { value: 'moderate', label: 'Modéré' },
            { value: 'active', label: 'Actif' }
        ];

        return `
      <div class="edit-form">
        <div class="input-group mb-sm">
          <label class="input-label">Sexe</label>
          <div class="select-group">
            <button class="select-option ${formData.sex === 'femme' ? 'active' : ''}" data-edit-sex="femme">👩 Femme</button>
            <button class="select-option ${formData.sex === 'homme' ? 'active' : ''}" data-edit-sex="homme">👨 Homme</button>
          </div>
        </div>
        
        <div class="flex gap-sm mb-sm">
          <div class="input-group" style="flex:1">
            <label class="input-label" for="edit-age">Âge</label>
            <input class="input-field" type="number" id="edit-age" value="${formData.age}" inputmode="numeric" />
          </div>
          <div class="input-group" style="flex:1">
            <label class="input-label" for="edit-height">Taille (cm)</label>
            <input class="input-field" type="number" id="edit-height" value="${formData.height}" inputmode="numeric" />
          </div>
        </div>
        
        <div class="flex gap-sm mb-sm">
          <div class="input-group" style="flex:1">
            <label class="input-label" for="edit-weight">Poids (kg)</label>
            <input class="input-field" type="number" id="edit-weight" value="${formData.weight}" step="0.1" inputmode="decimal" />
          </div>
          <div class="input-group" style="flex:1">
            <label class="input-label" for="edit-goal">Objectif (kg)</label>
            <input class="input-field" type="number" id="edit-goal" value="${formData.goalWeight}" step="0.1" inputmode="decimal" />
          </div>
        </div>
        
        <div class="input-group mb-sm">
          <label class="input-label" for="edit-duration">Durée (mois)</label>
          <input class="input-field" type="number" id="edit-duration" value="${formData.duration}" inputmode="numeric" />
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label">Activité</label>
          <div class="select-group" style="flex-wrap:wrap;">
            ${activityLevels.map(a => `
              <button class="select-option ${formData.activityLevel === a.value ? 'active' : ''}" data-edit-activity="${a.value}" style="flex:1 1 45%;">${a.label}</button>
            `).join('')}
          </div>
        </div>
        
        <button class="btn btn-primary btn-block" id="btn-save-profile">💾 Enregistrer</button>
      </div>
    `;
    }

    function attachListeners() {
        // Toggle edit
        container.querySelector('#btn-toggle-edit')?.addEventListener('click', () => {
            editMode = !editMode;
            if (editMode && profile) formData = { ...profile };
            render();
        });

        // Edit form listeners
        container.querySelectorAll('[data-edit-sex]').forEach(btn => {
            btn.addEventListener('click', () => {
                formData.sex = btn.dataset.editSex;
                render();
            });
        });

        container.querySelectorAll('[data-edit-activity]').forEach(btn => {
            btn.addEventListener('click', () => {
                formData.activityLevel = btn.dataset.editActivity;
                render();
            });
        });

        // Input bindings
        const bindings = { 'edit-age': 'age', 'edit-height': 'height', 'edit-weight': 'weight', 'edit-goal': 'goalWeight', 'edit-duration': 'duration' };
        for (const [id, key] of Object.entries(bindings)) {
            container.querySelector(`#${id}`)?.addEventListener('input', (e) => {
                formData[key] = e.target.value;
            });
        }

        // Save profile
        container.querySelector('#btn-save-profile')?.addEventListener('click', () => {
            const updated = {
                ...formData,
                age: parseInt(formData.age),
                weight: parseFloat(formData.weight),
                height: parseInt(formData.height) || 170,
                goalWeight: parseFloat(formData.goalWeight),
                duration: parseInt(formData.duration)
            };

            const calc = calculateDailyTarget(updated);

            setProfile({
                ...updated,
                bmr: calc.bmr,
                tdee: calc.tdee,
                dailyDeficit: calc.dailyDeficit,
                dailyTarget: calc.dailyTarget
            });

            editMode = false;
            showToast('Profil mis à jour ! Objectif recalculé.', 'success');
            render();
        });

        // Theme toggle
        container.querySelector('#btn-toggle-theme')?.addEventListener('click', () => {
            const current = getTheme();
            const next = current === 'light' ? 'dark' : 'light';
            setTheme(next);
            render();
        });

        // Clear data
        container.querySelector('#btn-clear-data')?.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr(e) de vouloir supprimer toutes les données ? Cette action est irréversible.')) {
                clearAllData();
                showToast('Toutes les données ont été supprimées', 'info');
                window.location.hash = '';
                window.location.reload();
            }
        });
    }

    render();

    return () => { };
}
