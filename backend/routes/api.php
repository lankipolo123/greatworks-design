<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
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

// Public room listing
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{room}', [RoomController::class, 'show']);

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

    // Bookings (all authenticated users can view/create their own)
    Route::get('/bookings/calendar', [BookingController::class, 'calendar']);
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

    // Payments (view own payments)
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/payments/{payment}', [PaymentController::class, 'show']);

    /*
    |--------------------------------------------------------------------------
    | Admin & Moderator Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,moderator')->group(function () {
        // Room management
        Route::post('/rooms', [RoomController::class, 'store']);
        Route::put('/rooms/{room}', [RoomController::class, 'update']);
        Route::delete('/rooms/{room}', [RoomController::class, 'destroy']);

        // Booking management
        Route::put('/bookings/{booking}', [BookingController::class, 'update']);
        Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);

        // Reservation management
        Route::put('/reservations/{reservation}', [ReservationController::class, 'update']);
        Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);

        // Ticket management
        Route::put('/tickets/{ticket}', [TicketController::class, 'update']);
        Route::delete('/tickets/{ticket}', [TicketController::class, 'destroy']);

        // Payment management
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::put('/payments/{payment}', [PaymentController::class, 'update']);
        Route::delete('/payments/{payment}', [PaymentController::class, 'destroy']);
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Only Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin')->group(function () {
        // User management
        Route::apiResource('users', UserController::class);

        // Activity Logs
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);
        Route::get('/activity-logs/{activityLog}', [ActivityLogController::class, 'show']);
        Route::post('/activity-logs', [ActivityLogController::class, 'store']);
    });
});
