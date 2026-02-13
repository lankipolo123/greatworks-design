<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $methods = ['gcash', 'credit_card', 'debit_card', 'cash', 'bank_transfer'];
        $statuses = ['pending', 'completed', 'failed', 'refunded'];

        $amount = fake()->randomFloat(2, 50000, 2000000);

        return [
            'booking_id' => Booking::factory(),
            'user_id' => User::factory(),
            'amount' => $amount,
            'currency' => 'PHP',
            'method' => fake()->randomElement($methods),
            'status' => fake()->randomElement($statuses),
            'reference_number' => 'REF-' . strtoupper(fake()->bothify('????-########')),
        ];
    }

    /**
     * Indicate that the payment is for a specific booking.
     */
    public function forBooking(Booking $booking): static
    {
        return $this->state(fn (array $attributes) => [
            'booking_id' => $booking->id,
            'user_id' => $booking->user_id,
        ]);
    }

    /**
     * Indicate that the payment is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }
}
