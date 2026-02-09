// src/configs/logs-config.js
import { html } from 'lit';
import '/src/components/badge-component.js';

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
            key: 'created_at',
            label: 'Date',
            render: value => new Date(value).toLocaleString()
        }
    ],

    actions: [
        { key: 'view', label: 'View', icon: 'visibility' }
    ]
};