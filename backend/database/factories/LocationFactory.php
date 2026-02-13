<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Location>
 */
class LocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cities = [
            ['city' => 'Jakarta', 'state' => 'DKI Jakarta', 'country' => 'Indonesia'],
            ['city' => 'Surabaya', 'state' => 'East Java', 'country' => 'Indonesia'],
            ['city' => 'Bandung', 'state' => 'West Java', 'country' => 'Indonesia'],
            ['city' => 'Medan', 'state' => 'North Sumatra', 'country' => 'Indonesia'],
            ['city' => 'Semarang', 'state' => 'Central Java', 'country' => 'Indonesia'],
        ];

        $location = fake()->randomElement($cities);

        return [
            'name' => fake()->company() . ' ' . $location['city'] . ' Branch',
            'address' => fake()->streetAddress(),
            'city' => $location['city'],
            'state' => $location['state'],
            'zip_code' => fake()->postcode(),
            'country' => $location['country'],
            'phone' => fake()->phoneNumber(),
            'email' => fake()->companyEmail(),
            'image' => 'locations/default-' . fake()->numberBetween(1, 5) . '.jpg',
            'description' => fake()->paragraph(3),
            'status' => fake()->randomElement(['active', 'active', 'active', 'inactive']),
        ];
    }
}
