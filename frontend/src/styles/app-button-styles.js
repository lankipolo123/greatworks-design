import { css } from 'lit';

export const appButtonStyles = css`   :host {
      display: inline-block;
    }

    button {
      font-family: inherit;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-weight: 500;
      transition: background-color 0.2s ease, transform 0.1s ease;
      box-sizing: border-box;
      white-space: nowrap;
    }

    button:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    /* ===== TYPES ===== */

    .primary {
      background: #da0d0dd7;
      color: #ffffff;
    }
    .primary:hover:not(:disabled) {
      background: rgb(212, 36, 6)
    }

    .secondary {
      background: #da0d0dd7;
      color: #ffffff;
      border: 1.25px solid #000000;
    }
    .secondary:hover:not(:disabled) {
      background: #131313;
      color:#da0d0dd7;
    }
      

    .tertiary {
      background: #2c2b2b;
      color: #ea0606;
    }
    .tertiary:hover:not(:disabled) {
      background: #000000;
      color: #ffffff;
    }

    .quaternary {
      background: #101010;
      color: #ffffff;
    }
    .quaternary:hover:not(:disabled) {
       color: #ffffff;
      background: #101010;
    }

    .danger {
      background: #dc3545;
      color: #ffffff;
    }
    .danger:hover:not(:disabled) {
      background: #a71d2a;
    }

    .warning {
      background: #ffffff;
      color: #dc3545;
      border: 1px solid #dc3545;
    }
    .warning:hover:not(:disabled) {
      background: #fff5f5;
    }

    /* ===== SIZES ===== */

    .small {
      font-size: 12px;
      padding: 4px 8px;
    }

    .medium {
      font-size: 13px;
      padding: 6px 12px;
    }

    .large {
      font-size: 15px;
      padding: 8px 16px;
    }
  `;