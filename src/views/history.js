// ============================================
// History View – Charts & Analytics
// ============================================

import { getProfile, getConsumptions, getConsumptionsByDateRange, getProduct } from '../data/store.js';

export function renderHistory(container) {
    const profile = getProfile();
    const target = profile?.dailyTarget || 2000;
    let activeFilter = 'jour';
    let chartInstance = null;

    function render() {
        container.innerHTML = `
      <div class="history-view">
        <div class="view-header">
          <h1 style="font-size:var(--font-2xl);">Historique</h1>
        </div>
        
        <!-- Filter Tabs -->
        <div style="padding:0 var(--space-md);margin-bottom:var(--space-md);">
          <div class="filter-tabs">
            <button class="filter-tab ${activeFilter === 'jour' ? 'active' : ''}" data-filter="jour">Jour</button>
            <button class="filter-tab ${activeFilter === 'semaine' ? 'active' : ''}" data-filter="semaine">Semaine</button>
            <button class="filter-tab ${activeFilter === 'mois' ? 'active' : ''}" data-filter="mois">Mois</button>
          </div>
        </div>
        
        <!-- Chart -->
        <div class="card-glass" style="margin:0 var(--space-md) var(--space-md);padding:var(--space-md);">
          <canvas id="calorie-chart" height="200"></canvas>
        </div>
        
        <!-- Daily Breakdown -->
        <div id="history-details" style="padding:0 var(--space-md);"></div>
      </div>
    `;

        attachListeners();
        renderChart();
        renderDetails();
    }

    function attachListeners() {
        container.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                activeFilter = btn.dataset.filter;
                render();
            });
        });
    }

    function getDateRange() {
        const today = new Date();
        today.setHours(12, 0, 0, 0);
        let startDate, endDate;

        switch (activeFilter) {
            case 'jour': {
                // Last 7 days
                startDate = new Date(today);
                startDate.setDate(startDate.getDate() - 6);
                endDate = new Date(today);
                break;
            }
            case 'semaine': {
                // Last 4 weeks
                startDate = new Date(today);
                startDate.setDate(startDate.getDate() - 27);
                endDate = new Date(today);
                break;
            }
            case 'mois': {
                // Last 6 months
                startDate = new Date(today);
                startDate.setMonth(startDate.getMonth() - 5);
                startDate.setDate(1);
                endDate = new Date(today);
                break;
            }
        }

        return {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
        };
    }

    function aggregateData() {
        const { start, end } = getDateRange();
        const consumptions = getConsumptionsByDateRange(start, end);

        // Group by day
        const dayTotals = {};
        consumptions.forEach(c => {
            if (!dayTotals[c.date]) dayTotals[c.date] = 0;
            dayTotals[c.date] += c.calories || 0;
        });

        if (activeFilter === 'jour') {
            // Return daily data for last 7 days
            const labels = [];
            const values = [];
            const today = new Date();
            today.setHours(12, 0, 0, 0);

            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const dayLabel = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
                labels.push(dayLabel);
                values.push(Math.round(dayTotals[dateStr] || 0));
            }
            return { labels, values };
        }

        if (activeFilter === 'semaine') {
            // Aggregate by week
            const labels = [];
            const values = [];
            const today = new Date();
            today.setHours(12, 0, 0, 0);

            for (let w = 3; w >= 0; w--) {
                const weekEnd = new Date(today);
                weekEnd.setDate(weekEnd.getDate() - w * 7);
                const weekStart = new Date(weekEnd);
                weekStart.setDate(weekStart.getDate() - 6);

                let total = 0;
                let days = 0;
                for (let i = 0; i <= 6; i++) {
                    const d = new Date(weekStart);
                    d.setDate(d.getDate() + i);
                    const dateStr = d.toISOString().split('T')[0];
                    if (dayTotals[dateStr]) {
                        total += dayTotals[dateStr];
                        days++;
                    }
                }

                const avg = days > 0 ? Math.round(total / days) : 0;
                const startLabel = weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
                labels.push(`Sem. ${startLabel}`);
                values.push(avg);
            }
            return { labels, values };
        }

        if (activeFilter === 'mois') {
            const labels = [];
            const values = [];
            const today = new Date();

            for (let m = 5; m >= 0; m--) {
                const monthDate = new Date(today.getFullYear(), today.getMonth() - m, 1);
                const monthEnd = new Date(today.getFullYear(), today.getMonth() - m + 1, 0);

                let total = 0;
                let days = 0;
                for (let d = 1; d <= monthEnd.getDate(); d++) {
                    const dateStr = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    if (dayTotals[dateStr]) {
                        total += dayTotals[dateStr];
                        days++;
                    }
                }

                const avg = days > 0 ? Math.round(total / days) : 0;
                labels.push(monthDate.toLocaleDateString('fr-FR', { month: 'short' }));
                values.push(avg);
            }
            return { labels, values };
        }

        return { labels: [], values: [] };
    }

    async function renderChart() {
        const canvas = container.querySelector('#calorie-chart');
        if (!canvas) return;

        const { labels, values } = aggregateData();

        // Dynamic import Chart.js
        let Chart;
        try {
            const module = await import('chart.js');
            Chart = module.Chart;

            // Register components
            const { CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, BarController, LineController } = module;
            Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, BarController, LineController);
        } catch (e) {
            console.error('Chart.js not available:', e);
            canvas.parentElement.innerHTML = '<p style="text-align:center;color:var(--text-tertiary);padding:var(--space-lg);">Graphique non disponible</p>';
            return;
        }

        if (chartInstance) {
            chartInstance.destroy();
        }

        const ctx = canvas.getContext('2d');
        const isOverTarget = values.map(v => v > target);

        // Get computed styles for theming
        const styles = getComputedStyle(document.documentElement);
        const textColor = styles.getPropertyValue('--text-secondary').trim() || '#6B4D5A';
        const accentColor = styles.getPropertyValue('--accent').trim() || '#E91E8C';
        const dangerColor = '#F44336';
        const gridColor = styles.getPropertyValue('--divider').trim() || 'rgba(0,0,0,0.06)';

        chartInstance = new Chart(ctx, {
            type: activeFilter === 'jour' ? 'bar' : 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: activeFilter === 'jour' ? 'Calories' : 'Moy. calories',
                        data: values,
                        backgroundColor: values.map(v => v > target ? 'rgba(244, 67, 54, 0.6)' : 'rgba(233, 30, 140, 0.5)'),
                        borderColor: values.map(v => v > target ? dangerColor : accentColor),
                        borderWidth: 2,
                        borderRadius: activeFilter === 'jour' ? 8 : 0,
                        tension: 0.4,
                        fill: activeFilter !== 'jour',
                        pointBackgroundColor: accentColor,
                        pointRadius: activeFilter !== 'jour' ? 4 : 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 8,
                        padding: 12,
                        callbacks: {
                            label: (ctx) => `${ctx.raw} kcal`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: textColor, font: { size: 11 } }
                    },
                    y: {
                        grid: { color: gridColor },
                        ticks: { color: textColor, font: { size: 11 } },
                        beginAtZero: true
                    }
                },
                // Target line
                annotation: {
                    annotations: {
                        targetLine: {
                            type: 'line',
                            yMin: target,
                            yMax: target,
                            borderColor: 'rgba(255, 152, 0, 0.5)',
                            borderWidth: 2,
                            borderDash: [5, 5]
                        }
                    }
                }
            }
        });
    }

    function renderDetails() {
        const detailsContainer = container.querySelector('#history-details');
        if (!detailsContainer) return;

        const today = new Date();
        today.setHours(12, 0, 0, 0);
        const days = activeFilter === 'jour' ? 7 : activeFilter === 'semaine' ? 7 : 30;

        let html = '';

        for (let i = 0; i < days; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const items = getConsumptions(dateStr);
            const total = items.reduce((s, c) => s + (c.calories || 0), 0);

            if (items.length === 0) continue;

            const isOver = total > target;
            const dayLabel = i === 0 ? 'Aujourd\'hui' : i === 1 ? 'Hier' : d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

            html += `
        <div class="card-glass mb-sm history-day-card" data-day="${dateStr}">
          <div class="flex-between" style="cursor:pointer;" data-toggle-day="${dateStr}">
            <div>
              <strong style="font-size:var(--font-sm);">${dayLabel}</strong>
            </div>
            <div style="text-align:right;">
              <span class="badge ${isOver ? 'badge-danger' : 'badge-success'}" style="font-size:var(--font-sm);">
                ${Math.round(total)} / ${target} kcal
              </span>
            </div>
          </div>
          <div class="history-day-items" id="day-items-${dateStr}" style="display:none;margin-top:var(--space-sm);">
            ${items.map(c => {
                const product = c.productId ? getProduct(c.productId) : null;
                const name = product?.name || c.productNameBackup || 'Produit inconnu';
                return `
                <div class="consumption-item" style="padding:var(--space-xs) 0;">
                  <div class="consumption-item-info">
                    <div class="consumption-item-name" style="font-size:var(--font-xs);">${name}</div>
                    <div class="consumption-item-detail">${c.grams}g</div>
                  </div>
                  <div style="font-size:var(--font-sm);font-weight:var(--fw-semibold);">${Math.round(c.calories)} kcal</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
        }

        if (!html) {
            html = `
        <div class="empty-state">
          <div class="empty-state-icon">📊</div>
          <div class="empty-state-title">Aucune donnée</div>
          <div class="empty-state-desc">Commencez à enregistrer vos repas pour voir votre historique.</div>
        </div>
      `;
        }

        detailsContainer.innerHTML = html;

        // Toggle day details
        detailsContainer.querySelectorAll('[data-toggle-day]').forEach(btn => {
            btn.addEventListener('click', () => {
                const dateStr = btn.dataset.toggleDay;
                const items = detailsContainer.querySelector(`#day-items-${dateStr}`);
                if (items) {
                    items.style.display = items.style.display === 'none' ? 'block' : 'none';
                }
            });
        });
    }

    render();

    return () => {
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
    };
}
