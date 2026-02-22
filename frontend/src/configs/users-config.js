// src/configs/users-config.js
import { html } from 'lit';
import '/src/components/badge-component.js';
import '/src/components/users-avatar.js';

export const usersTableConfig = {
    columns: [
        {
            key: 'id',
            label: 'User-ID'
        },
        {
            key: 'name',
            label: 'Name',
            render: (value, row) => html`
                <div style="display:flex;align-items:center;gap:8px;">
                    <user-avatar
                        size="28"
                        .src=${row.profile_photo || ''}
                        .name=${value || ''}
                        .gender=${row.gender || ''}>
                    </user-avatar>
                    <span>${value}</span>
                </div>
            `
        },
        {
            key: 'email',
            label: 'Email'
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => {
                const variant = value?.toLowerCase() === 'admin' ? 'danger' :
                    value?.toLowerCase() === 'moderator' ? 'info' :
                        value?.toLowerCase() === 'customer' ? 'technical' : 'technical';
                return html`
                    <badge-component variant="${variant}" size="small">
                        ${value}
                    </badge-component>
                `;
            }
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const variant = value?.toLowerCase() === 'active' ? 'success' :
                    value?.toLowerCase() === 'inactive' ? 'inactive' :
                        value?.toLowerCase() === 'archived' ? 'archived' :
                            value?.toLowerCase() === 'pending' ? 'pending' : 'primary';
                return html`
                    <badge-component variant="${variant}" size="small">
                        ${value}
                    </badge-component>
                `;
            }
        },
        {
            key: 'created_at',
            label: 'Joined',
            render: value => new Date(value).toLocaleString()
        }
    ],

    actions: [
        { key: 'view', label: 'View', icon: 'visibility' }
    ]
};