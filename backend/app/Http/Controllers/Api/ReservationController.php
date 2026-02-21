<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Booking::with(['user', 'room']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        // Scope by role
        if ($request->user()->isAdmin()) {
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }
        } elseif ($request->user()->isModerator()) {
            // Moderators only see reservations for rooms at their location
            $query->whereHas('room', function ($q) use ($request) {
                $q->where('location_id', $request->user()->location_id);
            });
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }
        } else {
            $query->where('user_id', $request->user()->id);
        }

        $reservations = $query->orderBy('date', 'desc')
            ->orderBy('start_time', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json($reservations);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'room_id' => 'required|exists:rooms,id',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'guests' => 'required|integer|min:1',
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
            'notes' => 'nullable|string',
        ]);

        $validated['start_time'] = $validated['time'];
        unset($validated['time']);
        $validated['duration_hours'] = 1;

        $booking = Booking::create($validated);

        return response()->json([
            'message' => 'Reservation created successfully',
            'reservation' => $booking->load(['user', 'room']),
        ], 201);
    }

    public function show(Request $request, Booking $reservation): JsonResponse
    {
        if ($request->user()->isAdmin()) {
            // Admin can view any reservation
        } elseif ($request->user()->isModerator()) {
            $reservation->load('room');
            if ($reservation->room->location_id !== $request->user()->location_id) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
        } elseif ($request->user()->id !== $reservation->user_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($reservation->load(['user', 'room']));
    }

    public function update(Request $request, Booking $reservation): JsonResponse
    {
        // Moderators can only update reservations at their location
        if ($request->user()->isModerator()) {
            $reservation->load('room');
            if ($reservation->room->location_id !== $request->user()->location_id) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
        }

        $validated = $request->validate([
            'room_id' => 'sometimes|exists:rooms,id',
            'date' => 'sometimes|date',
            'time' => 'sometimes|date_format:H:i',
            'guests' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
            'notes' => 'nullable|string',
        ]);

        if (isset($validated['time'])) {
            $validated['start_time'] = $validated['time'];
            unset($validated['time']);
        }

        $reservation->update($validated);

        return response()->json([
            'message' => 'Reservation updated successfully',
            'reservation' => $reservation->load(['user', 'room']),
        ]);
    }

    public function destroy(Request $request, Booking $reservation): JsonResponse
    {
        // Moderators can only delete reservations at their location
        if ($request->user()->isModerator()) {
            $reservation->load('room');
            if ($reservation->room->location_id !== $request->user()->location_id) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
        }

        $reservation->delete();

        return response()->json([
            'message' => 'Reservation deleted successfully',
        ]);
    }
}
