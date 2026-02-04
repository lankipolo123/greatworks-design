export const ticketsTableConfig = {
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
            key: 'priority',
            label: 'Priority'
        },
        {
            key: 'createdAt',
            label: 'Date',
        }
    ],

    actions: [
        { key: 'ticketView', label: 'Look at Ticket', icon: 'visibility' },
    ]
};
