// ============================================
// Open Food Facts API Service
// ============================================

import { kjToKcal } from '../data/calories.js';

/**
 * Fetch product from Open Food Facts by barcode
 * @param {string} barcode
 * @returns {Promise<{name, image, caloriesPer100g}|null>}
 */
export async function fetchProductByBarcode(barcode) {
    try {
        const response = await fetch(
            `https://world.openfoodfacts.org/api/v2/product/${barcode}`,
            { headers: { 'User-Agent': 'MonSuiviCalories/1.0' } }
        );

        if (!response.ok) return null;

        const data = await response.json();

        if (data.status !== 1 || !data.product) return null;

        const product = data.product;

        // Extract calories per 100g
        let caloriesPer100g = 0;
        const nutriments = product.nutriments || {};

        if (nutriments['energy-kcal_100g']) {
            caloriesPer100g = parseFloat(nutriments['energy-kcal_100g']);
        } else if (nutriments['energy-kcal']) {
            caloriesPer100g = parseFloat(nutriments['energy-kcal']);
        } else if (nutriments['energy_100g']) {
            // Energy in kJ, convert
            caloriesPer100g = Math.round(kjToKcal(parseFloat(nutriments['energy_100g'])));
        } else if (nutriments['energy']) {
            caloriesPer100g = Math.round(kjToKcal(parseFloat(nutriments['energy'])));
        }

        return {
            name: product.product_name || product.product_name_fr || 'Produit inconnu',
            image: product.image_front_url || product.image_front_small_url || null,
            caloriesPer100g: Math.round(caloriesPer100g),
            brand: product.brands || '',
            barcode: barcode
        };
    } catch (error) {
        console.error('Erreur API Open Food Facts:', error);
        return null;
    }
}
