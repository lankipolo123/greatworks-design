//src\service\toast-widget.js
import '/src/components/toast-component.js';

class ToastService {
  constructor() {
    this.component = null;
    this.defaultPosition = 'top-center'; // default position
  }

  ensureComponent(position = this.defaultPosition) {
    // Create toast-component if it doesn't exist or position changed
    if (!this.component || this.component.position !== position) {
      if (this.component) {
        this.component.remove();
      }
      this.component = document.createElement('toast-component');
      this.component.position = position;
      this.component.setAttribute('position', position);
      document.body.appendChild(this.component);
    }
    return this.component;
  }

  setPosition(position) {
    this.defaultPosition = position;
    if (this.component) {
      this.component.position = position;
      this.component.setAttribute('position', position);
    }
  }

  show(message, type = 'info', duration = 4000, position = this.defaultPosition) {
    return this.ensureComponent(position).show(message, type, duration);
  }

  success(message, duration = 4000, position = this.defaultPosition) {
    return this.ensureComponent(position).success(message, duration);
  }

  error(message, duration = 5000, position = this.defaultPosition) {
    return this.ensureComponent(position).error(message, duration);
  }

  warning(message, duration = 4000, position = this.defaultPosition) {
    return this.ensureComponent(position).warning(message, duration);
  }

  info(message, duration = 4000, position = this.defaultPosition) {
    return this.ensureComponent(position).info(message, duration);
  }

  remove(id) {
    return this.component?.remove(id);
  }

  removeAll() {
    return this.component?.removeAll();
  }
}

// singleton export
export const toast = new ToastService();
