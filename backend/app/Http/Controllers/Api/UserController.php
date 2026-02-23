<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeMail;
use App\Models\User;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::withCount('bookings');

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
            'password' => 'nullable|string|min:8',
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:customer,moderator,admin,temporary',
            'location_id' => 'nullable|exists:locations,id',
            'status' => 'sometimes|in:active,inactive,archived',
        ]);

        // Moderators can only create moderator, customer, and temporary users
        if ($request->user()->isModerator() && $validated['role'] === 'admin') {
            return response()->json([
                'message' => 'Moderators cannot create admin users.',
            ], 403);
        }

        // Auto-generate password for all roles if not provided
        $generatedPassword = null;
        if (empty($validated['password'])) {
            $generatedPassword = Str::random(16);
            $validated['password'] = $generatedPassword;
        }

        $validated['status'] = $validated['status'] ?? 'active';

        $user = User::create($validated);

        $response = [
            'message' => 'User created successfully',
            'user' => $user,
        ];

        if ($generatedPassword) {
            $response['generated_password'] = $generatedPassword;
        }

        return response()->json($response, 201);
    }

    public function sendWelcomeEmail(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'password' => 'required|string',
        ]);

        Mail::to($user->email)->send(new WelcomeMail($user, $validated['password']));

        return response()->json([
            'message' => 'Welcome email sent successfully',
        ]);
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
            'role' => 'sometimes|in:customer,moderator,admin,temporary',
            'status' => 'sometimes|in:active,inactive,archived',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user,
        ]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $currentUser = $request->user();

        // Prevent deleting yourself
        if ($currentUser->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account from here.',
            ], 403);
        }

        // Moderators can only delete customers and temporary accounts
        if ($currentUser->isModerator() && !in_array($user->role, ['customer', 'temporary'])) {
            return response()->json([
                'message' => 'Moderators can only remove customer and temporary accounts.',
            ], 403);
        }

        $user->tokens()->delete();
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
        if ($request->user()->id !== $user->id && !$request->user()->hasRole(['admin', 'moderator'])) {
            return response()->json(['message' => 'You can only manage your own profile photo.'], 403);
        }

        try {
            \Log::info('=== PROFILE PHOTO UPLOAD DEBUG START ===');
            \Log::info('User ID: ' . $user->id);
            \Log::info('Request has file: ' . ($request->hasFile('photo') ? 'YES' : 'NO'));

            if ($request->hasFile('photo')) {
                $file = $request->file('photo');
                \Log::info('File details:', [
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'error' => $file->getError(),
                ]);
            }

            $validated = $request->validate([
                'photo' => 'required|image|mimes:jpeg,jpg,png,gif,webp,avif|max:5120', // Max 5MB
            ]);
            \Log::info('Validation passed');

            $uploadedFile = $request->file('photo');

            // Upload to Cloudinary
            \Log::info('Attempting Cloudinary upload...');
            $result = $cloudinaryService->uploadProfilePhoto($uploadedFile, $user->id);

            if (!$result) {
                \Log::error('Cloudinary upload returned null');
                return response()->json([
                    'message' => 'Failed to upload profile photo to Cloudinary',
                    'error' => 'Upload service returned null. Check Laravel logs for details.',
                ], 500);
            }

            \Log::info('Cloudinary upload successful:', $result);

            // Delete old photo from Cloudinary if it exists
            if ($user->profile_photo) {
                \Log::info('User has existing profile photo: ' . $user->profile_photo);
                // Extract public_id from the old photo URL if needed
                // $cloudinaryService->deleteImage($oldPublicId);
            }

            // Update user profile photo
            \Log::info('Updating user profile_photo in database...');
            $user->update([
                'profile_photo' => $result['secure_url'],
            ]);
            \Log::info('Database update successful');

            \Log::info('=== PROFILE PHOTO UPLOAD DEBUG END (SUCCESS) ===');

            return response()->json([
                'message' => 'Profile photo uploaded successfully',
                'photo_url' => $result['secure_url'],
                'user' => $user,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed:', [
                'errors' => $e->errors(),
                'message' => $e->getMessage(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            \Log::error('=== PROFILE PHOTO UPLOAD ERROR ===');
            \Log::error('Exception class: ' . get_class($e));
            \Log::error('Exception message: ' . $e->getMessage());
            \Log::error('Exception trace: ' . $e->getTraceAsString());

            return response()->json([
                'message' => 'An error occurred while uploading profile photo',
                'error' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : 'Enable debug mode for trace',
            ], 500);
        }
    }

    /**
     * Delete user profile photo
     */
    public function deleteProfilePhoto(Request $request, User $user): JsonResponse
    {
        if ($request->user()->id !== $user->id && !$request->user()->hasRole(['admin', 'moderator'])) {
            return response()->json(['message' => 'You can only manage your own profile photo.'], 403);
        }

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
