const app = {
    state: {
        currentTab: 'home'
    },

    charts: {},

    init: function () {
        // Render Math Formulas
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(document.body, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false }
                ],
                throwOnError: false
            });
        }

        this.setupCharts();
    },

    navigate: function (targetId) {
        // If navigating to an external page (not a section), let the default link behavior happen
        // or handle it if we want to mix SPA/Multi-page.
        // For now, we keep the strict SPA logic for the main sections: home, impact, engineering, about.

        // Update Nav Buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.dataset.target === targetId) {
                btn.classList.add('text-blue-600', 'bg-slate-50');
                btn.classList.remove('text-slate-600');
            } else {
                btn.classList.remove('text-blue-600', 'bg-slate-50');
                btn.classList.add('text-slate-600');
            }
        });

        // Update Sections
        document.querySelectorAll('.page-section').forEach(sec => {
            sec.classList.add('hidden');
        });

        const targetSec = document.getElementById('page-' + targetId);
        if (targetSec) {
            targetSec.classList.remove('hidden');

            // Trigger reflow for animation
            targetSec.classList.remove('fade-enter');
            void targetSec.offsetWidth;
            targetSec.classList.add('fade-enter');
        }

        // Resize charts if appearing
        if (targetId === 'impact' && this.charts.impact) this.charts.impact.resize();
        if (targetId === 'engineering' && this.charts.capping) this.charts.capping.resize();

        window.scrollTo(0, 0);
    },

    setupCharts: function () {
        // 1. Home Sector Chart (New)
        const ctxHomeSector = document.getElementById('homeSectorChart');
        if (ctxHomeSector) {
            new Chart(ctxHomeSector, {
                type: 'doughnut',
                data: {
                    labels: ['Santé / Pharma', 'Luxe / Conso', 'Industrie / Auto', 'Finance / Assurance', 'Autres'],
                    datasets: [{
                        data: [30, 25, 25, 15, 5],
                        backgroundColor: [
                            '#ef4444', // Red (Swiss Health)
                            '#3b82f6', // Blue (French Luxury)
                            '#f59e0b', // Amber (German Industry)
                            '#10b981', // Emerald (Italian Finance)
                            '#94a3b8'  // Gray
                        ],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } }
                    },
                    cutout: '60%'
                }
            });
        }

        // 2. Impact Chart
        const ctxImpact = document.getElementById('impactChart');
        if (ctxImpact) {
            this.charts.impact = new Chart(ctxImpact, {
                type: 'line',
                data: {
                    labels: ['2024', '2025', '2026', '2027', '2028'],
                    datasets: [{
                        label: 'Avec Indice Alpin (Projection)',
                        data: [100, 115, 135, 160, 190],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Sans Indice (Status Quo)',
                        data: [100, 105, 110, 116, 122],
                        borderColor: '#94a3b8',
                        borderDash: [5, 5],
                        fill: false
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        // 2. Capping Chart
        const ctxCap = document.getElementById('cappingChart');
        if (ctxCap) {
            this.charts.capping = new Chart(ctxCap, {
                type: 'doughnut',
                data: {
                    labels: ['Nestlé (Plafonné 10%)', 'LVMH (Plafonné 10%)', 'Roche (Plafonné 10%)', 'Autres (70%)'],
                    datasets: [{
                        data: [10, 10, 10, 70],
                        backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#cbd5e1'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: { display: true, text: 'Répartition après règle des 10%' },
                        legend: { position: 'right' }
                    }
                }
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
