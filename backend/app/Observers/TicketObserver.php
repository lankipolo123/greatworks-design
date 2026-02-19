<?php

namespace App\Observers;

use App\Models\ActivityLog;
use App\Models\Ticket;
use Illuminate\Support\Facades\Request;

class TicketObserver
{
    public function created(Ticket $ticket): void
    {
        $actor = auth()->user();
        ActivityLog::create([
            'user_id'     => $actor?->id,
            'action'      => 'created',
            'module'      => 'tickets',
            'ip_address'  => Request::ip(),
            'description' => ($actor?->name ?? 'System') . ' created ticket: ' . $ticket->subject,
            'new_values'  => $ticket->only(['subject', 'status', 'priority']),
        ]);
    }
}
