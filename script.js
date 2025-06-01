// System Analysis Class
class SystemAnalyzer {
    constructor() {
        this.systemInfo = {};
        this.hardwareInfo = {};
        this.networkInfo = {};
        this.performanceInfo = {};
        this.init();
    }

    init() {
        this.detectSystem();
        this.detectHardware();
        this.setupEventListeners();
        this.addScrollAnimations();
        this.updatePerformanceStats();
    }

    setupEventListeners() {
        document.getElementById('start-network-test').addEventListener('click', () => {
            this.testNetwork();
        });

        document.getElementById('start-perf-test').addEventListener('click', () => {
            this.testPerformance();
        });
    }

    // System Detection
    detectSystem() {
        const nav = navigator;
        
        this.systemInfo = {
            userAgent: nav.userAgent,
            platform: nav.platform,
            language: nav.language,
            languages: nav.languages.join(', '),
            cookieEnabled: nav.cookieEnabled,
            onLine: nav.onLine,
            screenWidth: screen.width,
            screenHeight: screen.height,
            screenColorDepth: screen.colorDepth,
            pixelRatio: window.devicePixelRatio || 1,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
        };

        // Detect OS
        const ua = nav.userAgent;
        if (ua.includes('Windows')) this.systemInfo.os = 'Windows';
        else if (ua.includes('Mac')) this.systemInfo.os = 'macOS';
        else if (ua.includes('Linux')) this.systemInfo.os = 'Linux';
        else if (ua.includes('Android')) this.systemInfo.os = 'Android';
        else if (ua.includes('iOS')) this.systemInfo.os = 'iOS';
        else this.systemInfo.os = 'Inconnu';

        // Detect device type
        if (/Mobile|Android|iPhone|iPad/.test(ua)) {
            this.systemInfo.deviceType = 'Mobile';
        } else if (/Tablet|iPad/.test(ua)) {
            this.systemInfo.deviceType = 'Tablette';
        } else {
            this.systemInfo.deviceType = 'Ordinateur';
        }

        this.renderSystemInfo();
    }

    // Hardware Detection
    detectHardware() {
        const nav = navigator;
        
        this.hardwareInfo = {
            cores: nav.hardwareConcurrency || 'Inconnu',
            memory: nav.deviceMemory ? `${nav.deviceMemory} GB` : 'Inconnu',
            webgl: this.detectWebGL(),
            webgpu: 'gpu' in nav ? 'Supporté' : 'Non supporté',
            battery: 'getBattery' in nav ? 'API disponible' : 'Non disponible'
        };

        this.renderHardwareInfo();
    }

    detectWebGL() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) return 'Non supporté';

            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                return renderer || 'WebGL supporté';
            }
            
            return 'WebGL supporté';
        } catch (e) {
            return 'Erreur de détection';
        }
    }

    // Network Testing
    async testNetwork() {
        const button = document.getElementById('start-network-test');
        const status = document.getElementById('network-status');
        const results = document.getElementById('network-results');
        
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> Test en cours...';
        status.textContent = 'Test en cours';

        try {
            // Ping test
            const pingStart = performance.now();
            await fetch('https://www.google.com/favicon.ico', { 
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
            });
            const ping = Math.round(performance.now() - pingStart);

            // Download speed test (using a small file simulation)
            const downloadStart = performance.now();
            const testFile = new Blob(['0'.repeat(100000)], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(testFile);
            await fetch(url);
            URL.revokeObjectURL(url);
            const downloadTime = performance.now() - downloadStart;
            const downloadSpeed = Math.round((100000 * 8) / (downloadTime / 1000) / 1000); // Kbps

            this.networkInfo = {
                ping: `${ping} ms`,
                downloadSpeed: `${downloadSpeed} Kbps`,
                connection: navigator.connection ? navigator.connection.effectiveType : 'Inconnu',
                downlink: navigator.connection ? `${navigator.connection.downlink} Mbps` : 'Inconnu'
            };

            this.renderNetworkResults();
            status.textContent = 'Terminé';
            
        } catch (error) {
            status.textContent = 'Erreur';
            results.innerHTML = '<p style="color: #ef4444;">Erreur lors du test réseau</p>';
            results.style.display = 'block';
        } finally {
            button.disabled = false;
            button.textContent = 'Relancer le test';
        }
    }

    // Performance Testing
    async testPerformance() {
        const button = document.getElementById('start-perf-test');
        const status = document.getElementById('perf-status');
        const results = document.getElementById('performance-results');
        
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> Benchmark en cours...';
        status.textContent = 'Test en cours';

        try {
            // CPU Benchmark
            const cpuScore = await this.benchmarkCPU();
            
            // Memory Benchmark
            const memoryScore = await this.benchmarkMemory();
            
            // Graphics Benchmark
            const graphicsScore = await this.benchmarkGraphics();

            this.performanceInfo = {
                cpu: cpuScore,
                memory: memoryScore,
                graphics: graphicsScore,
                overall: Math.round((cpuScore + memoryScore + graphicsScore) / 3)
            };

            this.renderPerformanceResults();
            this.calculateOverallScore();
            status.textContent = 'Terminé';
            
        } catch (error) {
            status.textContent = 'Erreur';
            results.innerHTML = '<p style="color: #ef4444;">Erreur lors du benchmark</p>';
            results.style.display = 'block';
        } finally {
            button.disabled = false;
            button.textContent = 'Relancer le benchmark';
        }
    }

    // CPU Benchmark
    async benchmarkCPU() {
        return new Promise((resolve) => {
            const iterations = 1000000;
            const start = performance.now();
            
            // Simple mathematical operations
            for (let i = 0; i < iterations; i++) {
                Math.sqrt(i) * Math.random();
            }
            
            const time = performance.now() - start;
            const score = Math.round(Math.max(0, 100 - (time / 10)));
            resolve(Math.min(100, score));
        });
    }

    // Memory Benchmark
    async benchmarkMemory() {
        return new Promise((resolve) => {
            try {
                const arrays = [];
                const start = performance.now();
                
                // Create and manipulate arrays
                for (let i = 0; i < 1000; i++) {
                    arrays.push(new Array(1000).fill(Math.random()));
                }
                
                // Sort arrays
                arrays.forEach(arr => arr.sort());
                
                const time = performance.now() - start;
                const score = Math.round(Math.max(0, 100 - (time / 20)));
                resolve(Math.min(100, score));
            } catch (error) {
                resolve(50);
            }
        });
    }

    // Graphics Benchmark
    async benchmarkGraphics() {
        return new Promise((resolve) => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 800;
                canvas.height = 600;
                const ctx = canvas.getContext('2d');
                
                const start = performance.now();
                
                // Draw operations
                for (let i = 0; i < 1000; i++) {
                    ctx.fillStyle = `hsl(${i % 360}, 50%, 50%)`;
                    ctx.fillRect(
                        Math.random() * canvas.width,
                        Math.random() * canvas.height,
                        50, 50
                    );
                }
                
                const time = performance.now() - start;
                const score = Math.round(Math.max(0, 100 - (time / 30)));
                resolve(Math.min(100, score));
            } catch (error) {
                resolve(50);
            }
        });
    }

    // Render Methods
    renderSystemInfo() {
        const container = document.getElementById('system-info');
        container.innerHTML = `
            <div class="info-item">
                <div class="info-label">Système</div>
                <div class="info-value">${this.systemInfo.os}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Type d'appareil</div>
                <div class="info-value">${this.systemInfo.deviceType}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Résolution</div>
                <div class="info-value">${this.systemInfo.screenWidth}x${this.systemInfo.screenHeight}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Langue</div>
                <div class="info-value">${this.systemInfo.language}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Fuseau horaire</div>
                <div class="info-value">${this.systemInfo.timezone}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Tactile</div>
                <div class="info-value">${this.systemInfo.touchSupport ? 'Oui' : 'Non'}</div>
            </div>
        `;
    }

    renderHardwareInfo() {
        const container = document.getElementById('hardware-info');
        container.innerHTML = `
            <div class="info-item">
                <div class="info-label">Cœurs CPU</div>
                <div class="info-value highlight">${this.hardwareInfo.cores}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Mémoire RAM</div>
                <div class="info-value highlight">${this.hardwareInfo.memory}</div>
            </div>
            <div class="info-item">
                <div class="info-label">WebGL</div>
                <div class="info-value">${this.hardwareInfo.webgl}</div>
            </div>
            <div class="info-item">
                <div class="info-label">WebGPU</div>
                <div class="info-value">${this.hardwareInfo.webgpu}</div>
            </div>
        `;
    }

    renderNetworkResults() {
        const container = document.getElementById('network-results');
        container.innerHTML = `
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Ping</div>
                    <div class="info-value highlight">${this.networkInfo.ping}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Vitesse DL</div>
                    <div class="info-value highlight">${this.networkInfo.downloadSpeed}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Type de connexion</div>
                    <div class="info-value">${this.networkInfo.connection}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Débit estimé</div>
                    <div class="info-value">${this.networkInfo.downlink}</div>
                </div>
            </div>
        `;
        container.style.display = 'block';
    }

    renderPerformanceResults() {
        const container = document.getElementById('performance-results');
        container.innerHTML = `
            <div class="progress-container">
                <div class="progress-label">
                    <span>CPU</span>
                    <span>${this.performanceInfo.cpu}/100</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${this.performanceInfo.cpu}%"></div>
                </div>
            </div>
            <div class="progress-container">
                <div class="progress-label">
                    <span>Mémoire</span>
                    <span>${this.performanceInfo.memory}/100</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${this.performanceInfo.memory}%"></div>
                </div>
            </div>
            <div class="progress-container">
                <div class="progress-label">
                    <span>Graphiques</span>
                    <span>${this.performanceInfo.graphics}/100</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${this.performanceInfo.graphics}%"></div>
                </div>
            </div>
        `;
        container.style.display = 'block';
    }

    calculateOverallScore() {
        const systemScore = this.getSystemScore();
        const hardwareScore = this.getHardwareScore();
        const networkScore = this.getNetworkScore();
        const perfScore = this.performanceInfo.overall || 0;

        const overallScore = Math.round((systemScore + hardwareScore + networkScore + perfScore) / 4);
        
        document.getElementById('overall-score').textContent = overallScore;
        document.getElementById('overall-results').classList.add('visible');
        
        this.generateRecommendations(overallScore);
    }

    getSystemScore() {
        let score = 60; // Base score
        
        if (this.hardwareInfo.cores > 4) score += 10;
        if (this.systemInfo.deviceType === 'Ordinateur') score += 10;
        if (this.systemInfo.screenWidth >= 1920) score += 10;
        if (this.systemInfo.pixelRatio > 1) score += 5;
        if (this.hardwareInfo.webgl.includes('NVIDIA') || this.hardwareInfo.webgl.includes('AMD')) score += 5;
        
        return Math.min(100, score);
    }

    getHardwareScore() {
        let score = 50; // Base score
        
        const cores = parseInt(this.hardwareInfo.cores);
        if (cores >= 8) score += 25;
        else if (cores >= 4) score += 15;
        else if (cores >= 2) score += 10;
        
        const memory = parseInt(this.hardwareInfo.memory);
        if (memory >= 16) score += 25;
        else if (memory >= 8) score += 15;
        else if (memory >= 4) score += 10;
        
        return Math.min(100, score);
    }

    getNetworkScore() {
        if (!this.networkInfo.ping) return 50;
        
        let score = 50;
        const ping = parseInt(this.networkInfo.ping);
        
        if (ping < 20) score += 30;
        else if (ping < 50) score += 20;
        else if (ping < 100) score += 10;
        
        const speed = parseInt(this.networkInfo.downloadSpeed);
        if (speed > 10000) score += 20;
        else if (speed > 5000) score += 15;
        else if (speed > 1000) score += 10;
        
        return Math.min(100, score);
    }

    generateRecommendations(score) {
        const container = document.getElementById('recommendations');
        let recommendations = [];
        let category = '';
        let categoryClass = '';

        if (score >= 85) {
            category = 'Système Excellent';
            categoryClass = 'excellent';
            recommendations = [
                '🎮 Parfait pour le gaming haute définition',
                '🎬 Montage vidéo 4K recommandé',
                '💻 Développement et virtualisation',
                '🚀 Performances optimales pour tous usages'
            ];
        } else if (score >= 70) {
            category = 'Système Performant';
            categoryClass = 'good';
            recommendations = [
                '🎮 Gaming 1080p-1440p fluide',
                '📸 Retouche photo et montage vidéo',
                '💼 Bureautique avancée',
                '🌐 Navigation web excellente'
            ];
        } else if (score >= 55) {
            category = 'Système Correct';
            categoryClass = 'average';
            recommendations = [
                '💻 Bureautique et navigation standard',
                '📺 Streaming vidéo HD',
                '🎵 Création de contenu léger',
                '⚡ Quelques optimisations possibles'
            ];
        } else {
            category = 'Système Basique';
            categoryClass = 'basic';
            recommendations = [
                '📄 Bureautique simple',
                '🌐 Navigation web basique',
                '📧 Email et messagerie',
                '⬆️ Mise à niveau recommandée'
            ];
        }

        container.innerHTML = `
            <div class="category-badge ${categoryClass}">
                ${category}
            </div>
            <div class="recommendations-list">
                ${recommendations.map(rec => `<div class="recommendation-item">${rec}</div>`).join('')}
            </div>
        `;
    }

    // Export results as JSON
    exportResults() {
        const results = {
            timestamp: new Date().toISOString(),
            system: this.systemInfo,
            hardware: this.hardwareInfo,
            network: this.networkInfo,
            performance: this.performanceInfo,
            userAgent: navigator.userAgent
        };

        const dataStr = JSON.stringify(results, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `system_analysis_${new Date().getTime()}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Utility method to format bytes
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Utility method to detect mobile
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Advanced GPU detection
    getGPUInfo() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return 'Non supporté';

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            return `${vendor} - ${renderer}`;
        }
        
        return 'WebGL supporté';
    }

    // Battery info if available
    async getBatteryInfo() {
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                return {
                    level: Math.round(battery.level * 100),
                    charging: battery.charging,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime
                };
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    // Connection info
    getConnectionInfo() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return {
                effectiveType: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
            };
        }
        return null;
    }

    // Add scroll animations
    addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe cards
        document.querySelectorAll('.card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // Update performance stats
    updatePerformanceStats() {
        // Créer la section des stats de performance si elle n'existe pas
        if (!document.getElementById('memory-used')) {
            this.createPerformanceStatsSection();
        }

        // Memory usage (if available)
        if (performance.memory) {
            const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
            const memoryElement = document.getElementById('memory-used');
            if (memoryElement) {
                memoryElement.textContent = `${memoryMB} MB`;
            }
        } else {
            const memoryElement = document.getElementById('memory-used');
            if (memoryElement) {
                memoryElement.textContent = 'N/A';
            }
        }
        
        // Load time
        if (performance.timing) {
            const loadTime = Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart);
            const loadTimeElement = document.getElementById('load-time');
            if (loadTimeElement) {
                loadTimeElement.textContent = `${loadTime} ms`;
            }
        }
        
        // DOM elements count
        const domElements = document.querySelectorAll('*').length;
        const domElement = document.getElementById('dom-elements');
        if (domElement) {
            domElement.textContent = domElements;
        }
        
        // Local storage (estimate)
        let localStorageSize = 0;
        try {
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    localStorageSize += localStorage[key].length + key.length;
                }
            }
            const storageElement = document.getElementById('local-storage');
            if (storageElement) {
                storageElement.textContent = localStorageSize > 0 ? `${Math.round(localStorageSize/1024)} KB` : '0 KB';
            }
        } catch (e) {
            const storageElement = document.getElementById('local-storage');
            if (storageElement) {
                storageElement.textContent = 'N/A';
            }
        }
    }

    // Create performance stats section
    createPerformanceStatsSection() {
        const container = document.querySelector('.container');
        
        // Add export section
        const exportSection = document.createElement('div');
        exportSection.className = 'export-section';
        exportSection.innerHTML = `
            <button class="btn-secondary" onclick="window.systemAnalyzer.exportResults()">
                📊 Exporter les résultats
            </button>
            <button class="btn-secondary" onclick="window.location.reload()">
                🔄 Nouvelle analyse
            </button>
        `;
        
        // Add performance stats
        const performanceStats = document.createElement('div');
        performanceStats.className = 'stats-grid';
        performanceStats.innerHTML = `
            <div class="stat-card">
                <div class="stat-value" id="memory-used">--</div>
                <div class="stat-label">Mémoire JS</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="load-time">--</div>
                <div class="stat-label">Temps de chargement</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="dom-elements">--</div>
                <div class="stat-label">Éléments DOM</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="local-storage">--</div>
                <div class="stat-label">Stockage local</div>
            </div>
        `;
        
        container.appendChild(exportSection);
        container.appendChild(performanceStats);
    }
}

// Initialize the system analyzer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize analyzer
    window.systemAnalyzer = new SystemAnalyzer();
    
    // Set a timeout to add scroll animations after initialization
    setTimeout(() => {
        if (window.systemAnalyzer && typeof window.systemAnalyzer.addScrollAnimations === 'function') {
            window.systemAnalyzer.addScrollAnimations();
        }
    }, 100);
});