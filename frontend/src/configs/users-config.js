export const usersTableConfig = {
    columns: [
        {
            key: 'id',
            label: 'User-ID'
        },
        {
            key: 'name',
            label: 'Name'
        },
        {
            key: 'email',
            label: 'Email'
        },
        {
            key: 'role',
            label: 'Role'
        },
        {
            key: 'status',
            label: 'Status'
        },
        {
            key: 'createdAt',
            label: 'Joined',
            render: value => new Date(value).toLocaleString()
        }
    ],

    actions: [
        { key: 'view', label: 'View', icon: 'visibility' }
    ]
};

