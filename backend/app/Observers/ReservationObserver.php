<?php

namespace App\Observers;

use App\Models\ActivityLog;
use App\Models\Reservation;
use Illuminate\Support\Facades\Request;

class ReservationObserver
{
    public function created(Reservation $reservation): void
    {
        $actor = auth()->user();
        ActivityLog::create([
            'user_id'     => $actor?->id,
            'action'      => 'created',
            'module'      => 'reservations',
            'ip_address'  => Request::ip(),
            'description' => ($actor?->name ?? 'System') . ' booked a room on ' . $reservation->date,
            'new_values'  => $reservation->only(['room_id', 'date', 'time', 'guests', 'status']),
        ]);
    }
}
