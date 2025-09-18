class InvestorPresentation {
    constructor() {
        this.currentTab = 'executive-summary';
        this.infrastructureCosts = {
            aws: { compute: 8500, ai: 12000, storage: 1200, bandwidth: 800 },
            gcp: { compute: 7800, ai: 11000, storage: 1100, bandwidth: 700 },
            azure: { compute: 8200, ai: 11500, storage: 1150, bandwidth: 750 },
            'on-premise': { compute: 15000, ai: 5000, storage: 2000, bandwidth: 500 },
            'home-server': { compute: 3000, ai: 8000, storage: 500, bandwidth: 200 }
        };
        
        this.valuationMethods = {};
        this.init();
    }
    
    init() {
        this.initTabNavigation();
        // this.initSubTabNavigation(); // Disabled - converted sub-tabs to main tabs
        this.initCollapsibleBanner();
        this.initBannerInteractions();
        this.initInfrastructureCalculator();
        this.initRevenueModel();
        this.initValuationMethods();
        this.initFundingCalculator();
        this.initTokenUsageCalculators();
        this.initAICostChart();
        this.initGeneticAlgorithmDemo();
        this.initHoverCards();
        this.initSourcesPanel();
        initMermaidDiagrams(); // Call global function
        this.updateAllMetrics();
    }
    
    initTabNavigation() {
        const tabButtons = document.querySelectorAll('.nav-tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = button.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
                
                this.currentTab = tabId;
                this.updateChartsForTab(tabId);
            });
        });
    }
    
    initSubTabNavigation() {
        console.log('🔧 Initializing SubTab Navigation...');
        
        // Add click event to document body and use event delegation
        document.body.addEventListener('click', (e) => {
            // Check if clicked element is a sub-tab button
            if (e.target.classList.contains('sub-tab')) {
                e.preventDefault();
                e.stopPropagation();
                
                const button = e.target;
                const subTabId = button.dataset.subtab;
                console.log('🖱️ SUB-TAB CLICKED:', subTabId);
                
                // Get the parent tab
                const parentTab = button.closest('.tab-content');
                if (!parentTab) {
                    console.error('❌ No parent tab found for:', subTabId);
                    return;
                }
                console.log('📂 Parent tab:', parentTab.id);
                
                // Remove active from all sub-elements in this parent
                const parentSubTabs = parentTab.querySelectorAll('.sub-tab');
                const parentSubContents = parentTab.querySelectorAll('.sub-content');
                
                console.log('🔄 Deactivating', parentSubTabs.length, 'buttons and', parentSubContents.length, 'contents');
                
                parentSubTabs.forEach(btn => {
                    btn.classList.remove('active');
                });
                parentSubContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                // Activate clicked sub-tab and corresponding content
                button.classList.add('active');
                
                const subContent = document.getElementById(subTabId);
                if (subContent) {
                    subContent.classList.add('active');
                    console.log('✅ SUCCESSFULLY ACTIVATED:', subTabId);
                    console.log('📋 Content classes:', subContent.className);
                    
                    // Trigger chart creation for newly visible content
                    setTimeout(() => {
                        if (window.charts) {
                            window.charts.createCharts();
                        }
                    }, 50);
                } else {
                    console.error('❌ ELEMENT NOT FOUND:', subTabId);
                    // Debug: list all sub-content elements
                    const allSubContent = document.querySelectorAll('.sub-content');
                    console.log('🔍 Available sub-content elements:');
                    allSubContent.forEach((el, i) => {
                        console.log(`   ${i}: ${el.id} (classes: ${el.className})`);
                    });
                }
                
                console.log('---END SUB-TAB CLICK---');
            }
        });
        
        console.log('✅ SubTab Navigation initialized with event delegation');
        
        // Log available sub-tabs for debugging
        setTimeout(() => {
            const subTabButtons = document.querySelectorAll('.sub-tab');
            console.log('📊 Found', subTabButtons.length, 'sub-tab buttons:');
            subTabButtons.forEach((btn, i) => {
                console.log(`   ${i}: ${btn.dataset.subtab} (active: ${btn.classList.contains('active')})`);
            });
        }, 500);
    }
    
    initCollapsibleBanner() {
        const banner = document.getElementById('market-gap-banner');
        if (!banner) return;
        
        let lastScrollY = window.scrollY;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Collapse banner when scrolling down past 100px
            if (currentScrollY > 100 && currentScrollY > lastScrollY) {
                banner.classList.add('collapsed');
            } 
            // Show banner when scrolling up or at top
            else if (currentScrollY < 50 || currentScrollY < lastScrollY) {
                banner.classList.remove('collapsed');
            }
            
            lastScrollY = currentScrollY;
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    initInfrastructureCalculator() {
        const controls = [
            'cloud-provider', 'ai-model', 'monthly-users', 'requests-per-user'
        ];
        
        controls.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.updateInfrastructureCosts());
                if (element.type === 'range') {
                    element.addEventListener('input', () => this.updateInfrastructureCosts());
                }
            }
        });
        
        this.updateInfrastructureCosts();
    }
    
    updateInfrastructureCosts() {
        const provider = document.getElementById('cloud-provider')?.value || 'aws';
        const aiModel = document.getElementById('ai-model')?.value || 'foundation';
        const monthlyUsers = parseInt(document.getElementById('monthly-users')?.value || 10000);
        const requestsPerUser = parseInt(document.getElementById('requests-per-user')?.value || 100);
        
        // Update slider displays
        this.updateElement('monthly-users-value', monthlyUsers.toLocaleString());
        this.updateElement('requests-per-user-value', requestsPerUser.toString());
        
        // Calculate costs based on usage
        const baseCosts = this.infrastructureCosts[provider];
        const scaleFactor = Math.sqrt(monthlyUsers / 10000); // Square root scaling
        const requestFactor = requestsPerUser / 100;
        
        let computeCost = baseCosts.compute * scaleFactor;
        let aiCost = baseCosts.ai * scaleFactor * requestFactor;
        let storageCost = baseCosts.storage * scaleFactor;
        let bandwidthCost = baseCosts.bandwidth * scaleFactor * requestFactor;
        
        // AI model adjustments
        if (aiModel === 'self-hosted') {
            aiCost *= 0.3; // Lower API costs but higher compute
            computeCost *= 1.8;
        } else if (aiModel === 'hybrid') {
            aiCost *= 0.7;
            computeCost *= 1.3;
        }
        
        const totalCost = computeCost + aiCost + storageCost + bandwidthCost;
        
        // Update display
        this.updateElement('compute-cost', `$${Math.round(computeCost).toLocaleString()}`);
        this.updateElement('ai-cost', `$${Math.round(aiCost).toLocaleString()}`);
        this.updateElement('storage-cost', `$${Math.round(storageCost).toLocaleString()}`);
        this.updateElement('bandwidth-cost', `$${Math.round(bandwidthCost).toLocaleString()}`);
        this.updateElement('total-infrastructure-cost', `$${Math.round(totalCost).toLocaleString()}`);
    }
    
    initRevenueModel() {
        const controls = [
            'freelancer-price', 'healthcare-price', 'enterprise-price', 'government-price',
            'marketing-spend', 'conversion-rate'
        ];
        
        controls.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateRevenueProjections());
            }
        });
        
        this.updateRevenueProjections();
    }
    
    updateRevenueProjections() {
        // Get pricing
        const freelancerPrice = parseFloat(document.getElementById('freelancer-price')?.value || 29);
        const healthcarePrice = parseFloat(document.getElementById('healthcare-price')?.value || 79);
        const enterprisePrice = parseFloat(document.getElementById('enterprise-price')?.value || 249);
        const governmentPrice = parseFloat(document.getElementById('government-price')?.value || 1249);
        
        // Update display prices in tokenomics section
        this.updateElement('freelancer-display-price', freelancerPrice);
        this.updateElement('healthcare-display-price', healthcarePrice);
        this.updateElement('enterprise-display-price', enterprisePrice);
        this.updateElement('government-display-price', governmentPrice);
        
        // Get marketing parameters
        const marketingSpend = parseFloat(document.getElementById('marketing-spend')?.value || 100000);
        const conversionRate = parseFloat(document.getElementById('conversion-rate')?.value || 5) / 100;
        
        this.updateElement('marketing-spend-value', `$${marketingSpend.toLocaleString()}`);
        this.updateElement('conversion-rate-value', `${(conversionRate * 100).toFixed(1)}%`);
        
        // Calculate user projections (simplified model)
        const baseUsers = {
            freelancer: Math.floor(marketingSpend * conversionRate * 0.6 / 150), // 60% to freelancers
            healthcare: Math.floor(marketingSpend * conversionRate * 0.25 / 300), // 25% to healthcare  
            enterprise: Math.floor(marketingSpend * conversionRate * 0.12 / 800), // 12% to enterprise
            government: Math.floor(marketingSpend * conversionRate * 0.03 / 2000) // 3% to government
        };
        
        const growthRates = { 
            freelancer: 2.8 + (conversionRate * 10), 
            healthcare: 3.2 + (conversionRate * 8), 
            enterprise: 4.1 + (conversionRate * 12), 
            government: 5.8 + (conversionRate * 15) 
        };
        
        let year1Revenue = 0;
        let year3Revenue = 0;
        let year5Revenue = 0;
        
        // Calculate revenues for each segment
        Object.keys(baseUsers).forEach(segment => {
            const price = segment === 'freelancer' ? freelancerPrice :
                         segment === 'healthcare' ? healthcarePrice :
                         segment === 'enterprise' ? enterprisePrice : governmentPrice;
            
            const y1Users = Math.max(baseUsers[segment], 10); // Minimum users
            const y3Users = y1Users * Math.pow(growthRates[segment], 2);
            const y5Users = y1Users * Math.pow(growthRates[segment], 4);
            
            year1Revenue += y1Users * price * 12;
            year3Revenue += y3Users * price * 12;
            year5Revenue += y5Users * price * 12;
        });
        
        // Store revenue data for other calculations
        this.revenueData = { year1Revenue, year3Revenue, year5Revenue };
        
        // Calculate CAGR
        const cagr = Math.pow(year5Revenue / year1Revenue, 1/4) - 1;
        
        this.updateElement('year1-revenue', `$${(year1Revenue / 1000000).toFixed(1)}M`);
        this.updateElement('year3-revenue', `$${(year3Revenue / 1000000).toFixed(1)}M`);
        this.updateElement('year5-revenue', `$${(year5Revenue / 1000000).toFixed(1)}M`);
        this.updateElement('cagr', `${(cagr * 100).toFixed(0)}%`);
        
        // Update NPV calculations
        this.updateNPVDisplays();
        
        // Update financial models if available
        if (window.financialModels && window.financialModels.updateAllCalculations) {
            window.financialModels.updateAllCalculations();
        }
        
        // Update charts with new revenue data
        if (window.charts && window.charts.updateRevenueChart) {
            window.charts.updateRevenueChart();
        }
    }
    
    updateNPVDisplays() {
        const discountRate = parseFloat(document.getElementById('discount-rate')?.value || 12) / 100;
        const npv = this.calculateNPV(discountRate);
        
        // Update all NPV badges
        this.updateElement('financial-npv', `Real-time NPV: $${(npv / 1000000000).toFixed(2)}B (at ${(discountRate * 100).toFixed(1)}% discount)`);
        this.updateElement('valuation-npv', `NPV: $${(npv / 1000000000).toFixed(2)}B (at ${(discountRate * 100).toFixed(1)}% discount)`);
    }
    
    calculateNPV(discountRate) {
        if (!this.revenueData) {
            return 2100000000; // Default NPV
        }
        
        const { year1Revenue, year3Revenue, year5Revenue } = this.revenueData;
        const revenues = [
            year1Revenue,
            year1Revenue * 1.8, // Interpolated year 2
            year3Revenue,
            year3Revenue * 2.1, // Interpolated year 4  
            year5Revenue
        ];
        
        let npv = 0;
        revenues.forEach((revenue, index) => {
            const year = index + 1;
            const ebitda = revenue * (0.3 + (year * 0.08)); // Growing EBITDA margin
            const fcf = ebitda * 0.75; // Free cash flow conversion
            const pv = fcf / Math.pow(1 + discountRate, year);
            npv += pv;
        });
        
        // Add terminal value
        const terminalFCF = revenues[4] * 0.65 * 1.03; // Terminal growth
        const terminalValue = terminalFCF / (discountRate - 0.03);
        const terminalPV = terminalValue / Math.pow(1 + discountRate, 5);
        
        return npv + terminalPV;
    }
    
    initValuationMethods() {
        // Berkus Method
        const berkusFactors = ['idea', 'prototype', 'management', 'relationships', 'sales'];
        berkusFactors.forEach(factor => {
            const element = document.getElementById(`berkus-${factor}`);
            if (element) {
                element.addEventListener('input', () => this.updateBerkusValuation());
            }
        });
        
        // Scorecard Method
        const scorecardFactors = ['management', 'market', 'product', 'competition', 'marketing', 'financials'];
        scorecardFactors.forEach(factor => {
            const element = document.getElementById(`scorecard-${factor}`);
            if (element) {
                element.addEventListener('input', () => this.updateScorecardValuation());
            }
        });
        
        // Risk Factor Method
        const riskElements = document.querySelectorAll('[id^=\"risk-\"]');
        riskElements.forEach(element => {
            element.addEventListener('change', () => this.updateRiskFactorValuation());
        });
        
        // Cost to Duplicate
        const costElements = ['dev-cost', 'market-premium'];
        costElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateCostToDuplicate());
            }
        });
        
        this.updateAllValuationMethods();
    }
    
    updateBerkusValuation() {
        const factors = ['idea', 'prototype', 'management', 'relationships', 'sales'];
        let total = 0;
        
        factors.forEach(factor => {
            const value = parseFloat(document.getElementById(`berkus-${factor}`)?.value || 0);
            total += value;
            this.updateElement(`berkus-${factor}-value`, `$${(value / 1000).toFixed(0)}K`);
        });
        
        this.updateElement('berkus-total', `$${(total / 1000000).toFixed(1)}M`);
        this.updateElement('summary-berkus', `$${(total / 1000000).toFixed(1)}M`);
        this.valuationMethods.berkus = total;
        this.updateAverageValuation();
    }
    
    updateScorecardValuation() {
        const baseValuation = 35000000; // Base $35M for similar companies
        const factors = [
            { name: 'management', weight: 0.30 },
            { name: 'market', weight: 0.25 },
            { name: 'product', weight: 0.15 },
            { name: 'competition', weight: 0.10 },
            { name: 'marketing', weight: 0.10 },
            { name: 'financials', weight: 0.10 }
        ];
        
        let weightedMultiplier = 0;
        
        factors.forEach(factor => {
            const multiplier = parseFloat(document.getElementById(`scorecard-${factor.name}`)?.value || 1);
            weightedMultiplier += multiplier * factor.weight;
            this.updateElement(`scorecard-${factor.name}-value`, `${multiplier.toFixed(1)}x`);
        });
        
        const total = baseValuation * weightedMultiplier;
        this.updateElement('scorecard-total', `$${(total / 1000000).toFixed(1)}M`);
        this.updateElement('summary-scorecard', `$${(total / 1000000).toFixed(1)}M`);
        this.valuationMethods.scorecard = total;
        this.updateAverageValuation();
    }
    
    updateRiskFactorValuation() {
        const baseValuation = 40000000; // Base $40M
        const managementRisk = parseFloat(document.getElementById('risk-management')?.value || 0);
        const stageRisk = parseFloat(document.getElementById('risk-stage')?.value || 0);
        
        const total = baseValuation + managementRisk + stageRisk;
        this.updateElement('risk-total', `$${(total / 1000000).toFixed(1)}M`);
        this.updateElement('summary-risk', `$${(total / 1000000).toFixed(1)}M`);
        this.valuationMethods.risk = total;
        this.updateAverageValuation();
    }
    
    updateCostToDuplicate() {
        const devCost = parseFloat(document.getElementById('dev-cost')?.value || 2000000);
        const premium = parseFloat(document.getElementById('market-premium')?.value || 2.5);
        
        this.updateElement('market-premium-value', `${premium.toFixed(1)}x`);
        
        const total = devCost * premium;
        this.updateElement('duplicate-total', `$${(total / 1000000).toFixed(0)}M`);
        this.updateElement('summary-duplicate', `$${(total / 1000000).toFixed(0)}M`);
        this.valuationMethods.duplicate = total;
        this.updateAverageValuation();
    }
    
    updateAverageValuation() {
        const values = Object.values(this.valuationMethods);
        if (values.length > 0) {
            const average = values.reduce((a, b) => a + b, 0) / values.length;
            this.updateElement('average-valuation', `$${(average / 1000000).toFixed(1)}M`);
        }
    }
    
    updateAllValuationMethods() {
        this.updateBerkusValuation();
        this.updateScorecardValuation();
        this.updateRiskFactorValuation();
        this.updateCostToDuplicate();
    }
    
    initFundingCalculator() {
        const fundingElement = document.getElementById('funding-request');
        if (fundingElement) {
            fundingElement.addEventListener('input', () => this.updateFundingMetrics());
        }
        
        // Use of funds sliders
        const allocationSliders = ['product-allocation', 'marketing-allocation', 'operations-allocation', 'working-capital-allocation'];
        allocationSliders.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateFundingAllocation());
            }
        });
        
        this.updateFundingMetrics();
        this.updateFundingAllocation();
    }
    
    initTokenUsageCalculators() {
        // Legal scenario
        const legalInputs = ['legal-pages', 'legal-docs', 'legal-tokens-per-page'];
        legalInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateTokenUsage('legal'));
            }
        });
        
        // Enterprise scenario  
        const enterpriseInputs = ['enterprise-articles', 'enterprise-words', 'enterprise-research'];
        enterpriseInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateTokenUsage('enterprise'));
            }
        });
        
        // Government scenario
        const govInputs = ['gov-policies', 'gov-pages', 'gov-cross-ref'];
        govInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateTokenUsage('gov'));
            }
        });
        
        // Healthcare scenario
        const healthInputs = ['health-records', 'health-pages', 'health-context'];
        healthInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateTokenUsage('health'));
            }
        });
        
        // Initialize all calculations
        this.updateTokenUsage('legal');
        this.updateTokenUsage('enterprise');
        this.updateTokenUsage('gov');
        this.updateTokenUsage('health');
    }
    
    updateTokenUsage(scenario) {
        let tokens = 0;
        let tier = '';
        let tierPrice = '';
        
        switch(scenario) {
            case 'legal':
                const legalPages = parseFloat(document.getElementById('legal-pages')?.value || 50);
                const legalDocs = parseFloat(document.getElementById('legal-docs')?.value || 20);
                const legalTokensPerPage = parseFloat(document.getElementById('legal-tokens-per-page')?.value || 750);
                
                tokens = legalPages * legalDocs * legalTokensPerPage;
                
                if (tokens <= 500000) {
                    tier = 'Freelancer';
                    tierPrice = document.getElementById('freelancer-price')?.value || 29;
                } else if (tokens <= 1500000) {
                    tier = 'Healthcare';  
                    tierPrice = document.getElementById('healthcare-price')?.value || 79;
                } else if (tokens <= 5000000) {
                    tier = 'Enterprise';
                    tierPrice = document.getElementById('enterprise-price')?.value || 249;
                } else {
                    tier = 'Government';
                    tierPrice = document.getElementById('government-price')?.value || 1249;
                }
                
                this.updateElement('legal-tokens-result', `${(tokens / 1000).toFixed(0)}K`);
                this.updateElement('legal-tier-result', `${tier} ($${tierPrice})`);
                break;
                
            case 'enterprise':
                const articles = parseFloat(document.getElementById('enterprise-articles')?.value || 100);
                const wordsPerArticle = parseFloat(document.getElementById('enterprise-words')?.value || 2000);
                const researchPages = parseFloat(document.getElementById('enterprise-research')?.value || 30);
                
                // 1.5 tokens per word + research context (750 tokens per research page)
                tokens = (articles * wordsPerArticle * 1.5) + (articles * researchPages * 750);
                
                if (tokens <= 500000) {
                    tier = 'Freelancer';
                    tierPrice = document.getElementById('freelancer-price')?.value || 29;
                } else if (tokens <= 1500000) {
                    tier = 'Healthcare';
                    tierPrice = document.getElementById('healthcare-price')?.value || 79;
                } else if (tokens <= 5000000) {
                    tier = 'Enterprise';
                    tierPrice = document.getElementById('enterprise-price')?.value || 249;
                } else {
                    tier = 'Government';
                    tierPrice = document.getElementById('government-price')?.value || 1249;
                }
                
                this.updateElement('enterprise-tokens-result', `${(tokens / 1000000).toFixed(1)}M`);
                this.updateElement('enterprise-tier-result', `${tier} ($${tierPrice})`);
                break;
                
            case 'gov':
                const policies = parseFloat(document.getElementById('gov-policies')?.value || 10);
                const pagesPerPolicy = parseFloat(document.getElementById('gov-pages')?.value || 200);
                const crossRefs = parseFloat(document.getElementById('gov-cross-ref')?.value || 500);
                
                // Policy pages (750 tokens/page) + cross-references (1000 tokens each)
                tokens = (policies * pagesPerPolicy * 750) + (crossRefs * 1000);
                
                if (tokens <= 500000) {
                    tier = 'Freelancer';
                    tierPrice = document.getElementById('freelancer-price')?.value || 29;
                } else if (tokens <= 1500000) {
                    tier = 'Healthcare';
                    tierPrice = document.getElementById('healthcare-price')?.value || 79;
                } else if (tokens <= 5000000) {
                    tier = 'Enterprise';
                    tierPrice = document.getElementById('enterprise-price')?.value || 249;
                } else {
                    tier = 'Government';
                    tierPrice = document.getElementById('government-price')?.value || 1249;
                }
                
                this.updateElement('gov-tokens-result', `${(tokens / 1000000).toFixed(1)}M`);
                this.updateElement('gov-tier-result', `${tier} ($${tierPrice})`);
                break;
                
            case 'health':
                const records = parseFloat(document.getElementById('health-records')?.value || 500);
                const pagesPerRecord = parseFloat(document.getElementById('health-pages')?.value || 15);
                const contextPages = parseFloat(document.getElementById('health-context')?.value || 50);
                
                // Patient records (600 tokens/page) + medical context (800 tokens/page)
                tokens = (records * pagesPerRecord * 600) + (contextPages * 800);
                
                if (tokens <= 500000) {
                    tier = 'Freelancer';
                    tierPrice = document.getElementById('freelancer-price')?.value || 29;
                } else if (tokens <= 1500000) {
                    tier = 'Healthcare';
                    tierPrice = document.getElementById('healthcare-price')?.value || 79;
                } else if (tokens <= 5000000) {
                    tier = 'Enterprise';
                    tierPrice = document.getElementById('enterprise-price')?.value || 249;
                } else {
                    tier = 'Government';
                    tierPrice = document.getElementById('government-price')?.value || 1249;
                }
                
                this.updateElement('health-tokens-result', `${(tokens / 1000000).toFixed(1)}M`);
                this.updateElement('health-tier-result', `${tier} ($${tierPrice})`);
                break;
        }
    }
    
    updateFundingMetrics() {
        const fundingAmount = parseFloat(document.getElementById('funding-request')?.value || 10000000);
        const preMoneyValuation = 40000000; // Based on valuation methods
        const postMoneyValuation = preMoneyValuation + fundingAmount;
        const equityPercentage = (fundingAmount / postMoneyValuation) * 100;
        
        this.updateElement('final-pre-money', `$${(preMoneyValuation / 1000000).toFixed(0)}M`);
        this.updateElement('post-money', `$${(postMoneyValuation / 1000000).toFixed(0)}M`);
        this.updateElement('equity-percentage', `${equityPercentage.toFixed(1)}%`);
    }
    
    updateFundingAllocation() {
        const fundingAmount = parseFloat(document.getElementById('funding-request')?.value || 10000000);
        
        const allocations = {
            product: parseFloat(document.getElementById('product-allocation')?.value || 40),
            marketing: parseFloat(document.getElementById('marketing-allocation')?.value || 25),
            operations: parseFloat(document.getElementById('operations-allocation')?.value || 20),
            workingCapital: parseFloat(document.getElementById('working-capital-allocation')?.value || 15)
        };
        
        // Normalize to 100%
        const total = Object.values(allocations).reduce((a, b) => a + b, 0);
        Object.keys(allocations).forEach(key => {
            allocations[key] = (allocations[key] / total) * 100;
        });
        
        // Update displays
        Object.keys(allocations).forEach(key => {
            const amount = (fundingAmount * allocations[key]) / 100;
            const elementId = key === 'workingCapital' ? 'working-capital-amount' : `${key}-amount`;
            this.updateElement(elementId, `$${(amount / 1000000).toFixed(1)}M (${allocations[key].toFixed(0)}%)`);
        });
    }
    
    updateChartsForTab(tabId) {
        // This will be called by the charts module when implemented
        if (window.charts && window.charts.updateChartsForTab) {
            window.charts.updateChartsForTab(tabId);
        }
    }
    
    updateAllMetrics() {
        this.updateInfrastructureCosts();
        this.updateRevenueProjections();
        this.updateAllValuationMethods();
        this.updateFundingMetrics();
        this.updateFundingAllocation();
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    // Excel-like Financial Model Functions
    initializeExcelInterface() {
        // Make cells editable
        const editableCells = document.querySelectorAll('.editable-cell');
        editableCells.forEach(cell => {
            cell.addEventListener('click', this.makeEditable.bind(this));
            cell.addEventListener('blur', this.updateCalculations.bind(this));
            cell.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.target.blur();
                }
            });
        });
        
        this.updateCalculations();
    }
    
    makeEditable(event) {
        const cell = event.target;
        if (cell.classList.contains('editing')) return;
        
        const originalValue = cell.textContent;
        cell.classList.add('editing');
        cell.contentEditable = true;
        cell.focus();
        
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(cell);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    updateCalculations() {
        // Calculate totals for each year
        const years = ['2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032'];
        
        years.forEach(year => {
            // Calculate total revenue
            let totalRevenue = 0;
            ['freelancer', 'healthcare', 'enterprise', 'government'].forEach(segment => {
                const cell = document.querySelector(`[data-year="${year}"][data-metric="${segment}-revenue"]`);
                if (cell) {
                    totalRevenue += parseFloat(cell.textContent) || 0;
                }
            });
            this.updateElement(`total-revenue-${year}`, totalRevenue.toFixed(1));
            
            // Calculate total costs
            let totalCosts = 0;
            ['infrastructure-costs', 'rd-expenses', 'sales-marketing', 'general-admin'].forEach(metric => {
                const cell = document.querySelector(`[data-year="${year}"][data-metric="${metric}"]`);
                if (cell) {
                    totalCosts += parseFloat(cell.textContent) || 0;
                }
            });
            this.updateElement(`total-costs-${year}`, totalCosts.toFixed(1));
            
            // Calculate cash flows
            const operatingCF = totalRevenue - totalCosts;
            const freeCF = operatingCF - (totalRevenue * 0.05); // Assume 5% capex
            
            this.updateElement(`operating-cf-${year}`, operatingCF.toFixed(1));
            this.updateElement(`free-cf-${year}`, freeCF.toFixed(1));
            
            // Update cash flow styling
            const opCfElement = document.getElementById(`operating-cf-${year}`);
            const freeCfElement = document.getElementById(`free-cf-${year}`);
            
            if (opCfElement) {
                opCfElement.className = operatingCF >= 0 ? 'calculated-cell cash-positive' : 'calculated-cell cash-negative';
            }
            if (freeCfElement) {
                freeCfElement.className = freeCF >= 0 ? 'calculated-cell cash-positive' : 'calculated-cell cash-negative';
            }
        });
        
        // Calculate cumulative FCF
        let cumulativeFCF = 0;
        years.forEach(year => {
            const freeCfElement = document.getElementById(`free-cf-${year}`);
            if (freeCfElement) {
                const freeCF = parseFloat(freeCfElement.textContent) || 0;
                cumulativeFCF += freeCF;
                this.updateElement(`cumulative-fcf-${year}`, cumulativeFCF.toFixed(1));
            }
        });
    }

    initBannerInteractions() {
        // Add click handlers for banner sections to navigate to separate pages
        const bannerSections = document.querySelectorAll('.banner-section');
        
        bannerSections.forEach(section => {
            section.addEventListener('click', () => {
                const sectionType = section.dataset.section;
                
                // Navigate to dedicated page based on section type
                switch(sectionType) {
                    case 'technicals':
                        this.showDedicatedPage('technicals');
                        break;
                    case 'tropes':
                        this.showDedicatedPage('tropes');
                        break;
                    case 'market':
                        this.showDedicatedPage('market');
                        break;
                    case 'swot':
                        this.showDedicatedPage('swot');
                        break;
                    default:
                        console.log('Unknown section:', sectionType);
                }
            });
        });
        
        console.log('✅ Banner interactions initialized');
    }

    showDedicatedPage(pageType) {
        // Hide all main content
        const mainContent = document.querySelector('.main-content');
        const header = document.querySelector('.glass-header');
        const marketGapBanner = document.querySelector('.market-gap-banner');
        const pitchDeckBanner = document.querySelector('.pitch-deck-banner');
        
        // Hide main elements
        if (mainContent) mainContent.style.display = 'none';
        if (marketGapBanner) marketGapBanner.style.display = 'none';
        if (pitchDeckBanner) pitchDeckBanner.style.display = 'none';
        
        // Create dedicated page content
        this.createDedicatedPageContent(pageType);
        
        // Add back button functionality
        this.addBackButtonHandler();
    }

    createDedicatedPageContent(pageType) {
        // Remove existing dedicated page if present
        const existingPage = document.getElementById('dedicated-page');
        if (existingPage) {
            existingPage.remove();
        }
        
        // Create new dedicated page container
        const dedicatedPage = document.createElement('div');
        dedicatedPage.id = 'dedicated-page';
        dedicatedPage.className = 'dedicated-page-container';
        
        // Get content based on page type
        let pageContent = '';
        switch(pageType) {
            case 'technicals':
                pageContent = document.getElementById('technicals-detail').innerHTML;
                break;
            case 'tropes':
                pageContent = document.getElementById('tropes-detail').innerHTML;
                break;
            case 'market':
                pageContent = document.getElementById('market-detail').innerHTML;
                break;
            case 'swot':
                pageContent = document.getElementById('swot-detail').innerHTML;
                break;
        }
        
        dedicatedPage.innerHTML = `
            <div class="dedicated-page-header">
                <button class="back-btn">← Back to Main</button>
                <h1 class="page-title">${this.getPageTitle(pageType)}</h1>
            </div>
            <div class="dedicated-page-content">
                ${pageContent}
            </div>
        `;
        
        // Insert after header
        const header = document.querySelector('.glass-header');
        header.parentNode.insertBefore(dedicatedPage, header.nextSibling);
        
        // Show the page content that was initially hidden
        const detailSection = dedicatedPage.querySelector('.banner-detail-section');
        if (detailSection) {
            detailSection.style.display = 'block';
        }
    }

    getPageTitle(pageType) {
        const titles = {
            'technicals': 'Technical Architecture Deep Dive',
            'tropes': 'Market Tropes & Documentation Revolution',
            'market': 'Market Analysis & Competitive Landscape',
            'swot': 'SWOT Analysis & Strategic Assessment'
        };
        return titles[pageType] || 'Detailed Analysis';
    }

    addBackButtonHandler() {
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.returnToMain();
            });
        }
    }

    returnToMain() {
        // Remove dedicated page
        const dedicatedPage = document.getElementById('dedicated-page');
        if (dedicatedPage) {
            dedicatedPage.remove();
        }
        
        // Show main content
        const mainContent = document.querySelector('.main-content');
        const marketGapBanner = document.querySelector('.market-gap-banner');
        const pitchDeckBanner = document.querySelector('.pitch-deck-banner');
        
        if (mainContent) mainContent.style.display = 'block';
        if (marketGapBanner) marketGapBanner.style.display = 'block';
        if (pitchDeckBanner) pitchDeckBanner.style.display = 'block';
    }

    initAICostChart() {
        const canvas = document.getElementById('ai-cost-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Sample data points for AI cost deflation
        const years = ['2025', '2026', '2027', '2028', '2029', '2030'];
        const aiInfrastructureCost = [100, 75, 55, 35, 20, 12]; // Decreasing costs
        const applicationValue = [100, 140, 200, 320, 450, 630]; // Increasing value
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set up chart dimensions
        const padding = 50;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const x = padding + (i * chartWidth) / 5;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + chartHeight);
            ctx.stroke();
            
            const y = padding + (i * chartHeight) / 5;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }
        
        // Draw AI Infrastructure Cost line (decreasing)
        ctx.beginPath();
        ctx.strokeStyle = '#f56565';
        ctx.lineWidth = 3;
        
        aiInfrastructureCost.forEach((cost, index) => {
            const x = padding + (index * chartWidth) / (years.length - 1);
            const y = padding + chartHeight - (cost / 100 * chartHeight);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // Draw Application Value line (increasing)
        ctx.beginPath();
        ctx.strokeStyle = '#48bb78';
        ctx.lineWidth = 3;
        
        applicationValue.forEach((value, index) => {
            const x = padding + (index * chartWidth) / (years.length - 1);
            const y = padding + chartHeight - (Math.min(value, 100) / 100 * chartHeight);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // Draw data points
        aiInfrastructureCost.forEach((cost, index) => {
            const x = padding + (index * chartWidth) / (years.length - 1);
            const y = padding + chartHeight - (cost / 100 * chartHeight);
            
            ctx.fillStyle = '#f56565';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
        
        applicationValue.forEach((value, index) => {
            const x = padding + (index * chartWidth) / (years.length - 1);
            const y = padding + chartHeight - (Math.min(value, 100) / 100 * chartHeight);
            
            ctx.fillStyle = '#48bb78';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Add labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        
        years.forEach((year, index) => {
            const x = padding + (index * chartWidth) / (years.length - 1);
            ctx.fillText(year, x, canvas.height - 20);
        });
        
        // Add legend
        ctx.textAlign = 'left';
        ctx.fillStyle = '#f56565';
        ctx.fillText('AI Infrastructure Cost', 20, 30);
        ctx.fillStyle = '#48bb78';
        ctx.fillText('Application Value', 20, 50);
        
        console.log('✅ AI Cost Chart initialized');
    }

    initGeneticAlgorithmDemo() {
        const runButton = document.getElementById('run-evolution');
        const resetButton = document.getElementById('reset-evolution');
        
        if (!runButton || !resetButton) return;
        
        // Genetic Algorithm simulation data
        this.evolutionData = {
            basePrompts: [
                {
                    text: "Analyze this document and determine if it contains hospital admission records.",
                    fitness: 0.42
                },
                {
                    text: "Check if this medical document has patient admission information.",
                    fitness: 0.38
                }
            ],
            generations: [
                {
                    generation: 1,
                    bestPrompt: "Examine this medical document to identify hospital admission records including patient intake data.",
                    fitness: 0.51,
                    avgFitness: 0.47,
                    mutations: 3,
                    crossovers: 2
                },
                {
                    generation: 2,
                    bestPrompt: "Analyze this healthcare document for hospital admission records, including patient intake forms and admission data.",
                    fitness: 0.58,
                    avgFitness: 0.52,
                    mutations: 4,
                    crossovers: 3
                },
                {
                    generation: 3,
                    bestPrompt: "Systematically examine this medical document to detect hospital admission records, patient intake information, and related admission documentation.",
                    fitness: 0.64,
                    avgFitness: 0.57,
                    mutations: 2,
                    crossovers: 4
                },
                {
                    generation: 4,
                    bestPrompt: "Comprehensively analyze this healthcare document to identify hospital admission records, including patient intake forms, admission dates, and diagnostic information.",
                    fitness: 0.69,
                    avgFitness: 0.62,
                    mutations: 3,
                    crossovers: 3
                },
                {
                    generation: 5,
                    bestPrompt: "Methodically examine this medical document for hospital admission records, specifically identifying patient intake data, admission timestamps, diagnostic codes, and related healthcare documentation.",
                    fitness: 0.74,
                    avgFitness: 0.67,
                    mutations: 2,
                    crossovers: 4
                },
                {
                    generation: 6,
                    bestPrompt: "Perform detailed analysis of this healthcare document to detect hospital admission records, including comprehensive patient intake information, admission procedures, diagnostic assessments, and associated medical documentation.",
                    fitness: 0.79,
                    avgFitness: 0.71,
                    mutations: 3,
                    crossovers: 2
                },
                {
                    generation: 7,
                    bestPrompt: "Systematically analyze this medical document to identify hospital admission records by examining patient intake forms, admission protocols, diagnostic procedures, treatment plans, and comprehensive healthcare documentation patterns.",
                    fitness: 0.83,
                    avgFitness: 0.76,
                    mutations: 2,
                    crossovers: 3
                },
                {
                    generation: 8,
                    bestPrompt: "Execute comprehensive medical document analysis to detect hospital admission records through systematic examination of patient intake documentation, admission timestamps, diagnostic assessments, treatment protocols, and associated healthcare administrative records.",
                    fitness: 0.87,
                    avgFitness: 0.80,
                    mutations: 1,
                    crossovers: 4
                },
                {
                    generation: 9,
                    bestPrompt: "Conduct thorough medical document examination to identify hospital admission records by analyzing patient intake documentation, admission chronology, diagnostic evaluations, treatment planning, medical history integration, and comprehensive healthcare administrative documentation systems.",
                    fitness: 0.91,
                    avgFitness: 0.84,
                    mutations: 2,
                    crossovers: 2
                },
                {
                    generation: 10,
                    bestPrompt: "Execute sophisticated medical document analysis to precisely identify hospital admission records through systematic evaluation of patient intake documentation, admission temporal sequences, comprehensive diagnostic assessments, treatment protocol initialization, medical history correlation, and integrated healthcare administrative documentation frameworks with contextual medical terminology validation.",
                    fitness: 0.94,
                    avgFitness: 0.88,
                    mutations: 1,
                    crossovers: 3
                }
            ]
        };
        
        this.currentGeneration = 0;
        this.isRunning = false;
        
        runButton.addEventListener('click', () => this.runEvolution());
        resetButton.addEventListener('click', () => this.resetEvolution());
        
        console.log('✅ Genetic Algorithm Demo initialized');
    }

    async runEvolution() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const runButton = document.getElementById('run-evolution');
        const resetButton = document.getElementById('reset-evolution');
        const evolutionDisplay = document.getElementById('evolution-display');
        const currentGenSpan = document.getElementById('current-generation');
        
        runButton.disabled = true;
        runButton.textContent = 'Running Evolution...';
        
        // Clear previous results
        evolutionDisplay.innerHTML = '';
        document.getElementById('final-prompt').style.display = 'none';
        
        // Simulate evolution over 10 generations
        for (let i = 0; i < this.evolutionData.generations.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1200)); // Delay for visual effect
            
            const generation = this.evolutionData.generations[i];
            this.currentGeneration = generation.generation;
            
            currentGenSpan.textContent = this.currentGeneration;
            
            // Create generation display
            const genDiv = document.createElement('div');
            genDiv.className = 'generation-step';
            if (generation.generation === 10) {
                genDiv.classList.add('best-prompt');
            }
            
            genDiv.innerHTML = `
                <h5>Generation ${generation.generation}</h5>
                <div class="evolution-stats">
                    <div class="stat-item">
                        <span class="stat-label">Best Fitness:</span>
                        <span class="stat-value">${generation.fitness.toFixed(2)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Avg Fitness:</span>
                        <span class="stat-value">${generation.avgFitness.toFixed(2)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Mutations:</span>
                        <span class="stat-value">${generation.mutations}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Crossovers:</span>
                        <span class="stat-value">${generation.crossovers}</span>
                    </div>
                </div>
                <div class="prompt-text${generation.generation === 10 ? ' optimized' : ''}">
                    "${generation.bestPrompt}"
                </div>
            `;
            
            evolutionDisplay.appendChild(genDiv);
            evolutionDisplay.scrollTop = evolutionDisplay.scrollHeight;
        }
        
        // Show final optimized prompt
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const finalGeneration = this.evolutionData.generations[9]; // Generation 10
        const initialFitness = Math.max(this.evolutionData.basePrompts[0].fitness, this.evolutionData.basePrompts[1].fitness);
        const improvement = ((finalGeneration.fitness - initialFitness) / initialFitness * 100).toFixed(0);
        
        const finalPromptDiv = document.getElementById('final-prompt');
        const optimizedPromptText = finalPromptDiv.querySelector('.prompt-text');
        
        optimizedPromptText.textContent = `"${finalGeneration.bestPrompt}"`;
        
        document.getElementById('final-fitness').textContent = finalGeneration.fitness.toFixed(2);
        document.getElementById('fitness-improvement').textContent = `+${improvement}%`;
        document.getElementById('prompt-length').textContent = `${finalGeneration.bestPrompt.length} chars`;
        
        finalPromptDiv.style.display = 'block';
        finalPromptDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Reset button states
        runButton.disabled = false;
        runButton.textContent = 'Run Evolution';
        this.isRunning = false;
        
        console.log('✅ Evolution completed successfully');
    }

    resetEvolution() {
        if (this.isRunning) return;
        
        this.currentGeneration = 0;
        document.getElementById('current-generation').textContent = '0';
        document.getElementById('evolution-display').innerHTML = '';
        document.getElementById('final-prompt').style.display = 'none';
        
        console.log('✅ Evolution reset');
    }
    
    initHoverCards() {
        // Initialize ISCO hover card functionality
        const hoverTriggers = document.querySelectorAll('.isco-hover-trigger');
        const hoverCards = document.querySelectorAll('.hover-card');
        
        hoverTriggers.forEach(trigger => {
            const tooltipId = trigger.getAttribute('data-tooltip');
            const hoverCard = document.getElementById(tooltipId);
            
            if (hoverCard) {
                let hoverTimeout;
                
                // Show hover card on mouseenter
                trigger.addEventListener('mouseenter', (e) => {
                    clearTimeout(hoverTimeout);
                    
                    // Hide all other hover cards
                    hoverCards.forEach(card => card.classList.remove('active'));
                    
                    // Position and show the relevant hover card
                    const rect = trigger.getBoundingClientRect();
                    const cardRect = hoverCard.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    
                    // Reset positioning
                    hoverCard.style.left = '';
                    hoverCard.style.right = '';
                    hoverCard.style.transform = '';
                    
                    // Calculate optimal position
                    let leftPosition = rect.left + (rect.width / 2) - (420 / 2); // 420px is card width
                    
                    // Adjust if card would go off-screen
                    if (leftPosition < 10) {
                        hoverCard.style.left = '10px';
                        hoverCard.style.transform = 'none';
                    } else if (leftPosition + 420 > viewportWidth - 10) {
                        hoverCard.style.right = '10px';
                        hoverCard.style.left = 'auto';
                        hoverCard.style.transform = 'none';
                    } else {
                        hoverCard.style.left = `${leftPosition}px`;
                        hoverCard.style.transform = 'none';
                    }
                    
                    // Position vertically
                    hoverCard.style.top = `${rect.bottom + 8}px`;
                    hoverCard.style.position = 'fixed';
                    
                    // Show the card
                    setTimeout(() => {
                        hoverCard.classList.add('active');
                    }, 10);
                });
                
                // Hide hover card on mouseleave with delay
                trigger.addEventListener('mouseleave', () => {
                    hoverTimeout = setTimeout(() => {
                        hoverCard.classList.remove('active');
                    }, 200);
                });
                
                // Keep hover card open when hovering over it
                hoverCard.addEventListener('mouseenter', () => {
                    clearTimeout(hoverTimeout);
                });
                
                hoverCard.addEventListener('mouseleave', () => {
                    hoverCard.classList.remove('active');
                });
            }
        });
        
        // Close hover cards when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.isco-hover-trigger') && !e.target.closest('.hover-card')) {
                hoverCards.forEach(card => card.classList.remove('active'));
            }
        });
        
        console.log('✅ ISCO hover cards initialized');
    }

    initSourcesPanel() {
        const sourcesPanel = document.getElementById('sources-panel');
        const sourcesToggleBtn = document.getElementById('sources-toggle-btn');
        const sourcesCloseBtn = document.getElementById('sources-close');

        if (!sourcesPanel || !sourcesToggleBtn) {
            console.warn('Sources panel elements not found');
            return;
        }

        // Toggle panel on button click
        sourcesToggleBtn.addEventListener('click', () => {
            sourcesPanel.classList.toggle('active');
        });

        // Close panel on close button click
        if (sourcesCloseBtn) {
            sourcesCloseBtn.addEventListener('click', () => {
                sourcesPanel.classList.remove('active');
            });
        }

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!sourcesPanel.contains(e.target) && !sourcesToggleBtn.contains(e.target)) {
                sourcesPanel.classList.remove('active');
            }
        });

        // Close panel on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                sourcesPanel.classList.remove('active');
            }
        });

        console.log('✅ Sources panel initialized');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.investorPresentation = new InvestorPresentation();
    
    // Initialize Excel interface after a short delay to ensure DOM is ready
    setTimeout(() => {
        if (window.investorPresentation.initializeExcelInterface) {
            window.investorPresentation.initializeExcelInterface();
        }
        
        // Initialize tooltip system
        initializeTooltips();
    }, 1000);
});

// Comprehensive Tooltip System
function initializeTooltips() {
    // Financial terms and their explanations
    const termDefinitions = {
        'DCF': {
            title: 'Discounted Cash Flow',
            content: 'A valuation method that estimates the value of an investment based on its expected future cash flows, discounted back to present value.',
            basis: 'Uses 12% discount rate (WACC) and 3% terminal growth rate'
        },
        'NPV': {
            title: 'Net Present Value',
            content: 'The difference between the present value of cash inflows and outflows over a period of time.',
            basis: 'Calculated using risk-adjusted discount rates based on market conditions'
        },
        'IRR': {
            title: 'Internal Rate of Return',
            content: 'The discount rate that makes the NPV of all cash flows equal to zero.',
            basis: '847% based on 5-year projection with $10M initial investment'
        },
        'WACC': {
            title: 'Weighted Average Cost of Capital',
            content: 'The average rate of return a company is expected to pay its security holders to finance its assets.',
            basis: '12% based on tech startup benchmarks and risk profile'
        },
        'TAM': {
            title: 'Total Addressable Market',
            content: 'The total market demand for a product or service, representing the maximum revenue opportunity.',
            basis: '$49.3B calculated from AI writing assistant market analysis'
        },
        'LTV': {
            title: 'Customer Lifetime Value',
            content: 'The predicted net profit attributed to the entire future relationship with a customer.',
            basis: 'Based on average subscription duration and churn rates by segment'
        },
        'CAC': {
            title: 'Customer Acquisition Cost',
            content: 'The cost associated with convincing a consumer to buy a product/service.',
            basis: 'Includes marketing spend, sales costs, and onboarding expenses'
        },
        'EBITDA': {
            title: 'Earnings Before Interest, Taxes, Depreciation, and Amortization',
            content: 'A measure of a company\'s operating performance and profitability.',
            basis: 'Revenue minus operating expenses, before financial and accounting adjustments'
        },
        'CAGR': {
            title: 'Compound Annual Growth Rate',
            content: 'The rate of return that would be required for an investment to grow from beginning balance to ending balance.',
            basis: '285% calculated over 5-year projection period'
        }
    };

    // Number basis explanations
    const numberBasis = {
        '$2.84B': 'DCF valuation based on 8-year cash flow projections with 12% discount rate',
        '847%': '5-year IRR calculated from $10M investment to $2.84B valuation',
        '19 months': 'Break-even point based on revenue growth and cost structure',
        '$49.3B': 'AI writing market TAM from industry analysis (Gartner, McKinsey)',
        '285%': 'Revenue CAGR from 2025-2030 projection',
        '10M+ tokens': 'Context window size enabling large document processing',
        '$29': 'Freelancer tier pricing optimized for market penetration',
        '$79': 'Healthcare tier pricing based on ROI analysis',
        '$249': 'Enterprise tier pricing aligned with value delivered',
        '$1,249': 'Government tier pricing reflecting compliance costs',
        '74.4%': 'Freelancer gross margin after infrastructure and operational costs',
        '80.5%': 'Healthcare gross margin reflecting premium value proposition',
        '83.8%': 'Enterprise gross margin with economies of scale',
        '87.7%': 'Government gross margin due to high-value contracts',
        '7.7x': 'Freelancer LTV/CAC ratio indicating strong unit economics',
        '3.3x': 'Healthcare LTV/CAC ratio with higher acquisition costs',
        '2.4x': 'Enterprise LTV/CAC ratio reflecting longer sales cycles',
        '1.8x': 'Government LTV/CAC ratio with highest acquisition costs'
    };

    // Add tooltips to financial terms
    Object.keys(termDefinitions).forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        const definition = termDefinitions[term];
        
        document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, td, th, label').forEach(element => {
            if (element.children.length === 0 && element.textContent.includes(term)) {
                element.innerHTML = element.innerHTML.replace(regex, (match) => {
                    return `<span class="tooltip-term">${match}<div class="tooltip">
                        <div class="tooltip-header">${definition.title}</div>
                        <div class="tooltip-content">${definition.content}</div>
                        <div class="tooltip-basis">${definition.basis}</div>
                    </div></span>`;
                });
            }
        });
    });

    // Add tooltips to specific numbers
    Object.keys(numberBasis).forEach(number => {
        const escapedNumber = number.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedNumber, 'g');
        
        document.querySelectorAll('.stat-value, .metric-value, .result-value, .insight-value, .cost-amount, .calculated-cell, .editable-cell, .price, .funding-metric span').forEach(element => {
            if (element.textContent.includes(number)) {
                element.innerHTML = element.innerHTML.replace(regex, (match) => {
                    return `<span class="tooltip-number">${match}<div class="tooltip">
                        <div class="tooltip-header">Calculation Basis</div>
                        <div class="tooltip-content">${numberBasis[number]}</div>
                    </div></span>`;
                });
            }
        });
    });

    console.log('✅ Tooltip system initialized with comprehensive term definitions and number explanations');
}

// Initialize Mermaid diagrams - Simplified approach
function initMermaidDiagrams() {
    if (typeof mermaid !== 'undefined') {
        console.log('🔧 Initializing Mermaid diagrams...');
        
        // Configure Mermaid with startOnLoad disabled for manual control
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            themeVariables: {
                primaryColor: '#10b981',
                primaryTextColor: '#0f3821',
                primaryBorderColor: '#059669',
                lineColor: '#6b7280'
            },
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true
            },
            sequence: {
                useMaxWidth: true
            },
            securityLevel: 'loose'
        });
        
        console.log('✅ Mermaid initialized');
        
        // Main rendering function
        window.renderMermaidDiagrams = async function() {
            console.log('🔄 Rendering Mermaid diagrams...');
            const allDiagrams = document.querySelectorAll('.mermaid');
            console.log(`Found ${allDiagrams.length} total diagrams`);
            
            let rendered = 0;
            
            for (let i = 0; i < allDiagrams.length; i++) {
                const element = allDiagrams[i];
                
                // Skip if already rendered (contains SVG)
                if (element.querySelector('svg')) {
                    continue;
                }
                
                try {
                    const graphDefinition = element.textContent.trim();
                    if (graphDefinition && !graphDefinition.includes('<svg')) {
                        // Generate unique ID for this diagram
                        const diagramId = `mermaid-diagram-${i}-${Date.now()}`;
                        
                        // Render the diagram
                        const { svg } = await mermaid.render(diagramId, graphDefinition);
                        
                        // Replace content with rendered SVG
                        element.innerHTML = svg;
                        element.classList.add('mermaid-rendered');
                        rendered++;
                        
                        console.log(`✅ Rendered diagram ${i + 1}/${allDiagrams.length}`);
                    }
                } catch (error) {
                    console.error(`❌ Error rendering diagram ${i + 1}:`, error);
                    element.innerHTML = `
                        <div style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; color: #dc2626;">
                            <strong>Diagram Render Error</strong><br>
                            <small>${error.message || 'Invalid syntax'}</small>
                        </div>
                    `;
                }
            }
            
            console.log(`🎉 Rendered ${rendered} new diagrams`);
        };
        
        // Initial render with multiple attempts
        setTimeout(() => {
            window.renderMermaidDiagrams();
        }, 100);
        
        // Retry after longer delay for any missed diagrams
        setTimeout(() => {
            const unrendered = document.querySelectorAll('.mermaid:not(.mermaid-rendered)');
            if (unrendered.length > 0) {
                console.log(`🔄 Retrying ${unrendered.length} unrendered diagrams...`);
                window.renderMermaidDiagrams();
            }
        }, 1000);
        
        // Re-render on tab switch
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-tab')) {
                setTimeout(() => {
                    if (window.renderMermaidDiagrams) {
                        window.renderMermaidDiagrams();
                    }
                }, 200);
            }
        });
        
    } else {
        console.error('❌ Mermaid library not found');
        
        // Fallback: retry after a delay
        setTimeout(() => {
            if (typeof mermaid !== 'undefined') {
                console.log('🔄 Mermaid found on retry, initializing...');
                initMermaidDiagrams();
            } else {
                console.error('❌ Mermaid still not found after retry');
            }
        }, 2000);
    }
}

// Zoom functionality for diagrams
function zoomDiagram(button, factor) {
    const card = button.closest('.glass-card');
    const mermaidElement = card.querySelector('.diagram-zoomable');
    
    if (mermaidElement) {
        let currentScale = parseFloat(mermaidElement.dataset.scale || '1');
        currentScale *= factor;
        
        // Limit zoom range
        currentScale = Math.max(0.5, Math.min(3, currentScale));
        
        mermaidElement.style.transform = `scale(${currentScale})`;
        mermaidElement.style.transformOrigin = 'top left';
        mermaidElement.dataset.scale = currentScale.toString();
        
        // Add overflow handling for zoomed content
        if (currentScale > 1) {
            mermaidElement.style.overflow = 'visible';
            card.style.overflow = 'auto';
        } else {
            mermaidElement.style.overflow = '';
            card.style.overflow = '';
        }
    }
}

function resetZoom(button) {
    const card = button.closest('.glass-card');
    const mermaidElement = card.querySelector('.diagram-zoomable');
    
    if (mermaidElement) {
        mermaidElement.style.transform = '';
        mermaidElement.style.overflow = '';
        mermaidElement.dataset.scale = '1';
        card.style.overflow = '';
    }
}

// Call initMermaidDiagrams when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMermaidDiagrams();
});