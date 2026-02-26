// src/configs/tickets-config.js
import { html } from 'lit';
import '/src/components/badge-component.js';
import { hashId } from '@/utility/hash-id.js';

export const ticketsTableConfig = {
    columns: [
        {
            key: 'id',
            label: 'Ticket ID',
            render: (value) => hashId('TKT', value)
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
                const status = value?.toLowerCase();

                const variant =
                    status === 'open' ? 'primary' :
                        status === 'progress' ? 'warning' :
                            status === 'completed' ? 'success' :
                                'primary';

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
        { key: 'view', label: 'View', icon: 'visibility' },
    ]
};