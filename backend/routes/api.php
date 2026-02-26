<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TwoFactorController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (No Authentication Required)
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 2FA verification during login (public — user not yet authenticated)
Route::post('/2fa/verify', [TwoFactorController::class, 'verify']);

// Public room listing
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{room}', [RoomController::class, 'show']);

// Public location listing
Route::get('/locations', [LocationController::class, 'index']);
Route::get('/locations/{location}', [LocationController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Authentication Required - All Roles)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Auth routes (all authenticated users)
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);
    Route::put('/change-email', [AuthController::class, 'changeEmail']);
    Route::post('/deactivate-account', [AuthController::class, 'deactivateAccount']);
    Route::post('/delete-account', [AuthController::class, 'deleteAccount']);

    // Two-factor authentication management
    Route::post('/2fa/setup', [TwoFactorController::class, 'setup']);
    Route::post('/2fa/verify-setup', [TwoFactorController::class, 'verifySetup']);
    Route::post('/2fa/disable', [TwoFactorController::class, 'disable']);
    Route::get('/2fa/status', [TwoFactorController::class, 'status']);
    Route::post('/2fa/backup-codes', [TwoFactorController::class, 'regenerateBackupCodes']);

    // Profile photo management (all authenticated users can manage their own)
    Route::post('/users/{user}/profile-photo', [UserController::class, 'uploadProfilePhoto']);
    Route::delete('/users/{user}/profile-photo', [UserController::class, 'deleteProfilePhoto']);

    // Bookings (all authenticated users can view/create their own)
    Route::get('/bookings/calendar', [BookingController::class, 'calendar']);
    Route::get('/bookings/availability', [BookingController::class, 'availability']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);

    // Reservations (all authenticated users can view/create their own)
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);

    // Tickets (all authenticated users can create/view their own)
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::get('/tickets/{ticket}', [TicketController::class, 'show']);

    // Payments (view own payments, create for own bookings)
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/payments/{payment}', [PaymentController::class, 'show']);

    /*
    |--------------------------------------------------------------------------
    | Admin & Moderator Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,moderator')->group(function () {
        // Location management (update only — creation & deletion are admin-only)
        Route::put('/locations/{location}', [LocationController::class, 'update']);

        // Location image management
        Route::post('/locations/{location}/image', [LocationController::class, 'uploadImage']);
        Route::delete('/locations/{location}/image', [LocationController::class, 'deleteImage']);

        // Room management (update only — creation & deletion are admin-only)
        Route::put('/rooms/{room}', [RoomController::class, 'update']);

        // Room image management
        Route::post('/rooms/{room}/image', [RoomController::class, 'uploadImage']);
        Route::delete('/rooms/{room}/image', [RoomController::class, 'deleteImage']);

        // Booking management
        Route::put('/bookings/{booking}', [BookingController::class, 'update']);
        Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);

        // Reservation management
        Route::put('/reservations/{reservation}', [ReservationController::class, 'update']);
        Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);

        // Ticket management
        Route::put('/tickets/{ticket}', [TicketController::class, 'update']);
        Route::delete('/tickets/{ticket}', [TicketController::class, 'destroy']);

        // Payment management (read/update only — creation & deletion are admin-only)
        Route::put('/payments/{payment}', [PaymentController::class, 'update']);

        // User management (admin & moderator)
        Route::apiResource('users', UserController::class)->except(['update']);
        Route::put('/users/{user}', [UserController::class, 'update'])
            ->middleware('prevent-admin-role');
        Route::post('/users/{user}/send-welcome', [UserController::class, 'sendWelcomeEmail']);

        // Activity Logs (read-only for moderators)
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);
        Route::get('/activity-logs/{activityLog}', [ActivityLogController::class, 'show']);
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Only Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin')->group(function () {
        // Location creation & deletion (admin only)
        Route::post('/locations', [LocationController::class, 'store']);
        Route::delete('/locations/{location}', [LocationController::class, 'destroy']);

        // Room creation & deletion (admin only)
        Route::post('/rooms', [RoomController::class, 'store']);
        Route::delete('/rooms/{room}', [RoomController::class, 'destroy']);

        // Payment deletion (admin only)
        Route::delete('/payments/{payment}', [PaymentController::class, 'destroy']);

        // Activity log creation (admin only — prevents audit trail manipulation)
        Route::post('/activity-logs', [ActivityLogController::class, 'store']);
    });
});
