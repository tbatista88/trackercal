// ============================================
// Calorie Calculations
// ============================================

/**
 * Mifflin-St Jeor BMR
 * Men:   10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161 + 166
 *        → 10w + 6.25h − 5a + 5
 * Women: 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161
 */
export function calculateBMR(age, sex, weightKg, heightCm) {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return sex === 'homme' ? base + 5 : base - 161;
}

/**
 * TDEE = BMR × activity multiplier
 * Sedentary: 1.2
 * Light: 1.375
 * Moderate: 1.55
 * Active: 1.725
 * Very Active: 1.9
 */
export function calculateTDEE(bmr, activityLevel = 'sedentary') {
    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        'very-active': 1.9
    };
    return bmr * (multipliers[activityLevel] || 1.2);
}

/**
 * Daily calorie target based on weight loss goal
 * 1 kg of body fat ≈ 7700 kcal
 * deficit = (currentWeight - goalWeight) × 7700 / (durationMonths × 30)
 * target = TDEE - deficit
 * Minimum safe: 1200 kcal/day
 */
export function calculateDailyTarget(profile) {
    const { age, sex, weight, height, goalWeight, duration, activityLevel } = profile;

    const bmr = calculateBMR(age, sex, weight, height || 170);
    const tdee = calculateTDEE(bmr, activityLevel || 'sedentary');

    const weightToLose = weight - goalWeight;
    const totalDays = duration * 30;

    let dailyDeficit = 0;
    if (weightToLose > 0 && totalDays > 0) {
        dailyDeficit = (weightToLose * 7700) / totalDays;
    }

    // If goal is to gain weight, deficit will be negative → target increases
    let target = tdee - dailyDeficit;

    // Safety floor
    if (target < 1200) target = 1200;

    // Safety ceiling (don't exceed TDEE + 1000 for gain)
    if (target > tdee + 1000) target = tdee + 1000;

    return {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        dailyDeficit: Math.round(dailyDeficit),
        dailyTarget: Math.round(target)
    };
}

/**
 * Simple calorie calculation from product
 * calories = caloriesPer100g × grams / 100
 */
export function calculateCalories(caloriesPer100g, grams) {
    return (caloriesPer100g * grams) / 100;
}

/**
 * Convert kJ to kcal
 * 1 kJ ≈ 0.239 kcal
 */
export function kjToKcal(kj) {
    return kj * 0.23900573614;
}
