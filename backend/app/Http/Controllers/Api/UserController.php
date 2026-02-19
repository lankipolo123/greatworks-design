<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json($users);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:customer,moderator,admin',
            'location_id' => 'nullable|exists:locations,id',
            'status' => 'sometimes|in:active,inactive,archived',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['status'] = $validated['status'] ?? 'active';

        $user = User::create($validated);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
        ], 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json($user->load(['bookings', 'reservations', 'tickets', 'payments']));
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'role' => 'sometimes|in:customer,moderator,admin',
            'status' => 'sometimes|in:active,inactive,archived',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user,
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }

    /**
     * Upload or update user profile photo
     */
    public function uploadProfilePhoto(Request $request, User $user, CloudinaryService $cloudinaryService): JsonResponse
    {
        $validated = $request->validate([
            'photo' => 'required|image|mimes:jpeg,jpg,png,gif,webp|max:5120', // Max 5MB
        ]);

        $uploadedFile = $request->file('photo');

        // Upload to Cloudinary
        $result = $cloudinaryService->uploadProfilePhoto($uploadedFile, $user->id);

        if (!$result) {
            return response()->json([
                'message' => 'Failed to upload profile photo',
            ], 500);
        }

        // Delete old photo from Cloudinary if it exists
        if ($user->profile_photo) {
            // Extract public_id from the old photo URL if needed
            // $cloudinaryService->deleteImage($oldPublicId);
        }

        // Update user profile photo
        $user->update([
            'profile_photo' => $result['secure_url'],
        ]);

        return response()->json([
            'message' => 'Profile photo uploaded successfully',
            'photo_url' => $result['secure_url'],
            'user' => $user,
        ]);
    }

    /**
     * Delete user profile photo
     */
    public function deleteProfilePhoto(User $user): JsonResponse
    {
        if (!$user->profile_photo) {
            return response()->json([
                'message' => 'No profile photo to delete',
            ], 404);
        }

        // Update user profile photo to null
        $user->update([
            'profile_photo' => null,
        ]);

        return response()->json([
            'message' => 'Profile photo deleted successfully',
            'user' => $user,
        ]);
    }
}
