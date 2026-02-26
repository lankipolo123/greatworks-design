// src/configs/booking-config.js
import { html } from 'lit';
import '/src/components/badge-component.js';
import { hashId } from '@/utility/hash-id.js';

export const bookingTableConfig = {
    columns: [
        {
            key: 'id',
            label: 'Booking ID',
            render: (value) => hashId('BKG', value)
        },
        {
            key: 'userId',
            label: 'User'
        },
        {
            key: 'roomName',
            label: 'Room'
        },
        {
            key: 'date',
            label: 'Date',
            render: value => value ? new Date(value).toLocaleDateString() : '-'
        },
        {
            key: 'startTime',
            label: 'Time',
        },
        {
            key: 'durationHours',
            label: 'Duration',
            render: value => `${value}h`
        },
        {
            key: 'guests',
            label: 'Guests'
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const variant = value?.toLowerCase() === 'confirmed' ? 'confirmed' :
                    value?.toLowerCase() === 'completed' ? 'completed' :
                        value?.toLowerCase() === 'pending' ? 'pending' :
                            value?.toLowerCase() === 'cancelled' ? 'cancelled' : 'primary';
                return html`
                    <badge-component variant="${variant}" size="small">
                        ${value}
                    </badge-component>
                `;
            }
        },
    ],

    actions: [
        { key: 'view', label: 'View', icon: 'visibility' },
        { key: 'edit', label: 'Edit', icon: 'edit' },
        { key: 'delete', label: 'Delete', icon: 'delete', danger: true }
    ]
};
