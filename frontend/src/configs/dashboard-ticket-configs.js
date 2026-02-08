// src/configs/dashboard-ticket-configs.js
import { html } from 'lit';
import '/src/components/badge-component.js';

export const dasboardTicketConfig = {
    columns: [
        {
            key: 'id',
            label: 'ID'
        },
        {
            key: 'userId',
            label: 'User ID'
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
            key: 'createdAt',
            label: 'Date',
            render: value => new Date(value).toLocaleDateString()
        }
    ],

    actions: [
        { key: 'ticketView', label: 'Look at Ticket', icon: 'visibility' },
    ]
};