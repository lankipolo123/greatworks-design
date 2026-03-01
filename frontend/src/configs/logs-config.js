// src/configs/logs-config.js
import { html } from 'lit';
import '/src/components/badge-component.js';

const actionVariants = {
    created: 'success',
    status_changed: 'ongoing',
    updated: 'info',
    deleted: 'danger',
    role_changed: 'warning',
    logged_in: 'technical',
    registered: 'success',
    password_changed: 'pending',
    deactivated: 'danger',
};

const actionLabels = {
    created: 'Created',
    status_changed: 'Status Changed',
    updated: 'Updated',
    deleted: 'Deleted',
    role_changed: 'Role Changed',
    logged_in: 'Logged In',
    registered: 'Registered',
    password_changed: 'Password Changed',
    deactivated: 'Deactivated',
};

export const logsTableConfig = {
    columns: [
        {
            key: 'user',
            label: 'User',
            render: (value) => value?.name || '—'
        },
        {
            key: 'action',
            label: 'Action',
            render: (value) => html`
                <badge-component variant="${actionVariants[value] || 'primary'}" size="small">
                    ${actionLabels[value] || value?.replace(/_/g, ' ') || '—'}
                </badge-component>
            `
        },
        {
            key: 'module',
            label: 'Module',
            render: (value) => html`
                <badge-component variant="primary" size="small">
                    ${value}
                </badge-component>
            `
        },
        {
            key: 'description',
            label: 'Details',
            render: (value) => value || '—'
        },
        {
            key: 'created_at',
            label: 'Date',
            render: value => new Date(value).toLocaleString()
        }
    ],

    actions: [
        { key: 'view', label: 'View', icon: 'visibility' }
    ]
};
