// src/utility/dashboard-stats.js

/**
 * Calculate dashboard statistics from users and tickets data
 */
export class DashboardStats {

    /**
     * Get users who created account this month
     * @param {Array} users - Array of user objects with createdAt
     * @returns {number} Count of users created this month
     */
    static getMonthlyUsers(users) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return users.filter(user => {
            const createdDate = new Date(user.createdAt);
            return createdDate.getMonth() === currentMonth &&
                createdDate.getFullYear() === currentYear;
        }).length;
    }

    /**
     * Get total user count
     * @param {Array} users - Array of user objects
     * @returns {number} Total count of users
     */
    static getTotalUsers(users) {
        return users.length;
    }

    /**
     * Get total ticket count
     * @param {Array} tickets - Array of ticket objects
     * @returns {number} Total count of tickets
     */
    static getTotalTickets(tickets) {
        return tickets.length;
    }

    /**
     * Get pending tickets count
     * @param {Array} tickets - Array of ticket objects with status
     * @returns {number} Count of pending tickets
     */
    static getPendingTickets(tickets) {
        return tickets.filter(ticket => ticket.status === 'pending').length;
    }

    /**
     * Get users with active bookings (confirmed status)
     * @param {Array} reservations - Array of reservation/booking objects
     * @returns {number} Count of unique users with active bookings
     */
    static getActiveBookedUsers(reservations) {
        const uniqueUserIds = new Set(
            reservations
                .filter(r => r.status === 'confirmed')
                .map(r => r.userId)
        );
        return uniqueUserIds.size;
    }

    /**
     * Get bookings for current month
     * @param {Array} reservations - Array of reservation objects with date
     * @returns {number} Count of bookings this month
     */
    static getMonthlyBookings(reservations) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return reservations.filter(reservation => {
            const bookingDate = new Date(reservation.date);
            return bookingDate.getMonth() === currentMonth &&
                bookingDate.getFullYear() === currentYear;
        }).length;
    }

    /**
     * Get all dashboard stats at once
     * @param {Object} data - Object containing users, tickets, and reservations arrays
     * @returns {Object} Object with all computed statistics
     */
    static getAllStats(data) {
        const { users = [], tickets = [], reservations = [] } = data;

        return {
            monthlyUsers: this.getMonthlyUsers(users),
            totalUsers: this.getTotalUsers(users),
            totalTickets: this.getTotalTickets(tickets),
            pendingTickets: this.getPendingTickets(tickets),
            activeBookedUsers: this.getActiveBookedUsers(reservations),
            monthlyBookings: this.getMonthlyBookings(reservations)
        };
    }
}