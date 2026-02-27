// src/configs/fab-options-config.js
import { html } from 'lit';

// Icons for FAB options
const fabIcons = {
    booking: html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M21 10h-6l-2-3-2 3H3v11h18V10z"/><path d="M12 21V13"/></svg>`,
    room: html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>`,
    user: html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="7" r="4"/><path d="M5.5 21c0-3 5-5 6.5-5s6.5 2 6.5 5"/></svg>`,
    reservation: html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    location: html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
};

// Booking page FAB options
export const bookingFabOptions = [
    {
        label: 'Book Someone',
        action: 'book-someone',
        icon: fabIcons.booking
    },
    {
        label: 'Create New Room',
        action: 'create-room',
        icon: fabIcons.room
    },
    {
        label: 'New Location',
        action: 'create-location',
        icon: fabIcons.location
    }
];

// User page FAB options
export const userFabOptions = [
    {
        label: 'Add New User',
        action: 'add-user',
        icon: fabIcons.user
    }
];

// Payment page FAB options
export const paymentFabOptions = [
    {
        label: 'New Payment',
        action: 'new-payment',
        icon: html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`
    }
];

// Reservation page FAB options
export const reservationFabOptions = [
    {
        label: 'New Reservation',
        action: 'new-reservation',
        icon: fabIcons.reservation
    }
];