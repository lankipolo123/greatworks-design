// src/styles/pagination-styles.js
import { css } from 'lit';

export const PaginationDesign = css`
  :host {
    display: inline-block;
    color: #000000;
    font-size: 14px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .info-text {
    margin: 0;
    line-height: 1.5;
  }

  /* Mode 1 - Default style with border and background */
  :host(.mode-1) .pagination-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 6px 8px;
    background: white;
    border-radius: 24px;
    border: 1.2px solid #2d2b2b45;
    width: fit-content;
    margin: 0 auto;
  }

  :host(.mode-1) .pagination-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 38px;
    height: 38px;
    border: none;
    border-radius: 12px;
    background: transparent;
    color: #666464;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
  }

  :host(.mode-1) .pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :host(.mode-1) .pagination-btn.active {
    background: #070707;
    color: white;
    font-weight: 600;
  }

  :host(.mode-1) .search-box {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 8px;
    background: #f9fafb;
    border-radius: 12px;
    padding: 3px 8px;
  }

  :host(.mode-1) .search-input {
    border: none;
    background: transparent;
    width: 60px;
    outline: none;
    font-size: 14px;
    color: #374151;
    text-align: center;
  }

  :host(.mode-1) .search-btn {
    border: none;
    background: #f40c0c;
    color: white;
    border-radius: 8px;
    padding: 4px 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
  }

  /* Mode 2 - Simple text-based style */
  :host(.mode-2) .pagination-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 4px;
    background: transparent;
    width: fit-content;
    margin: 0 auto;
  }

  :host(.mode-2) .pagination-btn {
    border: none;
    background: transparent;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 4px 8px;
    transition: color 0.2s ease;
  }

  :host(.mode-2) .pagination-btn:hover:not(:disabled) {
    color: #000000;
    text-decoration: underline;
  }

  :host(.mode-2) .pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :host(.mode-2) .pagination-btn.active {
    color: #000000;
    font-weight: 700;
  }

  .dots {
    color: #090909;
    font-size: 15px;
    padding: 0 6px;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .icon svg {
    width: 18px;
    height: 18px;
  }
`;