<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $payments = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json($payments);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'booking_id' => 'nullable|exists:bookings,id',
            'amount' => 'required|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'method' => 'required|in:gcash,credit_card,debit_card,cash,bank_transfer',
            'status' => 'sometimes|in:pending,completed,failed,refunded',
            'reference_number' => 'nullable|string|max:100',
        ]);

        $payment = Payment::create($validated);

        return response()->json([
            'message' => 'Payment created successfully',
            'payment' => $payment->load(['user', 'booking']),
        ], 201);
    }

    public function show(Payment $payment): JsonResponse
    {
        return response()->json($payment->load(['user', 'booking']));
    }

    public function update(Request $request, Payment $payment): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:pending,completed,failed,refunded',
            'reference_number' => 'nullable|string|max:100',
        ]);

        $payment->update($validated);

        return response()->json([
            'message' => 'Payment updated successfully',
            'payment' => $payment->load(['user', 'booking']),
        ]);
    }

    public function destroy(Payment $payment): JsonResponse
    {
        $payment->delete();

        return response()->json([
            'message' => 'Payment deleted successfully',
        ]);
    }
}
