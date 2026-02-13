<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['Co-Working Space', 'Virtual Offices', 'Meeting Rooms', 'Private Offices', 'Event Spaces'];
        $type = fake()->randomElement($types);

        $amenities = [
            'Co-Working Space' => ['WiFi', 'Coffee', 'Air Conditioning', 'Printing', 'Lounge Area'],
            'Virtual Offices' => ['WiFi', 'Business Address', 'Mail Handling', 'Phone Service', 'Reception'],
            'Meeting Rooms' => ['WiFi', 'Projector', 'Whiteboard', 'Video Conference', 'Air Conditioning'],
            'Private Offices' => ['WiFi', 'Desk', 'Chair', 'Storage', 'Air Conditioning', 'Window View'],
            'Event Spaces' => ['WiFi', 'Sound System', 'Stage', 'Catering', 'Parking', 'Air Conditioning'],
        ];

        $capacities = [
            'Co-Working Space' => [20, 30, 40, 50],
            'Virtual Offices' => [1, 2, 3],
            'Meeting Rooms' => [6, 8, 10, 12, 15],
            'Private Offices' => [2, 4, 6, 8],
            'Event Spaces' => [50, 100, 150, 200],
        ];

        $prices = [
            'Co-Working Space' => [50000, 75000, 100000],
            'Virtual Offices' => [30000, 40000, 50000],
            'Meeting Rooms' => [100000, 150000, 200000],
            'Private Offices' => [150000, 200000, 250000],
            'Event Spaces' => [500000, 750000, 1000000],
        ];

        $capacity = fake()->randomElement($capacities[$type]);
        $price = fake()->randomElement($prices[$type]);
        $selectedAmenities = fake()->randomElements($amenities[$type], fake()->numberBetween(3, count($amenities[$type])));

        return [
            'name' => fake()->bothify('Room ?##'),
            'type' => $type,
            'capacity' => $capacity,
            'price_per_hour' => $price,
            'floor' => fake()->numberBetween(1, 10),
            'location' => null, // deprecated field
            'location_id' => Location::factory(),
            'image' => 'rooms/' . strtolower(str_replace(' ', '-', $type)) . '-' . fake()->numberBetween(1, 5) . '.jpg',
            'amenities' => $selectedAmenities,
            'description' => fake()->paragraph(2),
            'status' => fake()->randomElement(['available', 'available', 'available', 'maintenance']),
        ];
    }

    /**
     * Indicate that the room is in a specific location.
     */
    public function forLocation(Location $location): static
    {
        return $this->state(fn (array $attributes) => [
            'location_id' => $location->id,
        ]);
    }

    /**
     * Indicate that the room is of a specific type.
     */
    public function ofType(string $type): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => $type,
        ]);
    }
}
