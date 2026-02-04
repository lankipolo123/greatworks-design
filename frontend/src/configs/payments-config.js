export const paymentsTableConfig = {
    columns: [
        {
            key: 'id',
            label: 'PAY-ID'
        },
        {
            key: 'userId',
            label: 'UserID'
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
            label: 'Method'
        },
        {
            key: ' status',
            label: 'Status'
        },
        {
            key: 'createdAt',
            label: 'Date',
            render: value => new Date(value).toLocaleString()
        }
    ],

    actions: [
        { key: 'view', label: 'View', icon: 'visibility' }
    ]
};
