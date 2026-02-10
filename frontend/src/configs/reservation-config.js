// src/configs/reservation-config.js
import { html } from 'lit';
import '/src/components/badge-component.js';

export const reservationTableConfig = {
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
            key: 'guests',
            label: '# of Guest'
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const variant = value?.toLowerCase() === 'confirmed' || value?.toLowerCase() === 'ongoing' ? 'confirmed' :
                    value?.toLowerCase() === 'completed' ? 'completed' :
                        value?.toLowerCase() === 'pending' || value?.toLowerCase() === 'upcoming' ? 'pending' :
                            value?.toLowerCase() === 'cancelled' ? 'cancelled' : 'primary';
                return html`
                    <badge-component variant="${variant}" size="small">
                        ${value}
                    </badge-component>
                `;
            }
        },
        {
            key: 'date',
            label: 'Date',
            render: value => new Date(value).toLocaleString()
        },
        {
            key: 'time',
            label: 'Time',
        },
    ],

    actions: [
        { key: 'view', label: 'View', icon: 'visibility' },
        { key: 'edit', label: 'Edit', icon: 'edit' },
        { key: 'delete', label: 'Delete', icon: 'delete', danger: true }
    ]
};