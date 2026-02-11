// /src/utility/app-state.js
// Simple pub/sub event bus for cross-component data refresh.
// Components subscribe to topics; when data changes, notify() triggers re-reads.

class AppState {
  constructor() {
    this._listeners = new Map();
  }

  /**
   * Subscribe to a topic. Returns an unsubscribe function.
   * Topics: 'user-updated', 'data-changed'
   */
  on(topic, callback) {
    if (!this._listeners.has(topic)) {
      this._listeners.set(topic, new Set());
    }
    this._listeners.get(topic).add(callback);
    return () => this._listeners.get(topic)?.delete(callback);
  }

  /**
   * Notify all subscribers of a topic.
   */
  notify(topic, detail = {}) {
    const listeners = this._listeners.get(topic);
    if (!listeners) return;
    listeners.forEach(cb => {
      try { cb(detail); } catch (e) { console.error(`[app-state] ${topic} listener error:`, e); }
    });
  }
}

export const appState = new AppState();
