// src/configs/reservation-config.js
import { html } from 'lit';
import '/src/components/badge-component.js';
import { hashId } from '@/utility/hash-id.js';
import { getBookingUrgency } from '/src/utility/reservation-reminder.js';

export const reservationTableConfig = {
    columns: [
        {
            key: 'id',
            label: 'Booking ID',
            render: (value) => hashId('BKG', value)
        },
        {
            key: 'userId',
            label: 'Occupant'
        },
        {
            key: 'locationName',
            label: 'Location'
        },
        {
            key: 'guests',
            label: '# of Guest'
        },
        {
            key: 'status',
            label: 'Status',
            render: (value, row) => {
                const urgency = getBookingUrgency(row);
                const variant = value?.toLowerCase() === 'confirmed' || value?.toLowerCase() === 'ongoing' ? 'confirmed' :
                    value?.toLowerCase() === 'completed' ? 'completed' :
                        value?.toLowerCase() === 'pending' || value?.toLowerCase() === 'upcoming' ? 'pending' :
                            value?.toLowerCase() === 'cancelled' ? 'cancelled' : 'primary';
                return html`
                    <span style="display:inline-flex;align-items:center;gap:4px;">
                        <badge-component variant="${variant}" size="small">
                            ${value}
                        </badge-component>
                        ${urgency === 'upcoming' ? html`<badge-component variant="warning" size="small">Soon</badge-component>` : ''}
                        ${urgency === 'now' ? html`<badge-component variant="danger" size="small">Now</badge-component>` : ''}
                    </span>
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
    ],

    // Add a badge to the View action when booking is upcoming/now
    filterActions(actions, row) {
        const urgency = getBookingUrgency(row);
        if (!urgency) return actions;
        return actions.map(a => {
            if (a.key === 'view') {
                return { ...a, badge: urgency === 'now' ? '!' : '•' };
            }
            return a;
        });
    }
};
