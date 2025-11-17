// API Configuration Management
const API_CONFIG_KEY = 'dataforseo_config';

class APIConfig {
    constructor() {
        this.login = null;
        this.password = null;
        this.loadFromStorage();
    }

    loadFromStorage() {
        const stored = localStorage.getItem(API_CONFIG_KEY);
        if (stored) {
            try {
                const config = JSON.parse(stored);
                this.login = config.login;
                this.password = config.password;
                return true;
            } catch (e) {
                console.error('Failed to load API config:', e);
                return false;
            }
        }
        return false;
    }

    save(login, password) {
        this.login = login;
        this.password = password;
        localStorage.setItem(API_CONFIG_KEY, JSON.stringify({
            login: this.login,
            password: this.password
        }));
    }

    isConfigured() {
        return !!(this.login && this.password);
    }

    getAuthHeader() {
        if (!this.isConfigured()) {
            throw new Error('API credentials not configured');
        }
        return 'Basic ' + btoa(`${this.login}:${this.password}`);
    }
}

// Initialize global config
const apiConfig = new APIConfig();
