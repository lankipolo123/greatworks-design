<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Ticket::with('user');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        // Scope by role
        if ($request->user()->isAdmin()) {
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }
        } elseif ($request->user()->isModerator()) {
            // Moderators only see tickets tagged with their location
            $query->where('location_id', $request->user()->location_id);
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }
        } else {
            $query->where('user_id', $request->user()->id);
        }

        $tickets = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json($tickets);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'location_id' => 'nullable|exists:locations,id',
            'subject' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:open,pending,in_progress,closed',
            'priority' => 'sometimes|in:low,medium,high',
        ]);

        $ticket = Ticket::create($validated);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'created',
            'module' => 'tickets',
            'description' => "Created ticket #{$ticket->id}: {$ticket->subject}",
            'new_values' => ['status' => $ticket->status, 'priority' => $ticket->priority, 'subject' => $ticket->subject],
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Ticket created successfully',
            'ticket' => $ticket->load('user'),
        ], 201);
    }

    public function show(Request $request, Ticket $ticket): JsonResponse
    {
        if ($request->user()->isAdmin()) {
            // Admin can view any ticket
        } elseif ($request->user()->isModerator()) {
            if ($ticket->location_id !== $request->user()->location_id) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
        } elseif ($request->user()->id !== $ticket->user_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($ticket->load('user'));
    }

    public function update(Request $request, Ticket $ticket): JsonResponse
    {
        // Moderators can only update tickets at their location
        if ($request->user()->isModerator()) {
            if ($ticket->location_id !== $request->user()->location_id) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
        }

        $validated = $request->validate([
            'subject' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:open,pending,in_progress,closed',
            'priority' => 'sometimes|in:low,medium,high',
        ]);

        $oldValues = $ticket->only(array_keys($validated));
        $ticket->update($validated);

        // Determine the action description
        $action = 'updated';
        $description = "Updated ticket #{$ticket->id}";
        if (isset($validated['status']) && $oldValues['status'] !== $validated['status']) {
            $statusLabels = ['open' => 'Open', 'pending' => 'Pending', 'in_progress' => 'In Progress', 'closed' => 'Closed'];
            $from = $statusLabels[$oldValues['status']] ?? $oldValues['status'];
            $to = $statusLabels[$validated['status']] ?? $validated['status'];
            $action = 'status_changed';
            $description = "Changed ticket #{$ticket->id} status from {$from} to {$to}";
        }

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => $action,
            'module' => 'tickets',
            'description' => $description,
            'old_values' => $oldValues,
            'new_values' => $validated,
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Ticket updated successfully',
            'ticket' => $ticket->load('user'),
        ]);
    }

    public function destroy(Request $request, Ticket $ticket): JsonResponse
    {
        // Moderators can only delete tickets at their location
        if ($request->user()->isModerator()) {
            if ($ticket->location_id !== $request->user()->location_id) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
        }

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'deleted',
            'module' => 'tickets',
            'description' => "Deleted ticket #{$ticket->id}: {$ticket->subject}",
            'old_values' => ['status' => $ticket->status, 'priority' => $ticket->priority, 'subject' => $ticket->subject],
            'ip_address' => $request->ip(),
        ]);

        $ticket->delete();

        return response()->json([
            'message' => 'Ticket deleted successfully',
        ]);
    }
}
