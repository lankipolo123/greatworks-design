<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemSettingController extends Controller
{
    /**
     * Get all system settings.
     */
    public function index(): JsonResponse
    {
        $settings = SystemSetting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    /**
     * Get a single setting by key.
     */
    public function show(string $key): JsonResponse
    {
        $setting = SystemSetting::where('key', $key)->first();

        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        return response()->json([
            'key' => $setting->key,
            'value' => $setting->value,
        ]);
    }

    /**
     * Update a setting (admin only).
     */
    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'key' => 'required|string',
            'value' => 'required|string',
        ]);

        SystemSetting::setValue($request->key, $request->value);

        return response()->json([
            'message' => 'Setting updated',
            'key' => $request->key,
            'value' => $request->value,
        ]);
    }
}
