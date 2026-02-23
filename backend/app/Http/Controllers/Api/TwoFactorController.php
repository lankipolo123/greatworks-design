<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use PragmaRX\Google2FA\Google2FA;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class TwoFactorController extends Controller
{
    private Google2FA $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    /**
     * Generate a new TOTP secret and return it with an otpauth URI
     * for the user to scan with their authenticator app.
     */
    public function setup(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->two_factor_enabled) {
            return response()->json([
                'message' => 'Two-factor authentication is already enabled.',
            ], 422);
        }

        $secret = $this->google2fa->generateSecretKey();

        // Store secret temporarily (not enabled yet)
        $user->update(['two_factor_secret' => encrypt($secret)]);

        $otpauthUrl = $this->google2fa->getQRCodeUrl(
            'GreatWorks',
            $user->email,
            $secret
        );

        // Generate QR code as SVG data URL
        $renderer = new ImageRenderer(
            new RendererStyle(200),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $svg = $writer->writeString($otpauthUrl);
        $qrCodeDataUrl = 'data:image/svg+xml;base64,' . base64_encode($svg);

        return response()->json([
            'secret' => $secret,
            'otpauth_url' => $otpauthUrl,
            'qr_code_data_url' => $qrCodeDataUrl,
        ]);
    }

    /**
     * Verify the TOTP code during setup, then enable 2FA and generate backup codes.
     */
    public function verifySetup(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();

        if ($user->two_factor_enabled) {
            return response()->json([
                'message' => 'Two-factor authentication is already enabled.',
            ], 422);
        }

        if (!$user->two_factor_secret) {
            return response()->json([
                'message' => 'Please initiate 2FA setup first.',
            ], 422);
        }

        $secret = decrypt($user->two_factor_secret);
        $valid = $this->google2fa->verifyKey($secret, $request->code);

        if (!$valid) {
            throw ValidationException::withMessages([
                'code' => ['Invalid verification code. Please try again.'],
            ]);
        }

        // Generate backup codes
        $backupCodes = collect(range(1, 8))->map(fn () => Str::random(10))->toArray();

        $user->update([
            'two_factor_enabled' => true,
            'two_factor_backup_codes' => encrypt(json_encode($backupCodes)),
        ]);

        return response()->json([
            'message' => 'Two-factor authentication enabled successfully.',
            'backup_codes' => $backupCodes,
        ]);
    }

    /**
     * Disable 2FA (requires password confirmation).
     */
    public function disable(Request $request): JsonResponse
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The password is incorrect.'],
            ]);
        }

        $user->update([
            'two_factor_enabled' => false,
            'two_factor_secret' => null,
            'two_factor_backup_codes' => null,
        ]);

        return response()->json([
            'message' => 'Two-factor authentication disabled successfully.',
        ]);
    }

    /**
     * Verify TOTP code during login (called after password is validated).
     * The user is identified by a temporary signed token in the request.
     */
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|integer',
            'code' => 'required|string',
            'two_factor_token' => 'required|string',
        ]);

        $user = User::findOrFail($request->user_id);

        // Verify the temporary token (hash of user_id + secret)
        $expectedToken = hash('sha256', $user->id . $user->two_factor_secret . config('app.key'));
        if (!hash_equals($expectedToken, $request->two_factor_token)) {
            return response()->json(['message' => 'Invalid request.'], 403);
        }

        $code = $request->code;
        $secret = decrypt($user->two_factor_secret);

        // Try TOTP code first
        if ($this->google2fa->verifyKey($secret, $code)) {
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
            ]);
        }

        // Try backup code
        $backupCodes = json_decode(decrypt($user->two_factor_backup_codes), true);
        $index = array_search($code, $backupCodes);

        if ($index !== false) {
            // Remove used backup code
            unset($backupCodes[$index]);
            $user->update([
                'two_factor_backup_codes' => encrypt(json_encode(array_values($backupCodes))),
            ]);

            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
                'backup_code_used' => true,
                'backup_codes_remaining' => count($backupCodes),
            ]);
        }

        throw ValidationException::withMessages([
            'code' => ['Invalid verification code.'],
        ]);
    }

    /**
     * Regenerate backup codes (requires password).
     */
    public function regenerateBackupCodes(Request $request): JsonResponse
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!$user->two_factor_enabled) {
            return response()->json([
                'message' => 'Two-factor authentication is not enabled.',
            ], 422);
        }

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The password is incorrect.'],
            ]);
        }

        $backupCodes = collect(range(1, 8))->map(fn () => Str::random(10))->toArray();

        $user->update([
            'two_factor_backup_codes' => encrypt(json_encode($backupCodes)),
        ]);

        return response()->json([
            'message' => 'Backup codes regenerated successfully.',
            'backup_codes' => $backupCodes,
        ]);
    }

    /**
     * Get 2FA status for the current user.
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'two_factor_enabled' => $user->two_factor_enabled,
        ]);
    }
}
