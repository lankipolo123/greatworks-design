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
            label: 'Status'
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
        { key: 'view', label: 'View', icon: 'visibility' }
    ]
};
