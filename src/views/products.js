// ============================================
// Products View – Catalog, Search, Barcode
// ============================================

import { getProducts, saveProduct, updateProduct, deleteProduct, getProduct, saveConsumption, on } from '../data/store.js';
import { calculateCalories } from '../data/calories.js';
import { fetchProductByBarcode } from '../services/openfoodfacts.js';
import { showToast } from '../services/toast.js';
import { navigate } from '../app.js';

export function renderProducts(container, params = []) {
    const isSelectMode = params[0] === 'select';
    const preSelectedMeal = params[1] || null;
    let searchQuery = '';
    const unsubscribers = [];

    function render() {
        const products = getProducts();
        const filtered = searchQuery
            ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : products;

        container.innerHTML = `
      <div class="products-view">
        <div class="view-header">
          <div>
            <h1 style="font-size:var(--font-2xl);">${isSelectMode ? 'Choisir un aliment' : 'Mes Produits'}</h1>
            <p style="font-size:var(--font-sm);color:var(--text-tertiary);">${products.length} produit${products.length !== 1 ? 's' : ''}</p>
          </div>
          ${isSelectMode ? `<button class="btn btn-ghost" id="btn-back-dash">✕</button>` : ''}
        </div>
        
        <!-- Search -->
        <div style="padding:0 var(--space-md);margin-bottom:var(--space-md);">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input class="input-field" type="text" id="product-search" 
                   placeholder="Rechercher un aliment..." 
                   value="${searchQuery}" autocomplete="off" />
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-sm" style="padding:0 var(--space-md);margin-bottom:var(--space-md);">
          <button class="btn btn-primary btn-sm" id="btn-add-product" style="flex:1;">
            ➕ Nouveau produit
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-scan-barcode" style="flex:1;">
            📱 Scanner
          </button>
        </div>
        
        <!-- Product List -->
        <div class="products-list" style="padding:0 var(--space-md);">
          ${filtered.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">🍎</div>
              <div class="empty-state-title">${searchQuery ? 'Aucun résultat' : 'Aucun produit'}</div>
              <div class="empty-state-desc">
                ${searchQuery
                    ? 'Essayez un autre terme de recherche ou ajoutez un nouveau produit.'
                    : 'Ajoutez votre premier aliment en appuyant sur le bouton ci-dessus.'
                }
              </div>
            </div>
          ` : filtered.map(p => renderProductCard(p)).join('')}
        </div>
      </div>
    `;

        attachListeners();
    }

    function renderProductCard(product) {
        return `
      <div class="product-card" data-product-id="${product.id}">
        ${product.photo
                ? `<img class="product-card-photo" src="${product.photo}" alt="${product.name}" loading="lazy" />`
                : `<div class="product-card-photo">🍽️</div>`
            }
        <div class="product-card-info">
          <div class="product-card-name">${product.name}</div>
          ${product.description ? `<div class="product-card-desc">${product.description}</div>` : ''}
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div class="product-card-cal">${product.caloriesPer100g} kcal</div>
          <small style="color:var(--text-tertiary);">/ 100 g</small>
        </div>
        ${!isSelectMode ? `
          <div class="product-card-actions" style="flex-direction:column;">
            <button class="btn btn-ghost btn-sm" data-edit-product="${product.id}" style="padding:4px 6px;">✏️</button>
            <button class="btn btn-ghost btn-sm" data-delete-product="${product.id}" style="padding:4px 6px;">🗑️</button>
          </div>
        ` : ''}
      </div>
    `;
    }

    function attachListeners() {
        // Search
        const searchInput = container.querySelector('#product-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                render();
                // Refocus after re-render
                const newInput = container.querySelector('#product-search');
                if (newInput) {
                    newInput.focus();
                    newInput.setSelectionRange(searchQuery.length, searchQuery.length);
                }
            });
        }

        // Back to dashboard
        container.querySelector('#btn-back-dash')?.addEventListener('click', () => {
            navigate('dashboard');
        });

        // Add product
        container.querySelector('#btn-add-product')?.addEventListener('click', () => {
            showProductModal();
        });

        // Scan barcode
        container.querySelector('#btn-scan-barcode')?.addEventListener('click', () => {
            showBarcodeScanner();
        });

        // Click on product card
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking edit/delete
                if (e.target.closest('[data-edit-product]') || e.target.closest('[data-delete-product]')) return;

                const productId = card.dataset.productId;
                if (isSelectMode) {
                    showAddConsumptionModal(productId);
                }
            });
        });

        // Edit product
        container.querySelectorAll('[data-edit-product]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                showProductModal(btn.dataset.editProduct);
            });
        });

        // Delete product
        container.querySelectorAll('[data-delete-product]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Supprimer ce produit ? Les consommations associées seront conservées.')) {
                    deleteProduct(btn.dataset.deleteProduct);
                    showToast('Produit supprimé', 'info');
                    render();
                }
            });
        });
    }

    // ========================================
    // Add/Edit Product Modal
    // ========================================
    function showProductModal(editId = null) {
        const existing = editId ? getProduct(editId) : null;

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-product">✕</button>
        <h3 class="modal-title">${existing ? 'Modifier le produit' : 'Nouveau produit'}</h3>
        
        <div class="photo-upload mb-md" id="photo-upload-area">
          ${existing?.photo ? `<img src="${existing.photo}" alt="Photo" />` : ''}
          <span class="photo-upload-icon" ${existing?.photo ? 'style="display:none"' : ''}>📷</span>
          <span class="photo-upload-text" ${existing?.photo ? 'style="display:none"' : ''}>Ajouter une photo</span>
          <input type="file" accept="image/*" capture="environment" id="photo-input" 
                 style="position:absolute;inset:0;opacity:0;cursor:pointer;" />
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="prod-name">Nom *</label>
          <input class="input-field" type="text" id="prod-name" placeholder="Ex : Pomme, Riz complet..." 
                 value="${existing?.name || ''}" />
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="prod-desc">Description (optionnel)</label>
          <input class="input-field" type="text" id="prod-desc" placeholder="Ex : Bio, marque..." 
                 value="${existing?.description || ''}" />
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="prod-cal">Calories par 100 g *</label>
          <input class="input-field" type="number" id="prod-cal" placeholder="Ex : 52" 
                 value="${existing?.caloriesPer100g || ''}" min="0" inputmode="numeric" />
        </div>
        
        <button class="btn btn-primary btn-block" id="btn-save-product">
          ${existing ? '💾 Enregistrer' : '✅ Ajouter au catalogue'}
        </button>
      </div>
    `;

        document.body.appendChild(overlay);

        let photoData = existing?.photo || null;

        // Photo upload
        const photoInput = overlay.querySelector('#photo-input');
        const photoArea = overlay.querySelector('#photo-upload-area');

        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                // Resize image
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX = 400;
                    let w = img.width, h = img.height;
                    if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } }
                    else { if (h > MAX) { w *= MAX / h; h = MAX; } }
                    canvas.width = w;
                    canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    photoData = canvas.toDataURL('image/jpeg', 0.7);

                    // Show preview
                    let imgEl = photoArea.querySelector('img');
                    if (!imgEl) {
                        imgEl = document.createElement('img');
                        photoArea.appendChild(imgEl);
                    }
                    imgEl.src = photoData;
                    imgEl.alt = 'Photo';
                    photoArea.querySelector('.photo-upload-icon').style.display = 'none';
                    photoArea.querySelector('.photo-upload-text').style.display = 'none';
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        });

        // Close
        const closeModal = () => overlay.remove();
        overlay.querySelector('#modal-close-product').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        // Save
        overlay.querySelector('#btn-save-product').addEventListener('click', () => {
            const name = overlay.querySelector('#prod-name').value.trim();
            const description = overlay.querySelector('#prod-desc').value.trim();
            const caloriesPer100g = parseFloat(overlay.querySelector('#prod-cal').value);

            if (!name) {
                showToast('Veuillez entrer un nom', 'warning');
                return;
            }
            if (isNaN(caloriesPer100g) || caloriesPer100g < 0) {
                showToast('Veuillez entrer des calories valides', 'warning');
                return;
            }

            if (existing) {
                updateProduct(editId, { name, description, caloriesPer100g, photo: photoData });
                showToast('Produit modifié ✅', 'success');
            } else {
                saveProduct({ name, description, caloriesPer100g, photo: photoData });
                showToast('Produit ajouté au catalogue ! 🎉', 'success');
            }

            closeModal();
            render();
        });
    }

    // ========================================
    // Add Consumption Modal
    // ========================================
    function showAddConsumptionModal(productId) {
        const product = getProduct(productId);
        if (!product) return;

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-consumption">✕</button>
        <h3 class="modal-title">Ajouter une consommation</h3>
        
        <div class="card-glass mb-md flex gap-md" style="align-items:center;">
          ${product.photo
                ? `<img src="${product.photo}" alt="${product.name}" style="width:48px;height:48px;border-radius:var(--radius-md);object-fit:cover;" />`
                : `<div style="width:48px;height:48px;border-radius:var(--radius-md);background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;font-size:20px;">🍽️</div>`
            }
          <div style="flex:1;">
            <strong>${product.name}</strong>
            <p style="font-size:var(--font-sm);color:var(--text-tertiary);">${product.caloriesPer100g} kcal / 100 g</p>
          </div>
        </div>
        
        <!-- Quick grams -->
        <div class="mb-md">
          <label class="input-label mb-sm">Quantité rapide</label>
          <div class="flex gap-sm" style="flex-wrap:wrap;">
            <button class="btn-quick-gram" data-quick-gram="25">25g</button>
            <button class="btn-quick-gram" data-quick-gram="50">50g</button>
            <button class="btn-quick-gram" data-quick-gram="100">100g</button>
            <button class="btn-quick-gram" data-quick-gram="150">150g</button>
            <button class="btn-quick-gram" data-quick-gram="200">200g</button>
            <button class="btn-quick-gram" data-quick-gram="250">250g</button>
          </div>
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="cons-grams">Quantité en grammes</label>
          <input class="input-field" type="number" id="cons-grams" placeholder="Ex : 150" min="1" inputmode="numeric" />
        </div>
        
        <div class="card-glass-heavy mb-md" style="text-align:center;padding:var(--space-lg);">
          <div style="font-size:var(--font-3xl);font-weight:var(--fw-bold);color:var(--accent);" id="cal-preview">0</div>
          <div style="font-size:var(--font-sm);color:var(--text-tertiary);">calories</div>
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label">Repas</label>
          <div class="select-group" style="flex-wrap:wrap;">
            <button class="select-option ${(preSelectedMeal || 'collation') === 'petit-dejeuner' ? 'active' : ''}" data-meal="petit-dejeuner" style="flex:1 1 45%;">🌅 Petit-déj.</button>
            <button class="select-option ${(preSelectedMeal || 'collation') === 'dejeuner' ? 'active' : ''}" data-meal="dejeuner" style="flex:1 1 45%;">☀️ Déjeuner</button>
            <button class="select-option ${(preSelectedMeal || 'collation') === 'diner' ? 'active' : ''}" data-meal="diner" style="flex:1 1 45%;">🌙 Dîner</button>
            <button class="select-option ${(!preSelectedMeal || preSelectedMeal === 'collation') ? 'active' : ''}" data-meal="collation" style="flex:1 1 45%;">🍪 Collation</button>
          </div>
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="cons-notes">Notes (optionnel)</label>
          <input class="input-field" type="text" id="cons-notes" placeholder="Ex : avec sauce..." />
        </div>
        
        <button class="btn btn-primary btn-block btn-lg" id="btn-confirm-consumption">
          ✅ Enregistrer
        </button>
      </div>
    `;

        document.body.appendChild(overlay);

        let selectedMeal = preSelectedMeal || 'collation';
        const gramsInput = overlay.querySelector('#cons-grams');
        const calPreview = overlay.querySelector('#cal-preview');

        // Update preview
        function updatePreview() {
            const g = parseFloat(gramsInput.value) || 0;
            const cal = calculateCalories(product.caloriesPer100g, g);
            calPreview.textContent = Math.round(cal);
        }

        gramsInput.addEventListener('input', updatePreview);

        // Quick gram buttons
        overlay.querySelectorAll('[data-quick-gram]').forEach(btn => {
            btn.addEventListener('click', () => {
                gramsInput.value = btn.dataset.quickGram;
                overlay.querySelectorAll('.btn-quick-gram').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updatePreview();
            });
        });

        // Meal selection
        overlay.querySelectorAll('[data-meal]').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedMeal = btn.dataset.meal;
                overlay.querySelectorAll('[data-meal]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Close
        const closeModal = () => overlay.remove();
        overlay.querySelector('#modal-close-consumption').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        // Confirm
        overlay.querySelector('#btn-confirm-consumption').addEventListener('click', () => {
            const grams = parseFloat(gramsInput.value) || 0;
            if (grams <= 0) {
                showToast('Veuillez entrer une quantité valide', 'warning');
                return;
            }

            const calories = calculateCalories(product.caloriesPer100g, grams);
            const notes = overlay.querySelector('#cons-notes').value.trim();

            saveConsumption({
                productId: product.id,
                productNameBackup: product.name,
                productPhotoBackup: product.photo,
                caloriesPer100gBackup: product.caloriesPer100g,
                grams,
                calories,
                meal: selectedMeal,
                notes
            });

            showToast(`${product.name} – ${Math.round(calories)} kcal ajouté ! ✅`, 'success');
            closeModal();
            navigate('dashboard');
        });
    }

    // ========================================
    // Barcode Scanner
    // ========================================
    async function showBarcodeScanner() {
        // Dynamically import html5-qrcode
        let Html5Qrcode;
        try {
            const module = await import('html5-qrcode');
            Html5Qrcode = module.Html5Qrcode;
        } catch (e) {
            showToast('Scanner non disponible', 'error');
            // Fallback: manual barcode input
            showManualBarcodeInput();
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.alignItems = 'center';
        overlay.innerHTML = `
      <div class="modal-content" style="border-radius:var(--radius-xl);max-height:95vh;">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-scanner">✕</button>
        <h3 class="modal-title">📱 Scanner le code-barres</h3>
        <div id="scanner-container" style="width:100%;border-radius:var(--radius-md);overflow:hidden;margin-bottom:var(--space-md);"></div>
        <p style="text-align:center;font-size:var(--font-sm);color:var(--text-tertiary);margin-bottom:var(--space-md);">
          Placez le code-barres devant la caméra
        </p>
        <button class="btn btn-secondary btn-block btn-sm" id="btn-manual-barcode">
          ⌨️ Entrer le code manuellement
        </button>
      </div>
    `;

        document.body.appendChild(overlay);

        const scanner = new Html5Qrcode('scanner-container');
        let scanning = true;

        const closeModal = () => {
            scanning = false;
            scanner.stop().catch(() => { });
            overlay.remove();
        };

        overlay.querySelector('#modal-close-scanner').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        overlay.querySelector('#btn-manual-barcode').addEventListener('click', () => {
            closeModal();
            showManualBarcodeInput();
        });

        try {
            await scanner.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 100 }, aspectRatio: 1.0 },
                async (decodedText) => {
                    if (!scanning) return;
                    scanning = false;
                    await scanner.stop();
                    closeModal();
                    await processBarcode(decodedText);
                }
            );
        } catch (err) {
            console.error('Scanner error:', err);
            closeModal();
            showToast('Impossible d\'accéder à la caméra', 'error');
            showManualBarcodeInput();
        }
    }

    function showManualBarcodeInput() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-manual">✕</button>
        <h3 class="modal-title">⌨️ Entrer le code-barres</h3>
        <div class="input-group mb-md">
          <label class="input-label" for="manual-barcode">Code-barres</label>
          <input class="input-field" type="text" id="manual-barcode" placeholder="Ex : 3017620422003" inputmode="numeric" />
        </div>
        <button class="btn btn-primary btn-block" id="btn-search-barcode">🔍 Rechercher</button>
      </div>
    `;

        document.body.appendChild(overlay);

        const closeModal = () => overlay.remove();
        overlay.querySelector('#modal-close-manual').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        overlay.querySelector('#btn-search-barcode').addEventListener('click', async () => {
            const barcode = overlay.querySelector('#manual-barcode').value.trim();
            if (!barcode) {
                showToast('Veuillez entrer un code-barres', 'warning');
                return;
            }
            closeModal();
            await processBarcode(barcode);
        });
    }

    async function processBarcode(barcode) {
        showToast('Recherche en cours...', 'info', 2000);

        const result = await fetchProductByBarcode(barcode);

        if (!result) {
            showToast('Produit non trouvé dans la base Open Food Facts', 'error');
            return;
        }

        // Show result modal
        showBarcodeResultModal(result);
    }

    function showBarcodeResultModal(result) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-result">✕</button>
        <h3 class="modal-title">Produit trouvé ! 🎉</h3>
        
        ${result.image
                ? `<img src="${result.image}" alt="${result.name}" 
               style="width:100%;max-height:200px;object-fit:contain;border-radius:var(--radius-md);margin-bottom:var(--space-md);background:var(--bg-secondary);" />`
                : ''
            }
        
        <div class="card-glass mb-md">
          <h4>${result.name}</h4>
          ${result.brand ? `<p style="font-size:var(--font-sm);color:var(--text-tertiary);">${result.brand}</p>` : ''}
          <div style="margin-top:var(--space-sm);">
            <span class="badge badge-accent" style="font-size:var(--font-md);">${result.caloriesPer100g} kcal / 100 g</span>
          </div>
        </div>
        
        <button class="btn btn-primary btn-block btn-lg" id="btn-add-barcode-product">
          ✅ Ajouter au catalogue
        </button>
      </div>
    `;

        document.body.appendChild(overlay);

        const closeModal = () => overlay.remove();
        overlay.querySelector('#modal-close-result').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        overlay.querySelector('#btn-add-barcode-product').addEventListener('click', () => {
            saveProduct({
                name: result.name,
                description: result.brand || '',
                caloriesPer100g: result.caloriesPer100g,
                photo: result.image || null
            });

            showToast('Produit ajouté au catalogue ! 🎉', 'success');
            closeModal();
            render();
        });
    }

    // Subscribe to updates
    const unsub = on('products:updated', () => render());
    unsubscribers.push(unsub);

    render();

    return () => {
        unsubscribers.forEach(fn => fn());
    };
}
