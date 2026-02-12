<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
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

        if ($request->has('room_id')) {
            $query->where('room_id', $request->room_id);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $bookings = $query->orderBy('date', 'desc')
            ->orderBy('start_time', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json($bookings);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'room_id' => 'required|exists:rooms,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'duration_hours' => 'required|integer|min:1|max:12',
            'guests' => 'required|integer|min:1',
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
            'notes' => 'nullable|string',
        ]);

        // Default user_id to authenticated user if not provided
        if (!isset($validated['user_id'])) {
            $validated['user_id'] = $request->user()->id;
        }

        // Slot availability check
        $room = Room::findOrFail($validated['room_id']);
        $slotCheck = $this->checkSlotAvailability(
            $room,
            $validated['date'],
            $validated['start_time'],
            (int) $validated['duration_hours'],
            (int) $validated['guests']
        );

        if (!$slotCheck['available']) {
            return response()->json([
                'message' => 'Not enough slots available for this room at the requested time.',
                'total_slots' => $slotCheck['total_slots'],
                'booked_slots' => $slotCheck['booked_slots'],
                'available_slots' => $slotCheck['available_slots'],
                'requested_slots' => $validated['guests'],
            ], 422);
        }

        $booking = Booking::create($validated);

        return response()->json([
            'message' => 'Booking created successfully',
            'booking' => $booking->load(['user', 'room']),
        ], 201);
    }

    public function show(Booking $booking): JsonResponse
    {
        return response()->json($booking->load(['user', 'room', 'payment']));
    }

    public function update(Request $request, Booking $booking): JsonResponse
    {
        $validated = $request->validate([
            'room_id' => 'sometimes|exists:rooms,id',
            'date' => 'sometimes|date',
            'start_time' => 'sometimes|date_format:H:i',
            'duration_hours' => 'sometimes|integer|min:1|max:12',
            'guests' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
            'notes' => 'nullable|string',
        ]);

        // Only run slot check if time/room/guest related fields are being changed
        $needsSlotCheck = isset($validated['room_id'])
            || isset($validated['date'])
            || isset($validated['start_time'])
            || isset($validated['duration_hours'])
            || isset($validated['guests']);

        if ($needsSlotCheck) {
            $roomId = $validated['room_id'] ?? $booking->room_id;
            $date = $validated['date'] ?? $booking->date;
            $startTime = $validated['start_time'] ?? $booking->start_time;
            $durationHours = (int) ($validated['duration_hours'] ?? $booking->duration_hours);
            $guests = (int) ($validated['guests'] ?? $booking->guests);

            // Format start_time if it's a Carbon instance
            if ($startTime instanceof \DateTimeInterface) {
                $startTime = $startTime->format('H:i');
            }

            // Format date if it's a Carbon instance
            if ($date instanceof \DateTimeInterface) {
                $date = $date->format('Y-m-d');
            }

            $room = Room::findOrFail($roomId);
            $slotCheck = $this->checkSlotAvailability(
                $room,
                $date,
                $startTime,
                $durationHours,
                $guests,
                $booking->id // exclude current booking from overlap count
            );

            if (!$slotCheck['available']) {
                return response()->json([
                    'message' => 'Not enough slots available for this room at the requested time.',
                    'total_slots' => $slotCheck['total_slots'],
                    'booked_slots' => $slotCheck['booked_slots'],
                    'available_slots' => $slotCheck['available_slots'],
                    'requested_slots' => $guests,
                ], 422);
            }
        }

        $booking->update($validated);

        return response()->json([
            'message' => 'Booking updated successfully',
            'booking' => $booking->load(['user', 'room']),
        ]);
    }

    public function destroy(Booking $booking): JsonResponse
    {
        $booking->delete();

        return response()->json([
            'message' => 'Booking deleted successfully',
        ]);
    }

    public function calendar(Request $request): JsonResponse
    {
        $query = Booking::with(['user', 'room']);

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        if ($request->has('room_id')) {
            $query->where('room_id', $request->room_id);
        }

        $bookings = $query->get();

        return response()->json($bookings);
    }

    /**
     * Check slot availability for a room at a given date/time.
     */
    public function availability(Request $request): JsonResponse
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'duration_hours' => 'required|integer|min:1|max:12',
        ]);

        $room = Room::findOrFail($request->room_id);
        $result = $this->checkSlotAvailability(
            $room,
            $request->date,
            $request->start_time,
            (int) $request->duration_hours,
            0 // no guests to check, just return availability info
        );

        return response()->json([
            'room_id' => $room->id,
            'room_name' => $room->name,
            'date' => $request->date,
            'start_time' => $request->start_time,
            'duration_hours' => (int) $request->duration_hours,
            'total_slots' => $result['total_slots'],
            'booked_slots' => $result['booked_slots'],
            'available_slots' => $result['available_slots'],
        ]);
    }

    /**
     * Calculate slot availability by checking overlapping bookings.
     *
     * A booking occupies slots from start_time to start_time + duration_hours.
     * Two bookings overlap if their time ranges intersect on the same room and date.
     * The room's capacity is the total number of guest slots available per time window.
     */
    private function checkSlotAvailability(
        Room $room,
        string $date,
        string $startTime,
        int $durationHours,
        int $requestedGuests,
        ?int $excludeBookingId = null
    ): array {
        $requestedStart = strtotime($startTime);
        $requestedEnd = $requestedStart + ($durationHours * 3600);

        // Find all active bookings for the same room on the same date
        $query = Booking::where('room_id', $room->id)
            ->whereDate('date', $date)
            ->whereIn('status', ['pending', 'confirmed']);

        if ($excludeBookingId) {
            $query->where('id', '!=', $excludeBookingId);
        }

        $existingBookings = $query->get();

        // Calculate the max overlapping guests at any point in the requested window
        // We check each existing booking for time overlap and sum up the guests
        $maxOverlappingGuests = 0;

        // Collect all overlapping bookings' guest counts
        $overlappingGuests = 0;
        foreach ($existingBookings as $existing) {
            $existingStart = strtotime(
                $existing->start_time instanceof \DateTimeInterface
                    ? $existing->start_time->format('H:i')
                    : $existing->start_time
            );
            $existingEnd = $existingStart + ($existing->duration_hours * 3600);

            // Check if time ranges overlap: starts before the other ends AND ends after the other starts
            if ($requestedStart < $existingEnd && $requestedEnd > $existingStart) {
                $overlappingGuests += $existing->guests;
            }
        }

        $maxOverlappingGuests = $overlappingGuests;
        $totalSlots = $room->capacity;
        $availableSlots = max(0, $totalSlots - $maxOverlappingGuests);

        return [
            'available' => $requestedGuests <= $availableSlots,
            'total_slots' => $totalSlots,
            'booked_slots' => $maxOverlappingGuests,
            'available_slots' => $availableSlots,
        ];
    }
}
