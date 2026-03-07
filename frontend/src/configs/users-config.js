// src/configs/users-config.js
import { html } from 'lit';
import '/src/components/badge-component.js';
import '/src/components/users-avatar.js';
import { hashId } from '@/utility/hash-id.js';
import { isModerator } from '/src/service/api-core.js';

export const usersTableConfig = {
    columns: [
        {
            key: 'id',
            label: 'User ID',
            render: (value) => hashId('USR', value)
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
                        value?.toLowerCase() === 'temporary' ? 'warning' :
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
        { key: 'view', label: 'View', icon: 'visibility' },
        { key: 'activate', label: 'Activate', icon: 'check_circle' },
        { key: 'deactivate', label: 'Deactivate', icon: 'block' },
        { key: 'edit', label: 'Edit', icon: 'edit' },
        { key: 'delete', label: 'Remove', icon: 'delete' }
    ],

    filterActions: (actions, row) => {
        let filtered = actions;
        // Only show edit for temporary users
        if (row.role !== 'temporary') {
            filtered = filtered.filter(a => a.key !== 'edit');
        }
        // Show activate only for temporary users that are not active
        if (row.role !== 'temporary' || row.status === 'active') {
            filtered = filtered.filter(a => a.key !== 'activate');
        }
        // Show deactivate only for temporary users that are active
        if (row.role !== 'temporary' || row.status !== 'active') {
            filtered = filtered.filter(a => a.key !== 'deactivate');
        }
        // Moderators cannot delete admin users
        if (isModerator() && row.role === 'admin') {
            filtered = filtered.filter(a => a.key !== 'delete');
        }
        return filtered;
    }
};