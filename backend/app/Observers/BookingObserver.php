<?php

namespace App\Observers;

use App\Models\ActivityLog;
use App\Models\Booking;
use Illuminate\Support\Facades\Request;

class BookingObserver
{
    public function created(Booking $booking): void
    {
        $actor = auth()->user();
        ActivityLog::create([
            'user_id'     => $actor?->id,
            'action'      => 'created',
            'module'      => 'bookings',
            'ip_address'  => Request::ip(),
            'description' => ($actor?->name ?? 'System') . ' booked a room on ' . $booking->date,
            'new_values'  => $booking->only(['room_id', 'date', 'start_time', 'duration_hours', 'guests', 'status']),
        ]);
    }
}
