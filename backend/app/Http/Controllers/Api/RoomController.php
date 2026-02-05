<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Room::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('min_capacity')) {
            $query->where('capacity', '>=', $request->min_capacity);
        }

        $rooms = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json($rooms);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:conference,meeting,private_office,hot_desk,event_space',
            'capacity' => 'required|integer|min:1',
            'price_per_hour' => 'required|numeric|min:0',
            'floor' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'amenities' => 'nullable|array',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:available,unavailable,maintenance',
        ]);

        $room = Room::create($validated);

        return response()->json([
            'message' => 'Room created successfully',
            'room' => $room,
        ], 201);
    }

    public function show(Room $room): JsonResponse
    {
        return response()->json($room->load(['bookings', 'reservations']));
    }

    public function update(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:conference,meeting,private_office,hot_desk,event_space',
            'capacity' => 'sometimes|integer|min:1',
            'price_per_hour' => 'sometimes|numeric|min:0',
            'floor' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'amenities' => 'nullable|array',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:available,unavailable,maintenance',
        ]);

        $room->update($validated);

        return response()->json([
            'message' => 'Room updated successfully',
            'room' => $room,
        ]);
    }

    public function destroy(Room $room): JsonResponse
    {
        $room->delete();

        return response()->json([
            'message' => 'Room deleted successfully',
        ]);
    }
}
