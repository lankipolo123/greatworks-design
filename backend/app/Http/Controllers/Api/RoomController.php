<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Room::with('locationRelation');

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

        if ($request->has('location_id')) {
            $query->where('location_id', $request->location_id);
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
            'location_id' => 'nullable|exists:locations,id',
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
            'location_id' => 'nullable|exists:locations,id',
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

    /**
     * Upload or update room image
     */
    public function uploadImage(Request $request, Room $room, CloudinaryService $cloudinaryService): JsonResponse
    {
        try {
            \Log::info('=== ROOM IMAGE UPLOAD DEBUG START ===');
            \Log::info('Room ID: ' . $room->id);
            \Log::info('Request has file: ' . ($request->hasFile('image') ? 'YES' : 'NO'));

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                \Log::info('File details:', [
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'error' => $file->getError(),
                ]);
            }

            $validated = $request->validate([
                'image' => 'required|image|mimes:jpeg,jpg,png,gif,webp,avif|max:10240', // Max 10MB
            ]);
            \Log::info('Validation passed');

            $uploadedFile = $request->file('image');

            // Upload to Cloudinary
            \Log::info('Attempting Cloudinary upload...');
            $result = $cloudinaryService->uploadRoomImage($uploadedFile, $room->id);

            if (!$result) {
                \Log::error('Cloudinary upload returned null');
                return response()->json([
                    'message' => 'Failed to upload room image to Cloudinary',
                    'error' => 'Upload service returned null. Check Laravel logs for details.',
                ], 500);
            }

            \Log::info('Cloudinary upload successful');

            // Delete old image from Cloudinary if it exists
            if ($room->image) {
                \Log::info('Room has existing image: ' . $room->image);
            }

            // Update room image
            \Log::info('Updating room image in database...');
            $room->update([
                'image' => $result['secure_url'],
            ]);
            \Log::info('Database update successful');

            \Log::info('=== ROOM IMAGE UPLOAD DEBUG END (SUCCESS) ===');

            return response()->json([
                'message' => 'Room image uploaded successfully',
                'image_url' => $result['secure_url'],
                'room' => $room,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed:', [
                'errors' => $e->errors(),
                'message' => $e->getMessage(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            \Log::error('=== ROOM IMAGE UPLOAD ERROR ===');
            \Log::error('Exception class: ' . get_class($e));
            \Log::error('Exception message: ' . $e->getMessage());
            \Log::error('Exception trace: ' . $e->getTraceAsString());

            return response()->json([
                'message' => 'An error occurred while uploading room image',
                'error' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : 'Enable debug mode for trace',
            ], 500);
        }
    }

    /**
     * Delete room image
     */
    public function deleteImage(Room $room): JsonResponse
    {
        if (!$room->image) {
            return response()->json([
                'message' => 'No room image to delete',
            ], 404);
        }

        // Update room image to null
        $room->update([
            'image' => null,
        ]);

        return response()->json([
            'message' => 'Room image deleted successfully',
            'room' => $room,
        ]);
    }
}
