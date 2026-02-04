// src/service/toast-spam-protection.js

class ToastSpamProtection {
    constructor() {
        this.toastCounts = {}; // { 'message-key': { count: 0, timeout: null } }
        this.resetDelay = 5000; // 5 seconds
        this.maxNormalToasts = 3; // Show normal toast 3 times
        this.spamThreshold = 4; // 4th time shows warning
    }

    /**
     * Handle toast display with spam protection
     * @param {string} key - Unique identifier for the toast context (e.g., date)
     * @param {Function} normalToastFn - Function to show normal toast
     * @param {Function} warningToastFn - Function to show warning toast
     * @returns {boolean} - True if toast was shown, false if blocked
     */
    handleToast(key, normalToastFn, warningToastFn) {
        if (!this.toastCounts[key]) {
            this.toastCounts[key] = { count: 0, timeout: null };
        }

        const data = this.toastCounts[key];

        // Clear existing timeout
        if (data.timeout) {
            clearTimeout(data.timeout);
        }

        // Increment count
        data.count++;

        // Set new timeout to reset after 5 seconds of inactivity
        data.timeout = setTimeout(() => {
            this.toastCounts[key] = { count: 0, timeout: null };
        }, this.resetDelay);

        // Block toasts after warning
        if (data.count > this.spamThreshold) {
            return false;
        }

        // Show warning on 4th attempt
        if (data.count === this.spamThreshold) {
            warningToastFn();
            return true;
        }

        // Show normal toast (1st to 3rd)
        if (data.count <= this.maxNormalToasts) {
            normalToastFn();
            return true;
        }

        return false;
    }

    /**
     * Check current count for a key
     * @param {string} key - The key to check
     * @returns {number} - Current count
     */
    getCount(key) {
        return this.toastCounts[key]?.count || 0;
    }

    /**
     * Manually reset a specific key
     * @param {string} key - The key to reset
     */
    reset(key) {
        if (this.toastCounts[key]?.timeout) {
            clearTimeout(this.toastCounts[key].timeout);
        }
        delete this.toastCounts[key];
    }

    /**
     * Reset all keys
     */
    resetAll() {
        Object.keys(this.toastCounts).forEach(key => {
            if (this.toastCounts[key]?.timeout) {
                clearTimeout(this.toastCounts[key].timeout);
            }
        });
        this.toastCounts = {};
    }
}

// Singleton export
export const toastSpamProtection = new ToastSpamProtection();