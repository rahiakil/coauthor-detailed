class FinancialModels {
    constructor() {
        this.scenarios = {
            conservative: {
                growthRate: 0.02,
                discountRate: 0.15,
                churnRate: 0.05,
                conversionRate: 0.02,
                revenueMultiplier: 0.7
            },
            realistic: {
                growthRate: 0.03,
                discountRate: 0.12,
                churnRate: 0.03,
                conversionRate: 0.05,
                revenueMultiplier: 1.0
            },
            optimistic: {
                growthRate: 0.04,
                discountRate: 0.10,
                churnRate: 0.02,
                conversionRate: 0.08,
                revenueMultiplier: 1.3
            }
        };
        
        this.currentScenario = 'realistic';
        this.initializeEventListeners();
        this.updateAllCalculations();
    }
    
    initializeEventListeners() {
        const scenarioSelect = document.getElementById('scenario');
        if (scenarioSelect) {
            scenarioSelect.addEventListener('change', (e) => {
                this.currentScenario = e.target.value;
                this.updateAllCalculations();
            });
        }
        
        // Financial model controls
        const controls = [
            'discount-rate', 'growth-rate', 'customer-acquisition-cost', 'churn-rate',
            'dcf-discount-rate', 'dcf-terminal-growth', 'dcf-projection-years'
        ];
        
        controls.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateAllCalculations());
            }
        });
    }
    
    calculateDCF(years = 5) {
        const scenario = this.scenarios[this.currentScenario];
        const discountRate = parseFloat(document.getElementById('dcf-discount-rate')?.value || 12) / 100;
        const terminalGrowthRate = parseFloat(document.getElementById('dcf-terminal-growth')?.value || 3) / 100;
        
        // Base revenue projections based on co-author analysis
        const baseRevenues = [2100000, 15800000, 85400000, 285600000, 723400000]; // 5-year projection
        
        const cashFlows = [];
        let totalPV = 0;
        
        for (let year = 1; year <= years; year++) {
            const revenue = baseRevenues[year - 1] * scenario.revenueMultiplier;
            const ebitda = revenue * (0.4 + (year * 0.05)); // Growing EBITDA margin
            const freeCashFlow = ebitda * 0.8; // FCF conversion
            
            const pvFactor = 1 / Math.pow(1 + discountRate, year);
            const presentValue = freeCashFlow * pvFactor;
            
            cashFlows.push({
                year,
                revenue,
                ebitda,
                freeCashFlow,
                pvFactor,
                presentValue
            });
            
            totalPV += presentValue;
        }
        
        // Terminal value calculation
        const terminalCashFlow = cashFlows[cashFlows.length - 1].freeCashFlow * (1 + terminalGrowthRate);
        const terminalValue = terminalCashFlow / (discountRate - terminalGrowthRate);
        const terminalPV = terminalValue / Math.pow(1 + discountRate, years);
        
        const enterpriseValue = totalPV + terminalPV;
        
        return {
            cashFlows,
            totalPV,
            terminalValue,
            terminalPV,
            enterpriseValue,
            equityValue: enterpriseValue // Assuming no debt
        };
    }
    
    calculateNPV(initialInvestment = 10000000) {
        const dcf = this.calculateDCF();
        return dcf.equityValue - initialInvestment;
    }
    
    calculateIRR(initialInvestment = 10000000, finalValue = null) {
        if (!finalValue) {
            const dcf = this.calculateDCF();
            finalValue = dcf.equityValue;
        }
        
        const years = 5;
        // IRR calculation using approximation
        const irr = Math.pow(finalValue / initialInvestment, 1 / years) - 1;
        return irr;
    }
    
    calculateWACC(equityRatio = 1, debtRatio = 0, costOfEquity = 0.12, costOfDebt = 0.06, taxRate = 0.25) {
        return (equityRatio * costOfEquity) + (debtRatio * costOfDebt * (1 - taxRate));
    }
    
    calculatePaybackPeriod(monthlyRevenue = 60283333, monthlyExpenses = 35000000) {
        const monthlyProfit = monthlyRevenue - monthlyExpenses;
        const initialInvestment = 10000000;
        return initialInvestment / monthlyProfit;
    }
    
    updateDCFTable() {
        const years = parseInt(document.getElementById('dcf-projection-years')?.value || 5);
        const dcfResults = this.calculateDCF(years);
        
        const tbody = document.getElementById('dcf-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        dcfResults.cashFlows.forEach(cf => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cf.year}</td>
                <td>$${(cf.revenue / 1000000).toFixed(1)}M</td>
                <td>$${(cf.ebitda / 1000000).toFixed(1)}M</td>
                <td>$${(cf.freeCashFlow / 1000000).toFixed(1)}M</td>
                <td>${cf.pvFactor.toFixed(3)}</td>
                <td>$${(cf.presentValue / 1000000).toFixed(1)}M</td>
            `;
            tbody.appendChild(row);
        });
        
        // Update DCF results
        this.updateElement('pv-cash-flows', `$${(dcfResults.totalPV / 1000000000).toFixed(1)}B`);
        this.updateElement('terminal-value', `$${(dcfResults.terminalPV / 1000000000).toFixed(2)}B`);
        this.updateElement('enterprise-value', `$${(dcfResults.enterpriseValue / 1000000000).toFixed(2)}B`);
        this.updateElement('equity-value', `$${(dcfResults.equityValue / 1000000000).toFixed(2)}B`);
    }
    
    updateFinancialMetrics() {
        const npv = this.calculateNPV();
        const irr = this.calculateIRR();
        const payback = this.calculatePaybackPeriod();
        
        this.updateElement('npv-result', `$${(npv / 1000000000).toFixed(1)}B`);
        this.updateElement('irr-result', `${(irr * 100).toFixed(0)}%`);
        this.updateElement('payback-result', `${payback.toFixed(1)} months`);
        this.updateElement('breakeven-result', '19');
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    updateAllCalculations() {
        this.updateFinancialMetrics();
        this.updateDCFTable();
        
        // Update slider value displays
        const sliders = [
            { id: 'discount-rate', suffix: '%' },
            { id: 'growth-rate', suffix: '%' },
            { id: 'customer-acquisition-cost', prefix: '$' },
            { id: 'churn-rate', suffix: '%' },
            { id: 'dcf-discount-rate', suffix: '%' },
            { id: 'dcf-terminal-growth', suffix: '%' }
        ];
        
        sliders.forEach(slider => {
            const element = document.getElementById(slider.id);
            const valueElement = document.getElementById(`${slider.id}-value`);
            if (element && valueElement) {
                const value = element.value;
                const prefix = slider.prefix || '';
                const suffix = slider.suffix || '';
                valueElement.textContent = `${prefix}${value}${suffix}`;
            }
        });
    }
}

// Initialize financial models when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.financialModels = new FinancialModels();
});