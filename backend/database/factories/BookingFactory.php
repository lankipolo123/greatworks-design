<?php

namespace Database\Factories;

use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        $status = fake()->randomElement($statuses);

        // Generate dates spread across past, present, and future
        $date = fake()->dateTimeBetween('-30 days', '+60 days');

        // Business hours: 8 AM to 6 PM
        $startHour = fake()->numberBetween(8, 17);
        $startMinute = fake()->randomElement([0, 30]);
        $startTime = sprintf('%02d:%02d', $startHour, $startMinute);

        // Duration: 1-8 hours
        $duration = fake()->randomElement([1, 2, 3, 4, 6, 8]);

        return [
            'user_id' => User::factory(),
            'room_id' => Room::factory(),
            'date' => $date,
            'start_time' => $startTime,
            'duration_hours' => $duration,
            'guests' => fake()->numberBetween(1, 10),
            'status' => $status,
            'notes' => fake()->optional(0.3)->sentence(),
        ];
    }

    /**
     * Indicate that the booking is for a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Indicate that the booking is for a specific room.
     */
    public function forRoom(Room $room): static
    {
        return $this->state(fn (array $attributes) => [
            'room_id' => $room->id,
        ]);
    }

    /**
     * Indicate that the booking is confirmed.
     */
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
        ]);
    }

    /**
     * Indicate that the booking is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the booking is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }

    /**
     * Indicate that the booking is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }

    /**
     * Indicate that the booking is on a specific date.
     */
    public function onDate(string $date): static
    {
        return $this->state(fn (array $attributes) => [
            'date' => $date,
        ]);
    }
}
