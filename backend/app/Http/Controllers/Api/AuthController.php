<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        $user = User::create([
            'name' => trim($validated['first_name'] . ' ' . $validated['last_name']),
            'email' => $validated['email'],
            'password' => $validated['password'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'role' => 'customer',
            'status' => 'active',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'credential' => 'required|string',
            'password' => 'required|string',
        ]);

        $credential = $validated['credential'];
        $password = $validated['password'];

        // Determine if logging in with login_code (TMP-...) or email
        $user = null;
        if (str_starts_with(strtoupper($credential), 'TMP-')) {
            $user = User::where('login_code', strtoupper($credential))->first();
            if (!$user || !Hash::check($password, $user->password)) {
                throw ValidationException::withMessages([
                    'credential' => ['The provided credentials are incorrect.'],
                ]);
            }
        } else {
            if (!Auth::attempt(['email' => $credential, 'password' => $password])) {
                throw ValidationException::withMessages([
                    'credential' => ['The provided credentials are incorrect.'],
                ]);
            }
            $user = User::where('email', $credential)->first();
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'credential' => ['Your account is not active.'],
            ]);
        }

        // If 2FA is enabled, don't issue a token yet — require TOTP verification
        if ($user->two_factor_enabled) {
            $twoFactorToken = hash('sha256', $user->id . $user->two_factor_secret . config('app.key'));

            return response()->json([
                'message' => 'Two-factor authentication required',
                'two_factor_required' => true,
                'user_id' => $user->id,
                'two_factor_token' => $twoFactorToken,
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'profile_photo' => 'nullable|string',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->update([
            'password' => $validated['password'],
        ]);

        return response()->json([
            'message' => 'Password changed successfully',
        ]);
    }

    public function changeEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|string|email|max:255|unique:users,email,' . $request->user()->id,
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The password is incorrect.'],
            ]);
        }

        $user->update(['email' => $validated['email']]);

        return response()->json([
            'message' => 'Email updated successfully',
            'user' => $user,
        ]);
    }

    public function deactivateAccount(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The password is incorrect.'],
            ]);
        }

        $user->update(['status' => 'inactive']);
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Account deactivated successfully',
        ]);
    }

    public function deleteAccount(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The password is incorrect.'],
            ]);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully',
        ]);
    }
}
