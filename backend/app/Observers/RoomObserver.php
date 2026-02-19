<?php

namespace App\Observers;

use App\Models\ActivityLog;
use App\Models\Room;
use Illuminate\Support\Facades\Request;

class RoomObserver
{
    public function created(Room $room): void
    {
        $actor = auth()->user();
        ActivityLog::create([
            'user_id'     => $actor?->id,
            'action'      => 'created',
            'module'      => 'rooms',
            'ip_address'  => Request::ip(),
            'description' => ($actor?->name ?? 'System') . ' created room: ' . $room->name,
            'new_values'  => $room->only(['name', 'type', 'capacity', 'price_per_hour', 'status']),
        ]);
    }
}
