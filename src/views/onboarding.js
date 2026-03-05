// ============================================
// Onboarding View – Profile Setup
// ============================================

import { setProfile } from '../data/store.js';
import { calculateDailyTarget } from '../data/calories.js';
import { showToast } from '../services/toast.js';

const STEPS = [
  {
    id: 'welcome',
    title: 'Bienvenue ! 🌸',
    subtitle: 'Configurons votre profil pour calculer votre objectif calorique quotidien.'
  },
  {
    id: 'basics',
    title: 'Informations de base',
    subtitle: 'Ces données nous aident à calculer votre métabolisme.'
  },
  {
    id: 'goals',
    title: 'Votre objectif',
    subtitle: 'Définissez votre poids cible et la durée souhaitée.'
  },
  {
    id: 'summary',
    title: 'Votre plan',
    subtitle: 'Voici votre objectif calorique calculé.'
  }
];

export function renderOnboarding(container) {
  let currentStep = 0;
  let formData = {
    age: '',
    sex: 'femme',
    weight: '',
    height: '170',
    goalWeight: '',
    duration: '3',
    activityLevel: 'sedentary'
  };

  function render() {
    const step = STEPS[currentStep];

    container.innerHTML = `
      <div class="onboarding">
        <div class="onboarding-header">
          <div class="onboarding-progress">
            ${STEPS.map((_, i) => `
              <div class="onboarding-dot ${i <= currentStep ? 'active' : ''}"></div>
            `).join('')}
          </div>
          <h2 class="onboarding-title anim-fade-in">${step.title}</h2>
          <p class="onboarding-subtitle anim-fade-in">${step.subtitle}</p>
        </div>
        <div class="onboarding-body anim-slide-up">
          ${renderStepContent()}
        </div>
        <div class="onboarding-footer">
          ${currentStep > 0 ? `<button class="btn btn-ghost" id="btn-prev">← Retour</button>` : '<div></div>'}
          ${currentStep < STEPS.length - 1
        ? `<button class="btn btn-primary" id="btn-next">Suivant →</button>`
        : `<button class="btn btn-primary btn-lg" id="btn-finish">🚀 Commencer !</button>`
      }
        </div>
      </div>
    `;

    attachListeners();
  }

  function renderStepContent() {
    switch (currentStep) {
      case 0: return renderWelcome();
      case 1: return renderBasics();
      case 2: return renderGoals();
      case 3: return renderSummary();
      default: return '';
    }
  }

  function renderWelcome() {
    return `
      <div class="onboarding-welcome">
        <div class="onboarding-icon anim-float">🌸</div>
        <div class="card-glass" style="margin-top:var(--space-lg);">
          <h3 style="margin-bottom:var(--space-sm);">Mon Suivi Calories</h3>
          <p style="font-size:var(--font-sm);">
            Suivez vos calories quotidiennes de manière simple et intuitive. 
            Toutes vos données restent sur votre appareil.
          </p>
        </div>
        <div class="card-glass" style="margin-top:var(--space-md);">
          <div class="flex gap-md" style="align-items:flex-start;">
            <span style="font-size:24px;">🔒</span>
            <div>
              <strong>100% privé</strong>
              <p style="font-size:var(--font-xs);">Aucun serveur, aucun compte. Vos données restent sur cet appareil.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderBasics() {
    const activityLevels = [
      { value: 'sedentary', label: 'Sédentaire', desc: 'Bureau, peu d\'exercice' },
      { value: 'light', label: 'Léger', desc: 'Exercice 1-3j/semaine' },
      { value: 'moderate', label: 'Modéré', desc: 'Exercice 3-5j/semaine' },
      { value: 'active', label: 'Actif', desc: 'Exercice 6-7j/semaine' }
    ];

    return `
      <div class="onboarding-form">
        <div class="input-group">
          <label class="input-label">Sexe</label>
          <div class="select-group">
            <button class="select-option ${formData.sex === 'femme' ? 'active' : ''}" data-sex="femme">👩 Femme</button>
            <button class="select-option ${formData.sex === 'homme' ? 'active' : ''}" data-sex="homme">👨 Homme</button>
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-label" for="onb-age">Âge</label>
          <input class="input-field" type="number" id="onb-age" placeholder="Ex : 30" 
                 value="${formData.age}" min="15" max="100" inputmode="numeric" />
        </div>
        
        <div class="flex gap-md">
          <div class="input-group" style="flex:1">
            <label class="input-label" for="onb-height">Taille (cm)</label>
            <input class="input-field" type="number" id="onb-height" placeholder="170" 
                   value="${formData.height}" min="100" max="250" inputmode="numeric" />
          </div>
          <div class="input-group" style="flex:1">
            <label class="input-label" for="onb-weight">Poids actuel (kg)</label>
            <input class="input-field" type="number" id="onb-weight" placeholder="70" 
                   value="${formData.weight}" min="30" max="300" step="0.1" inputmode="decimal" />
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-label">Niveau d'activité</label>
          <div class="activity-levels">
            ${activityLevels.map(a => `
              <button class="activity-option ${formData.activityLevel === a.value ? 'active' : ''}" data-activity="${a.value}">
                <strong>${a.label}</strong>
                <small>${a.desc}</small>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderGoals() {
    return `
      <div class="onboarding-form">
        <div class="input-group">
          <label class="input-label" for="onb-goal">Objectif de poids (kg)</label>
          <input class="input-field" type="number" id="onb-goal" placeholder="Ex : 65" 
                 value="${formData.goalWeight}" min="30" max="300" step="0.1" inputmode="decimal" />
          <span class="input-hint">Le poids que vous aimeriez atteindre</span>
        </div>
        
        <div class="input-group">
          <label class="input-label" for="onb-duration">Durée (mois)</label>
          <input class="input-field" type="number" id="onb-duration" placeholder="Ex : 3" 
                 value="${formData.duration}" min="1" max="24" inputmode="numeric" />
          <span class="input-hint">En combien de mois souhaitez-vous atteindre votre objectif ?</span>
        </div>
        
        <div class="card-glass" style="margin-top:var(--space-md);">
          <div class="flex gap-sm" style="align-items:flex-start">
            <span>💡</span>
            <div>
              <p style="font-size:var(--font-sm);">
                <strong>Conseil :</strong> une perte de 0,5 à 1 kg par semaine est recommandée 
                pour un résultat durable et sain.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderSummary() {
    const calc = calculateDailyTarget({
      age: parseInt(formData.age) || 30,
      sex: formData.sex,
      weight: parseFloat(formData.weight) || 70,
      height: parseInt(formData.height) || 170,
      goalWeight: parseFloat(formData.goalWeight) || 65,
      duration: parseInt(formData.duration) || 3,
      activityLevel: formData.activityLevel
    });

    const weightDiff = (parseFloat(formData.weight) || 70) - (parseFloat(formData.goalWeight) || 65);
    const isLoss = weightDiff > 0;

    return `
      <div class="onboarding-summary">
        <div class="summary-target-card card-glass-heavy">
          <div class="summary-target-icon">${isLoss ? '📉' : '📈'}</div>
          <div class="summary-target-value">${calc.dailyTarget}</div>
          <div class="summary-target-unit">kcal / jour</div>
          <div class="summary-target-label">Votre objectif calorique quotidien</div>
        </div>
        
        <div class="summary-details">
          <div class="card-glass">
            <div class="flex-between">
              <span class="text-secondary" style="font-size:var(--font-sm);">Métabolisme de base (BMR)</span>
              <strong>${calc.bmr} kcal</strong>
            </div>
          </div>
          <div class="card-glass">
            <div class="flex-between">
              <span class="text-secondary" style="font-size:var(--font-sm);">Dépense totale (TDEE)</span>
              <strong>${calc.tdee} kcal</strong>
            </div>
          </div>
          <div class="card-glass">
            <div class="flex-between">
              <span class="text-secondary" style="font-size:var(--font-sm);">${isLoss ? 'Déficit' : 'Surplus'} quotidien</span>
              <strong>${Math.abs(calc.dailyDeficit)} kcal</strong>
            </div>
          </div>
          <div class="card-glass">
            <div class="flex-between">
              <span class="text-secondary" style="font-size:var(--font-sm);">${isLoss ? 'Perte' : 'Gain'} visé${isLoss ? 'e' : ''}</span>
              <strong>${Math.abs(weightDiff).toFixed(1)} kg en ${formData.duration} mois</strong>
            </div>
          </div>
        </div>
        
        <div class="card-glass" style="margin-top:var(--space-sm);">
          <div class="flex gap-sm" style="align-items:flex-start">
            <span>ℹ️</span>
            <p style="font-size:var(--font-xs);color:var(--text-tertiary);">
              Ce calcul utilise la formule de Mifflin-St Jeor. 
              1 kg de graisse ≈ 7 700 kcal. Le déficit est réparti sur la durée choisie. 
              Minimum sécuritaire : 1 200 kcal/jour.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // Read ALL current input values from the DOM before navigating
  function syncFormDataFromDOM() {
    const fields = {
      'onb-age': 'age',
      'onb-height': 'height',
      'onb-weight': 'weight',
      'onb-goal': 'goalWeight',
      'onb-duration': 'duration'
    };
    for (const [id, key] of Object.entries(fields)) {
      const input = container.querySelector(`#${id}`);
      if (input) {
        formData[key] = input.value;
      }
    }
  }

  function attachListeners() {
    // Sex selection
    container.querySelectorAll('[data-sex]').forEach(btn => {
      btn.addEventListener('click', () => {
        syncFormDataFromDOM();
        formData.sex = btn.dataset.sex;
        render();
      });
    });

    // Activity level
    container.querySelectorAll('[data-activity]').forEach(btn => {
      btn.addEventListener('click', () => {
        syncFormDataFromDOM();
        formData.activityLevel = btn.dataset.activity;
        render();
      });
    });

    // Input fields – update formData on each keystroke
    const fields = {
      'onb-age': 'age',
      'onb-height': 'height',
      'onb-weight': 'weight',
      'onb-goal': 'goalWeight',
      'onb-duration': 'duration'
    };

    for (const [id, key] of Object.entries(fields)) {
      const input = container.querySelector(`#${id}`);
      if (input) {
        input.addEventListener('input', () => {
          formData[key] = input.value;
        });
      }
    }

    // Navigation
    const btnNext = container.querySelector('#btn-next');
    const btnPrev = container.querySelector('#btn-prev');
    const btnFinish = container.querySelector('#btn-finish');

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        syncFormDataFromDOM();
        if (validateStep()) {
          currentStep++;
          render();
        }
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        syncFormDataFromDOM();
        currentStep--;
        render();
      });
    }

    if (btnFinish) {
      btnFinish.addEventListener('click', () => {
        syncFormDataFromDOM();
        finishOnboarding();
      });
    }
  }

  function validateStep() {
    switch (currentStep) {
      case 1: {
        if (!formData.age || parseInt(formData.age) < 15) {
          showToast('Veuillez entrer un âge valide (15+)', 'warning');
          return false;
        }
        if (!formData.weight || parseFloat(formData.weight) < 30) {
          showToast('Veuillez entrer un poids valide', 'warning');
          return false;
        }
        return true;
      }
      case 2: {
        if (!formData.goalWeight || parseFloat(formData.goalWeight) < 30) {
          showToast('Veuillez entrer un objectif de poids valide', 'warning');
          return false;
        }
        if (!formData.duration || parseInt(formData.duration) < 1) {
          showToast('Veuillez entrer une durée valide (minimum 1 mois)', 'warning');
          return false;
        }
        return true;
      }
      default:
        return true;
    }
  }

  function finishOnboarding() {
    const calc = calculateDailyTarget({
      age: parseInt(formData.age),
      sex: formData.sex,
      weight: parseFloat(formData.weight),
      height: parseInt(formData.height) || 170,
      goalWeight: parseFloat(formData.goalWeight),
      duration: parseInt(formData.duration),
      activityLevel: formData.activityLevel
    });

    setProfile({
      ...formData,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseInt(formData.height) || 170,
      goalWeight: parseFloat(formData.goalWeight),
      duration: parseInt(formData.duration),
      bmr: calc.bmr,
      tdee: calc.tdee,
      dailyDeficit: calc.dailyDeficit,
      dailyTarget: calc.dailyTarget
    });

    showToast('Profil créé avec succès ! 🎉', 'success');
  }

  render();

  return () => { };
}
