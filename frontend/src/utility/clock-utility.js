// /src/utility/clock-utility.js

export class ClockUtility {
    constructor() {
        this.callbacks = new Set();
        this.interval = null;
        this.isRunning = false;
    }

    // Subscribe a component to clock updates
    subscribe(callback) {
        this.callbacks.add(callback);

        // Start the clock if this is the first subscriber
        if (!this.isRunning) {
            this.start();
        }

        // Immediately call the callback with current time
        callback(this.getCurrentTime());

        // Return unsubscribe function
        return () => {
            this.callbacks.delete(callback);

            // Stop the clock if no more subscribers
            if (this.callbacks.size === 0) {
                this.stop();
            }
        };
    }

    // Start the clock
    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.interval = setInterval(() => {
            const timeData = this.getCurrentTime();
            this.callbacks.forEach(callback => callback(timeData));
        }, 1000);
    }

    // Stop the clock
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
    }

    // Get current time and date formatted
    getCurrentTime() {
        const now = new Date();

        return {
            time: now.toLocaleTimeString('en-US', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit',
                seconds: '2-digit'
            }),
            date: now.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            timestamp: now.getTime()
        };
    }

    // Clean up all subscriptions
    destroy() {
        this.stop();
        this.callbacks.clear();
    }
}

// Create a singleton instance
export const clockUtility = new ClockUtility();