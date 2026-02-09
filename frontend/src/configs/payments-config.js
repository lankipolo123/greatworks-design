// src/configs/payments-config.js
import { html } from 'lit';
import '/src/components/badge-component.js';

export const paymentsTableConfig = {
    columns: [
        {
            key: 'id',
            label: 'PAY-ID'
        },
        {
            key: 'user',
            label: 'User',
            render: (value) => value?.name || '—'
        },
        {
            key: 'amount',
            label: 'Price'
        },
        {
            key: 'currency',
            label: 'Currency'
        },
        {
            key: 'method',
            label: 'Method',
            render: (value) => html`
                <badge-component variant="info" size="small">
                    ${value}
                </badge-component>
            `
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const variant = value?.toLowerCase() === 'completed' || value?.toLowerCase() === 'paid' || value?.toLowerCase() === 'success' ? 'success' :
                    value?.toLowerCase() === 'pending' ? 'pending' :
                        value?.toLowerCase() === 'failed' ? 'failed' :
                            value?.toLowerCase() === 'cancelled' ? 'cancelled' : 'primary';
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
            render: value => new Date(value).toLocaleString()
        }
    ],

    actions: [
        { key: 'view', label: 'View', icon: 'visibility' }
    ]
};