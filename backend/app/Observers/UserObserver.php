<?php

namespace App\Observers;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\Request;

class UserObserver
{
    public function created(User $user): void
    {
        $actor = auth()->user();
        ActivityLog::create([
            'user_id'     => $actor?->id,
            'action'      => 'created',
            'module'      => 'users',
            'ip_address'  => Request::ip(),
            'description' => ($actor?->name ?? 'System') . ' created user ' . $user->name,
            'new_values'  => $user->only(['name', 'email', 'role', 'status']),
        ]);
    }

    public function deleted(User $user): void
    {
        $actor = auth()->user();
        ActivityLog::create([
            'user_id'     => $actor?->id,
            'action'      => 'deleted',
            'module'      => 'users',
            'ip_address'  => Request::ip(),
            'description' => ($actor?->name ?? 'System') . ' deleted user ' . $user->name,
            'old_values'  => $user->only(['name', 'email', 'role', 'status']),
        ]);
    }
}
