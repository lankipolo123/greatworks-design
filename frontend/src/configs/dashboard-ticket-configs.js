// src/configs/dashboard-ticket-configs.js
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
            label: 'Status'
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