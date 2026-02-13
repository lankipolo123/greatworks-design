<?php

namespace Database\Factories;

use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['pending', 'confirmed', 'cancelled', 'completed'];

        $date = fake()->dateTimeBetween('-15 days', '+30 days');

        // Business hours: 8 AM to 6 PM
        $hour = fake()->numberBetween(8, 17);
        $minute = fake()->randomElement([0, 30]);
        $time = sprintf('%02d:%02d', $hour, $minute);

        return [
            'user_id' => User::factory(),
            'room_id' => Room::factory(),
            'date' => $date,
            'time' => $time,
            'guests' => fake()->numberBetween(1, 10),
            'status' => fake()->randomElement($statuses),
            'notes' => fake()->optional(0.3)->sentence(),
        ];
    }

    /**
     * Indicate that the reservation is confirmed.
     */
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
        ]);
    }
}
