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
            'description' => ($actor?->name ?? 'System') . ' submitted ticket: ' . $ticket->subject,
            'new_values'  => $ticket->only(['subject', 'status', 'priority']),
        ]);
    }

    public function updated(Ticket $ticket): void
    {
        $actor = auth()->user();
        if (!$actor || $actor->isCustomer()) return;

        ActivityLog::create([
            'user_id'     => $actor?->id,
            'action'      => 'updated',
            'module'      => 'tickets',
            'ip_address'  => Request::ip(),
            'description' => ($actor->name) . ' updated ticket: ' . $ticket->subject,
            'old_values'  => $ticket->getOriginal(),
            'new_values'  => $ticket->only(['subject', 'status', 'priority']),
        ]);
    }
}
