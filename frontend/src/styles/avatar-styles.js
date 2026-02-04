import { css } from 'lit';

export const userAvatarDesign = css`
:host {
      display: inline-block;
      cursor: pointer;
    }

    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: hidden;
      user-select: none;
      transition: all 0.2s ease;
      border: 2px solid transparent;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .avatar-initials {
      font-weight: 600;
      text-transform: uppercase;
      line-height: 1;
    }

    .avatar-placeholder {
      background-color: #e0e0e0;
      color: #666;
      font-size: 14px;
    }

    .avatar-icon {
      font-size: calc(var(--avatar-size) * 0.5);
      color: #666;
    }
      `;