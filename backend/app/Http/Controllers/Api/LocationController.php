<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Location::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('city')) {
            $query->where('city', $request->city);
        }

        $locations = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json($locations);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $location = Location::create($validated);

        return response()->json([
            'message' => 'Location created successfully',
            'location' => $location,
        ], 201);
    }

    public function show(Location $location): JsonResponse
    {
        return response()->json($location->load('rooms'));
    }

    public function update(Request $request, Location $location): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $location->update($validated);

        return response()->json([
            'message' => 'Location updated successfully',
            'location' => $location,
        ]);
    }

    public function destroy(Location $location): JsonResponse
    {
        $location->delete();

        return response()->json([
            'message' => 'Location deleted successfully',
        ]);
    }

    /**
     * Upload or update location image
     */
    public function uploadImage(Request $request, Location $location, CloudinaryService $cloudinaryService): JsonResponse
    {
        try {
            \Log::info('=== LOCATION IMAGE UPLOAD DEBUG START ===');
            \Log::info('Location ID: ' . $location->id);
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
            $result = $cloudinaryService->uploadLocationImage($uploadedFile, $location->id);

            if (!$result) {
                \Log::error('Cloudinary upload returned null');
                return response()->json([
                    'message' => 'Failed to upload location image to Cloudinary',
                    'error' => 'Upload service returned null. Check Laravel logs for details.',
                ], 500);
            }

            \Log::info('Cloudinary upload successful');

            // Delete old image from Cloudinary if it exists
            if ($location->image) {
                \Log::info('Location has existing image: ' . $location->image);
            }

            // Update location image
            \Log::info('Updating location image in database...');
            $location->update([
                'image' => $result['secure_url'],
            ]);
            \Log::info('Database update successful');

            \Log::info('=== LOCATION IMAGE UPLOAD DEBUG END (SUCCESS) ===');

            return response()->json([
                'message' => 'Location image uploaded successfully',
                'image_url' => $result['secure_url'],
                'location' => $location,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed:', [
                'errors' => $e->errors(),
                'message' => $e->getMessage(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            \Log::error('=== LOCATION IMAGE UPLOAD ERROR ===');
            \Log::error('Exception class: ' . get_class($e));
            \Log::error('Exception message: ' . $e->getMessage());
            \Log::error('Exception trace: ' . $e->getTraceAsString());

            return response()->json([
                'message' => 'An error occurred while uploading location image',
                'error' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : 'Enable debug mode for trace',
            ], 500);
        }
    }

    /**
     * Delete location image
     */
    public function deleteImage(Location $location): JsonResponse
    {
        if (!$location->image) {
            return response()->json([
                'message' => 'No location image to delete',
            ], 404);
        }

        // Update location image to null
        $location->update([
            'image' => null,
        ]);

        return response()->json([
            'message' => 'Location image deleted successfully',
            'location' => $location,
        ]);
    }
}
