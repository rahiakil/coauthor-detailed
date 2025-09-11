class Charts {
    constructor() {
        this.charts = {};
        this.chartConfigs = {
            market: {
                type: 'doughnut',
                data: {
                    labels: ['Freelance Writers', 'Healthcare', 'Enterprise', 'Government'],
                    datasets: [{
                        data: [2300000, 850000, 125000, 15000],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Total Addressable Market (TAM)'
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            },
            financial: {
                type: 'line',
                data: {
                    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
                    datasets: [
                        {
                            label: 'Revenue',
                            data: [2.1, 15.8, 85.4, 285.6, 723.4],
                            borderColor: '#36A2EB',
                            backgroundColor: 'rgba(54, 162, 235, 0.1)',
                            fill: true
                        },
                        {
                            label: 'Free Cash Flow',
                            data: [-8.5, -2.1, 34.2, 142.8, 361.7],
                            borderColor: '#4BC0C0',
                            backgroundColor: 'rgba(75, 192, 192, 0.1)',
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Financial Projections ($M)'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            },
            infrastructure: {
                type: 'line',
                data: {
                    labels: ['100 Users', '500 Users', '1K Users', '5K Users', '10K Users', '50K Users', '100K Users'],
                    datasets: [
                        {
                            label: 'T4 GPUs (Cost/Month)',
                            data: [1.26, 6.3, 12.6, 63, 126, 630, 1260],
                            borderColor: '#FF6384',
                            backgroundColor: 'rgba(255, 99, 132, 0.1)',
                            fill: false
                        },
                        {
                            label: 'L4 GPUs (Cost/Month)',
                            data: [2.16, 10.8, 21.6, 108, 216, 1080, 2160],
                            borderColor: '#4CAF50',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            fill: false
                        },
                        {
                            label: 'A100 GPUs (Cost/Month)',
                            data: [5.12, 25.6, 51.2, 256, 512, 2560, 5120],
                            borderColor: '#FF9800',
                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            fill: false
                        },
                        {
                            label: 'Author Behavior Cost',
                            data: [0.85, 4.25, 8.5, 42.5, 85, 425, 850],
                            borderColor: '#9C27B0',
                            backgroundColor: 'rgba(156, 39, 176, 0.1)',
                            fill: false,
                            borderDash: [5, 5]
                        },
                        {
                            label: 'Researcher Behavior Cost',
                            data: [4.5, 22.5, 45, 225, 450, 2250, 4500],
                            borderColor: '#00BCD4',
                            backgroundColor: 'rgba(0, 188, 212, 0.1)',
                            fill: false,
                            borderDash: [10, 5]
                        },
                        {
                            label: 'Medical Behavior Cost',
                            data: [2.8, 14, 28, 140, 280, 1400, 2800],
                            borderColor: '#607D8B',
                            backgroundColor: 'rgba(96, 125, 139, 0.1)',
                            fill: false,
                            borderDash: [3, 3]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'GPU Infrastructure Scaling vs User Behavior Patterns ($K)'
                        },
                        legend: {
                            position: 'bottom'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Monthly Cost ($K)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'User Scale'
                            }
                        }
                    }
                }
            },
            revenue: {
                type: 'bar',
                data: {
                    labels: ['2025', '2026', '2027', '2028', '2029', '2030'],
                    datasets: [
                        {
                            label: 'Freelancers',
                            data: [0.35, 2.1, 8.4, 23.5, 58.7, 134.6],
                            backgroundColor: '#FF6384'
                        },
                        {
                            label: 'Healthcare',
                            data: [0.28, 1.8, 7.5, 22.8, 61.2, 152.4],
                            backgroundColor: '#36A2EB'
                        },
                        {
                            label: 'Enterprise',
                            data: [0.15, 1.2, 6.2, 21.4, 68.5, 189.2],
                            backgroundColor: '#FFCE56'
                        },
                        {
                            label: 'Government',
                            data: [0.02, 0.18, 1.1, 5.8, 22.1, 67.2],
                            backgroundColor: '#4BC0C0'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Revenue by Segment ($M)'
                        }
                    },
                    scales: {
                        x: {
                            stacked: true
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true
                        }
                    }
                }
            },
            dcf: {
                type: 'line',
                data: {
                    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
                    datasets: [
                        {
                            label: 'Free Cash Flow',
                            data: [-6.8, 6.3, 27.4, 114.2, 289.4],
                            borderColor: '#36A2EB',
                            backgroundColor: 'rgba(54, 162, 235, 0.1)',
                            fill: true
                        },
                        {
                            label: 'Present Value',
                            data: [-6.1, 5.0, 19.5, 72.4, 164.2],
                            borderColor: '#4BC0C0',
                            backgroundColor: 'rgba(75, 192, 192, 0.1)',
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'DCF Analysis ($M)'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            },
            funding: {
                type: 'pie',
                data: {
                    labels: ['Product Development', 'Marketing & Sales', 'Operations', 'Working Capital'],
                    datasets: [{
                        data: [40, 25, 20, 15],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Use of Funds ($10M)'
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            },
            userPreference: {
                type: 'radar',
                data: {
                    labels: ['Cost-Effectiveness', 'Context Size', 'Security', 'Compliance', 'Performance', 'Support'],
                    datasets: [
                        {
                            label: 'Freelancers',
                            data: [95, 60, 40, 30, 75, 45],
                            borderColor: '#FF6384',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            pointBackgroundColor: '#FF6384'
                        },
                        {
                            label: 'Healthcare',
                            data: [65, 85, 90, 95, 80, 85],
                            borderColor: '#36A2EB',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            pointBackgroundColor: '#36A2EB'
                        },
                        {
                            label: 'Enterprise',
                            data: [70, 95, 85, 75, 90, 90],
                            borderColor: '#FFCE56',
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            pointBackgroundColor: '#FFCE56'
                        },
                        {
                            label: 'Government',
                            data: [50, 80, 100, 85, 85, 95],
                            borderColor: '#4BC0C0',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            pointBackgroundColor: '#4BC0C0'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'User Segment Preferences (0-100 Scale)'
                        },
                        legend: {
                            position: 'bottom'
                        }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                stepSize: 20
                            }
                        }
                    }
                }
            },
            npvTimeline: {
                type: 'line',
                data: {
                    labels: ['2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032'],
                    datasets: [
                        {
                            label: 'NPV ($M)',
                            data: [180, 285, 425, 685, 1250, 1840, 2450, 2840],
                            borderColor: '#667eea',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        },
                        {
                            label: 'Cumulative Cash Flow ($M)',
                            data: [-68, -82, -58, 85, 658, 1652, 2958, 4854],
                            borderColor: '#4CAF50',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            fill: false,
                            tension: 0.4,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            borderDash: [5, 5]
                        },
                        {
                            label: 'Risk-Adjusted NPV ($M)',
                            data: [145, 225, 340, 515, 875, 1280, 1650, 1920],
                            borderColor: '#FF6B6B',
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                            fill: false,
                            tension: 0.4,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            borderDash: [10, 3]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'NPV Evolution & Risk Analysis Over Time'
                        },
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#1a202c',
                            bodyColor: '#2d3748',
                            borderColor: 'rgba(102, 126, 234, 0.3)',
                            borderWidth: 1,
                            callbacks: {
                                afterBody: function(context) {
                                    const year = context[0].label;
                                    const npv = context[0].parsed.y;
                                    const basis = {
                                        '2025': 'Initial investment phase with limited revenue',
                                        '2026': 'Early traction in freelancer segment',
                                        '2027': 'Multi-segment expansion drives growth',
                                        '2028': 'Enterprise adoption accelerates',
                                        '2029': 'Market leadership position established',
                                        '2030': 'Peak operational efficiency achieved',
                                        '2031': 'Mature market with steady growth',
                                        '2032': 'Sustainable competitive advantage'
                                    };
                                    return ['', `Basis: ${basis[year]}`];
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            title: {
                                display: true,
                                text: 'Value ($M)'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Year'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    }
                }
            }
        };
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        // Delay chart creation to ensure DOM is fully loaded and styled
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.createCharts(), 100);
            });
        } else {
            setTimeout(() => this.createCharts(), 100);
        }
    }
    
    createCharts() {
        // Only create charts that are currently visible
        Object.keys(this.chartConfigs).forEach(chartName => {
            this.createChartIfVisible(chartName);
        });
    }
    
    createChartIfVisible(chartName) {
        try {
            const canvas = document.getElementById(`${chartName}Chart`);
            if (canvas && !this.charts[chartName]) {
                // Check if the canvas is in a visible container
                const isVisible = this.isElementVisible(canvas);
                
                if (isVisible) {
                    const ctx = canvas.getContext('2d');
                    // Ensure canvas has valid dimensions
                    if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
                        this.charts[chartName] = new Chart(ctx, this.chartConfigs[chartName]);
                        console.log(`✅ Chart created: ${chartName} (${canvas.clientWidth}x${canvas.clientHeight})`);
                    } else {
                        console.warn(`⚠️ Chart canvas has invalid dimensions: ${chartName} (${canvas.clientWidth}x${canvas.clientHeight})`);
                    }
                } else {
                    console.log(`📋 Chart canvas not visible, skipping: ${chartName}`);
                }
            } else if (!canvas) {
                console.warn(`⚠️ Chart canvas not found: ${chartName}Chart`);
            }
        } catch (error) {
            console.error(`❌ Error creating chart ${chartName}:`, error);
        }
    }
    
    isElementVisible(element) {
        // Check if element and all parents are visible
        let current = element;
        while (current) {
            const style = window.getComputedStyle(current);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                return false;
            }
            current = current.parentElement;
        }
        return true;
    }
    
    updateChartsForTab(tabId) {
        // Update charts based on current tab and user inputs
        switch (tabId) {
            case 'market-analysis':
                this.updateMarketChart();
                break;
            case 'financial-models':
                this.updateFinancialChart();
                break;
            case 'infrastructure':
                this.updateInfrastructureChart();
                break;
            case 'revenue-model':
                this.updateRevenueChart();
                break;
            case 'dcf-analysis':
                this.updateDCFChart();
                break;
            case 'funding-request':
                this.updateFundingChart();
                break;
        }
    }
    
    updateMarketChart() {
        // Market chart is relatively static, but could be updated based on scenarios
        const chart = this.charts.market;
        if (chart) {
            chart.update();
        }
    }
    
    updateFinancialChart() {
        try {
            const chart = this.charts.financial;
            if (chart && window.financialModels) {
                // Get current scenario data
                const scenario = window.financialModels.currentScenario || 'realistic';
                const multiplier = window.financialModels.scenarios[scenario]?.revenueMultiplier || 1.0;
                
                // Update revenue data with validation
                const baseRevenue = [2.1, 15.8, 85.4, 285.6, 723.4];
                const baseFCF = [-8.5, -2.1, 34.2, 142.8, 361.7];
                
                const newRevenueData = baseRevenue.map(r => (r * multiplier) || 0);
                const newFCFData = baseFCF.map(f => (f * multiplier) || 0);
                
                // Validate data before updating
                if (newRevenueData.every(v => typeof v === 'number' && !isNaN(v)) &&
                    newFCFData.every(v => typeof v === 'number' && !isNaN(v))) {
                    chart.data.datasets[0].data = newRevenueData;
                    chart.data.datasets[1].data = newFCFData;
                    chart.update();
                } else {
                    console.warn('⚠️ Invalid data in financial chart update');
                }
            }
        } catch (error) {
            console.error('❌ Error updating financial chart:', error);
        }
    }
    
    updateInfrastructureChart() {
        const chart = this.charts.infrastructure;
        if (chart) {
            // Get current infrastructure settings
            const provider = document.getElementById('cloud-provider')?.value || 'aws';
            const monthlyUsers = parseInt(document.getElementById('monthly-users')?.value || 10000);
            const scaleFactor = Math.sqrt(monthlyUsers / 10000);
            
            // Update the specific provider's costs
            const providerIndex = ['aws', 'gcp', 'azure', 'on-premise', 'home-server'].indexOf(provider);
            if (providerIndex >= 0) {
                // Apply scaling to current provider
                const baseCosts = [
                    [8.5, 7.8, 8.2, 15.0, 3.0],  // Compute
                    [12.0, 11.0, 11.5, 5.0, 8.0], // AI/ML
                    [1.2, 1.1, 1.15, 2.0, 0.5],   // Storage
                    [0.8, 0.7, 0.75, 0.5, 0.2]    // Bandwidth
                ];
                
                chart.data.datasets.forEach((dataset, i) => {
                    dataset.data = baseCosts[i].map((cost, j) => {
                        return j === providerIndex ? cost * scaleFactor : cost;
                    });
                });
            }
            
            chart.update();
        }
    }
    
    updateRevenueChart() {
        const chart = this.charts.revenue;
        if (chart) {
            // Get current pricing
            const prices = {
                freelancer: parseFloat(document.getElementById('freelancer-price')?.value || 29),
                healthcare: parseFloat(document.getElementById('healthcare-price')?.value || 79),
                enterprise: parseFloat(document.getElementById('enterprise-price')?.value || 249),
                government: parseFloat(document.getElementById('government-price')?.value || 1249)
            };
            
            // Base user projections
            const baseUsers = {
                freelancer: [350, 2100, 8400, 23500, 58700, 134600],
                healthcare: [300, 1900, 8000, 24300, 65400, 163000],
                enterprise: [50, 400, 2100, 7200, 23000, 63800],
                government: [10, 120, 750, 3900, 14900, 45200]
            };
            
            // Update revenue calculations
            Object.keys(prices).forEach((segment, i) => {
                const price = prices[segment];
                const users = baseUsers[segment];
                chart.data.datasets[i].data = users.map(u => (u * price * 12) / 1000000);
            });
            
            chart.update();
        }
    }
    
    updateDCFChart() {
        const chart = this.charts.dcf;
        if (chart && window.financialModels) {
            const dcfResults = window.financialModels.calculateDCF();
            
            // Update with actual DCF calculations
            chart.data.datasets[0].data = dcfResults.cashFlows.map(cf => cf.freeCashFlow / 1000000);
            chart.data.datasets[1].data = dcfResults.cashFlows.map(cf => cf.presentValue / 1000000);
            
            chart.update();
        }
    }
    
    updateFundingChart() {
        const chart = this.charts.funding;
        if (chart) {
            // Get current allocation percentages
            const allocations = [
                parseFloat(document.getElementById('product-allocation')?.value || 40),
                parseFloat(document.getElementById('marketing-allocation')?.value || 25),
                parseFloat(document.getElementById('operations-allocation')?.value || 20),
                parseFloat(document.getElementById('working-capital-allocation')?.value || 15)
            ];
            
            // Normalize to 100%
            const total = allocations.reduce((a, b) => a + b, 0);
            chart.data.datasets[0].data = allocations.map(a => (a / total) * 100);
            
            chart.update();
        }
    }
    
    destroyChart(chartName) {
        if (this.charts[chartName]) {
            this.charts[chartName].destroy();
            delete this.charts[chartName];
        }
    }
    
    destroyAllCharts() {
        Object.keys(this.charts).forEach(chartName => {
            this.destroyChart(chartName);
        });
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.charts = new Charts();
});