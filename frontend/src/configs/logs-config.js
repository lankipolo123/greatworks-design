export const logsTableConfig = {
    columns: [
        {
            key: 'id',
            label: 'User'
        },
        {
            key: 'action',
            label: 'Action'
        },
        {
            key: 'module',
            label: 'Module'
        },
        {
            key: 'date',
            label: 'Date',
            render: value => new Date(value).toLocaleString()
        }
    ],

    actions: [
        { key: 'view', label: 'View', icon: 'visibility' }
    ]
};
