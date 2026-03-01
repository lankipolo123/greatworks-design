<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Payment::with(['user', 'booking']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('method')) {
            $query->where('method', $request->method);
        }

        // Scope by role
        if ($request->user()->isAdmin()) {
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }
        } elseif ($request->user()->isModerator()) {
            // Moderators only see payments for bookings at their location
            $query->whereHas('booking.room', function ($q) use ($request) {
                $q->where('location_id', $request->user()->location_id);
            });
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }
        } else {
            $query->where('user_id', $request->user()->id);
        }

        $payments = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json($payments);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        // Admins can create payments for any user
        if ($user->isAdmin()) {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'booking_id' => 'nullable|exists:bookings,id',
                'amount' => 'required|numeric|min:0',
                'currency' => 'sometimes|string|size:3',
                'method' => 'required|in:gcash,credit_card,debit_card,cash,bank_transfer',
                'status' => 'sometimes|in:pending,completed,failed,refunded',
                'reference_number' => 'nullable|string|max:100',
            ]);
        } else {
            // Customers/moderators create payments for their own bookings
            $validated = $request->validate([
                'booking_id' => 'required|exists:bookings,id',
                'amount' => 'required|numeric|min:0',
                'currency' => 'sometimes|string|size:3',
                'method' => 'required|in:gcash,credit_card,debit_card,cash,bank_transfer',
                'reference_number' => 'nullable|string|max:100',
            ]);

            // Verify the booking belongs to this user
            $booking = Booking::find($validated['booking_id']);
            if (!$booking || $booking->user_id !== $user->id) {
                return response()->json(['message' => 'You can only create payments for your own bookings.'], 403);
            }

            $validated['user_id'] = $user->id;

            // Cash payments stay pending (pay at counter), others mark as completed
            $validated['status'] = $validated['method'] === 'cash' ? 'pending' : 'completed';
        }

        $payment = Payment::create($validated);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'created',
            'module' => 'payments',
            'description' => "Created payment #{$payment->id} of {$payment->amount} via {$payment->method}",
            'new_values' => ['amount' => $payment->amount, 'method' => $payment->method, 'status' => $payment->status],
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Payment created successfully',
            'payment' => $payment->load(['user', 'booking']),
        ], 201);
    }

    public function show(Request $request, Payment $payment): JsonResponse
    {
        if ($request->user()->isAdmin()) {
            // Admin can view any payment
        } elseif ($request->user()->isModerator()) {
            $payment->load('booking.room');
            if (!$payment->booking || $payment->booking->room->location_id !== $request->user()->location_id) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
        } elseif ($request->user()->id !== $payment->user_id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($payment->load(['user', 'booking']));
    }

    public function update(Request $request, Payment $payment): JsonResponse
    {
        // Moderators can only update payments for bookings at their location
        if ($request->user()->isModerator()) {
            $payment->load('booking.room');
            if (!$payment->booking || $payment->booking->room->location_id !== $request->user()->location_id) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
        }

        $validated = $request->validate([
            'status' => 'sometimes|in:pending,completed,failed,refunded',
            'reference_number' => 'nullable|string|max:100',
        ]);

        $oldValues = $payment->only(array_keys($validated));
        $payment->update($validated);

        $action = 'updated';
        $description = "Updated payment #{$payment->id}";
        if (isset($validated['status']) && ($oldValues['status'] ?? null) !== $validated['status']) {
            $action = 'status_changed';
            $description = "Changed payment #{$payment->id} status from {$oldValues['status']} to {$validated['status']}";
        }

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => $action,
            'module' => 'payments',
            'description' => $description,
            'old_values' => $oldValues,
            'new_values' => $validated,
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Payment updated successfully',
            'payment' => $payment->load(['user', 'booking']),
        ]);
    }

    public function destroy(Request $request, Payment $payment): JsonResponse
    {
        // Moderators can only delete payments for bookings at their location
        if ($request->user()->isModerator()) {
            $payment->load('booking.room');
            if (!$payment->booking || $payment->booking->room->location_id !== $request->user()->location_id) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
        }

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'deleted',
            'module' => 'payments',
            'description' => "Deleted payment #{$payment->id} of {$payment->amount}",
            'old_values' => ['amount' => $payment->amount, 'method' => $payment->method, 'status' => $payment->status],
            'ip_address' => $request->ip(),
        ]);

        $payment->delete();

        return response()->json([
            'message' => 'Payment deleted successfully',
        ]);
    }
}
