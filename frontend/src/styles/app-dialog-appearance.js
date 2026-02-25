import { css } from 'lit';

export const dialogAppearance = css`

:host {
      display: none;
    }

    :host([open]) {
      display: block;
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .dialog-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .dialog-container.small { width: 400px; }
    .dialog-container.medium { width: 500px; }
    .dialog-container.large { width: 700px; }

    /* Close button */
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #f90505;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #f5f5f5;
      color: #d30101d6;
    }

    /* DEFAULT STYLE - Logout/Confi */
    .dialog-header {
      padding: 20px 24px 16px;
      border-bottom: 1px solid #2d2b2b45;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .dialog-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #8d1409;
      margin: 0;
    }

    .dialog-title .highlight {
      color: #8d1409;
    }

    .dialog-description {
      font-size: 0.95rem;
      color: #666;
      margin: 4px 0 0 0;
      font-weight: 500;
    }

    .dialog-body {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
      color: #666;
    }

    .dialog-footer {
      padding: 16px 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      border-top: 1px solid #f0f0f0;
    }

    /* COMPACT STYLE - Forms */
    :host([style-mode="compact"]) .dialog-header {
      padding: 16px 20px 8px;
      border-bottom: none;
    }

    :host([style-mode="compact"]) .dialog-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1a1a1a;
    }

    :host([style-mode="compact"]) .dialog-title .highlight {
      color: #1a1a1a;
    }

    :host([style-mode="compact"]) .dialog-description {
      font-size: 0.85rem;
      color: #999;
      margin: 2px 0 0 0;
      font-weight: 400;
    }

    :host([style-mode="compact"]) .dialog-body {
      padding: 12px 20px 16px;
    }

    :host([style-mode="compact"]) .dialog-footer {
      padding: 12px 20px;
      border-top: none;
    }

    /* CLEAN STYLE - Export/Minimal */
    :host([style-mode="clean"]) .dialog-header {
      border-bottom: none;
      padding: 24px 24px 16px;
    }

    :host([style-mode="clean"]) .dialog-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
    }

    :host([style-mode="clean"]) .dialog-title .highlight {
      color: #1a1a1a;
    }

    :host([style-mode="clean"]) .dialog-footer {
      border-top: none;
    }

    :host([hide-footer]) .dialog-footer {
      display: none;
    }

    .dialog-button {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .cancel-button {
      background: white;
      color: #ff0000;
      border: 1px solid #e0e0e0;
    }

    .cancel-button:hover {
      background: #c10505;
      color: #ffffff;
    }

    .confirm-button {
      background: #8d1409;
      color: white;
    }

    .confirm-button:hover {
      opacity: 0.9;
    }

    .confirm-button.primary {
      background: #007bff;
    }

    .confirm-button.danger {
      background: #8d1409;
    }

    .confirm-button.success {
      background: #28a745;
    }

    /* Export mode */
    .export-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .export-option {
      display: flex;
      align-items: center;
      padding: 12px;
      border: 1.5px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .export-option:hover {
      background: #f5f5f5;
      border-color: #da0d0dd7;
      transform: translateX(4px);
    }

    .export-option-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      border-radius: 8px;
      margin-right: 16px;
      color: #da0d0dd7;
    }

    .export-option-content {
      flex: 1;
    }

    .export-option-title {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 4px 0;
    }

    .export-option-desc {
      font-size: 0.85rem;
      color: #666;
      margin: 0;
    }

    /* Upload mode */
    .upload-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 8px;
    }

    .upload-option-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 20px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s;
      background: #ffffff;
    }

    .upload-option-card:hover {
      border-color: #0faaded7;
      background: #a1eaea;
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 170, 255, 0.1);
    }

    .upload-option-icon {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 50%;
      margin-bottom: 12px;
      color: #03bcffd7;
    }

    .upload-option-icon svg {
      width: 32px;
      height: 32px;
    }

    .upload-option-title {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }

    .upload-option-desc {
      font-size: 0.85rem;
      color: #666;
      text-align: center;
    }

    .upload-input {
      display: none;
    }

    .camera-view {
      width: 100%;
      max-width: 100%;
      border-radius: 8px;
      background: #000;
    }

    .camera-controls {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 16px;
    }

    .camera-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .camera-btn.capture {
      background: #da0d0dd7;
      color: white;
    }

    .camera-btn.capture:hover {
      background: #b80a0a;
    }

    .camera-btn.cancel {
      background: #f5f5f5;
      color: #333;
      border: 1px solid #e0e0e0;
    }

    .camera-btn.cancel:hover {
      background: #e0e0e0;
    }

    .preview-container {
      text-align: center;
    }

    .preview-image {
      max-width: 100%;
      max-height: 300px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .preview-name {
      font-size: 0.9rem;
      color: #666;
      margin-top: 12px;
    }

    .change-photo-btn {
      margin-top: 12px;
      padding: 8px 16px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .change-photo-btn:hover {
      background: #f5f5f5;
      border-color: #da0d0dd7;
    }

    .date-range-section {
      margin-top: 16px;
    }

    .date-range-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }

    .date-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .date-input-group {
      display: flex;
      flex-direction: column;
    }

    .date-input-group label {
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 2px;
    }

    .date-input-group input {
      padding: 6px 9px;
      border: 1.5px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .date-input-group input:focus {
      outline: none;
      border-color: #da0d0dd7;
    }

    /* Ticket View Mode */
    .ticket-profile-section {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }

    .ticket-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #e4e4e8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1rem;
      color: #666;
      flex-shrink: 0;
      overflow: hidden;
    }

    .ticket-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .ticket-user-info {
      flex: 1;
    }

    .ticket-user-name {
      font-size: 1rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 2px 0;
    }

    .ticket-user-email {
      font-size: 0.8rem;
      color: #888;
      margin-bottom: 4px;
    }

    .ticket-user-badges {
      display: flex;
      gap: 6px;
      margin-top: 4px;
    }

    /* Ticket Details Grid */
    .ticket-details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 16px;
    }

    .ticket-detail-item {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .ticket-detail-label {
      font-size: 0.68rem;
      font-weight: 600;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .ticket-detail-value {
      font-size: 0.85rem;
      font-weight: 500;
      color: #1a1a1a;
    }

    /* Ticket Request Section */
    .ticket-request-section {
      padding-bottom: 16px;
    }

    .ticket-request-label {
      font-size: 0.68rem;
      font-weight: 600;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 6px;
    }

    .ticket-request-subject {
      font-size: 1rem;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 6px;
    }

    .ticket-request-description {
      font-size: 0.9rem;
      line-height: 1.6;
      color: #555;
      white-space: pre-wrap;
    }

    .ticket-actions {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 8px;
      padding-top: 8px;
    }

    .ticket-action-btn {
      padding: 10px 32px;
      border: none;
      border-radius: 24px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .ticket-action-btn.accept {
      background: #16a34a;
      color: white;
    }

    .ticket-action-btn.accept:hover {
      background: #15803d;
      transform: translateY(-1px);
      box-shadow: 0 3px 8px rgba(22, 163, 74, 0.25);
    }

    .ticket-action-btn.decline {
      background: #dc2626;
      color: white;
    }

    .ticket-action-btn.decline:hover {
      background: #b91c1c;
      transform: translateY(-1px);
      box-shadow: 0 3px 8px rgba(220, 38, 38, 0.25);
    }

    .ticket-action-btn.respond {
      background: #2563eb;
      color: white;
    }

    .ticket-action-btn.respond:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 3px 8px rgba(37, 99, 235, 0.25);
    }

    .ticket-action-btn.close {
      background: #6b7280;
      color: white;
    }

    .ticket-action-btn.close:hover {
      background: #4b5563;
      transform: translateY(-1px);
      box-shadow: 0 3px 8px rgba(107, 114, 128, 0.25);
    }

    /* Generic Details View Mode */
    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .details-item {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .details-item.full {
      grid-column: 1 / -1;
    }

    .details-label {
      font-size: 0.68rem;
      font-weight: 600;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .details-value {
      font-size: 0.9rem;
      color: #333;
      font-weight: 500;
    }

    .details-value.large {
      font-size: 1.05rem;
      font-weight: 600;
    }

    .details-section-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      margin-top: 8px;
      grid-column: 1 / -1;
    }

    .details-status-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      width: fit-content;
    }

    .details-status-badge.pending {
      background: #fff3cd;
      color: #856404;
    }

    .details-status-badge.ongoing,
    .details-status-badge.confirmed {
      background: #cfe2ff;
      color: #084298;
    }

    .details-status-badge.completed,
    .details-status-badge.success {
      background: #d1e7dd;
      color: #0f5132;
    }

    .details-status-badge.cancelled,
    .details-status-badge.failed {
      background: #f8d7da;
      color: #842029;
    }

    .details-status-badge.active {
      background: #d1e7dd;
      color: #0f5132;
    }

    .details-status-badge.inactive,
    .details-status-badge.archived {
      background: #e2e3e5;
      color: #41464b;
    }
  `;