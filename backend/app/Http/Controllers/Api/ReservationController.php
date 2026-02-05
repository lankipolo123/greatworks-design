<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Reservation::with(['user', 'room']);

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

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $reservations = $query->orderBy('date', 'desc')
            ->orderBy('time', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json($reservations);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'room_id' => 'nullable|exists:rooms,id',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'guests' => 'required|integer|min:1',
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
            'notes' => 'nullable|string',
        ]);

        $reservation = Reservation::create($validated);

        return response()->json([
            'message' => 'Reservation created successfully',
            'reservation' => $reservation->load(['user', 'room']),
        ], 201);
    }

    public function show(Reservation $reservation): JsonResponse
    {
        return response()->json($reservation->load(['user', 'room']));
    }

    public function update(Request $request, Reservation $reservation): JsonResponse
    {
        $validated = $request->validate([
            'room_id' => 'nullable|exists:rooms,id',
            'date' => 'sometimes|date',
            'time' => 'sometimes|date_format:H:i',
            'guests' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
            'notes' => 'nullable|string',
        ]);

        $reservation->update($validated);

        return response()->json([
            'message' => 'Reservation updated successfully',
            'reservation' => $reservation->load(['user', 'room']),
        ]);
    }

    public function destroy(Reservation $reservation): JsonResponse
    {
        $reservation->delete();

        return response()->json([
            'message' => 'Reservation deleted successfully',
        ]);
    }
}
