// src/configs/tickets-config.js
import { html } from 'lit';
import '/src/components/badge-component.js';

export const ticketsTableConfig = {
    columns: [
        {
            key: 'id',
            label: 'ID'
        },
        {
            key: 'user',
            label: 'User',
            render: (value) => value?.name || '—'
        },
        {
            key: 'subject',
            label: 'Concern'
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const variant = value?.toLowerCase() === 'pending' ? 'pending' :
                    value?.toLowerCase() === 'ongoing' ? 'ongoing' :
                        value?.toLowerCase() === 'completed' || value?.toLowerCase() === 'closed' ? 'completed' :
                            value?.toLowerCase() === 'cancelled' ? 'cancelled' : 'primary';
                return html`
                    <badge-component variant="${variant}" size="small">
                        ${value}
                    </badge-component>
                `;
            }
        },
        {
            key: 'priority',
            label: 'Priority',
            render: (value) => {
                const variant = value?.toLowerCase() === 'low' ? 'low' :
                    value?.toLowerCase() === 'medium' ? 'medium' :
                        value?.toLowerCase() === 'high' ? 'high' :
                            value?.toLowerCase() === 'critical' || value?.toLowerCase() === 'urgent' ? 'critical' : 'medium';
                return html`
                    <badge-component variant="${variant}" size="small">
                        ${value}
                    </badge-component>
                `;
            }
        },
        {
            key: 'created_at',
            label: 'Date',
        }
    ],

    actions: [
        { key: 'view', label: 'View', icon: 'visibility' },
    ]
};