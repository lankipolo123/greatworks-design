// src/configs/users-config.js
import { html } from 'lit';
import '/src/components/badge-component.js';

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
            label: 'Role',
            render: (value) => {
                const variant = value?.toLowerCase() === 'admin' ? 'primary' :
                    value?.toLowerCase() === 'manager' ? 'info' :
                        value?.toLowerCase() === 'user' ? 'secondary' : 'primary';
                return html`
                    <badge-component variant="${variant}" size="small">
                        ${value}
                    </badge-component>
                `;
            }
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const variant = value?.toLowerCase() === 'active' ? 'active' :
                    value?.toLowerCase() === 'inactive' ? 'inactive' :
                        value?.toLowerCase() === 'archived' ? 'archived' :
                            value?.toLowerCase() === 'pending' ? 'pending' : 'primary';
                return html`
                    <badge-component variant="${variant}" size="small">
                        ${value}
                    </badge-component>
                `;
            }
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