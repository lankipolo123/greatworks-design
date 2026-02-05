<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ActivityLog::with('user');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhere('module', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->has('module')) {
            $query->where('module', $request->module);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        $logs = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json($logs);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'action' => 'required|string|max:255',
            'module' => 'required|string|max:100',
            'ip_address' => 'nullable|ip',
            'description' => 'nullable|string',
            'old_values' => 'nullable|array',
            'new_values' => 'nullable|array',
        ]);

        $log = ActivityLog::create($validated);

        return response()->json([
            'message' => 'Activity log created successfully',
            'log' => $log->load('user'),
        ], 201);
    }

    public function show(ActivityLog $activityLog): JsonResponse
    {
        return response()->json($activityLog->load('user'));
    }

    public function update(Request $request, ActivityLog $activityLog): JsonResponse
    {
        return response()->json([
            'message' => 'Activity logs cannot be updated',
        ], 403);
    }

    public function destroy(ActivityLog $activityLog): JsonResponse
    {
        return response()->json([
            'message' => 'Activity logs cannot be deleted',
        ], 403);
    }
}
