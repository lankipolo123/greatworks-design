<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@greatworks.com',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
            'status' => 'active',
            'phone' => '+1234567890',
            'address' => '123 Admin St',
        ]);

        // Create test customer
        User::create([
            'name' => 'John Doe',
            'email' => 'customer@test.com',
            'password' => bcrypt('password123'),
            'role' => 'customer',
            'status' => 'active',
            'phone' => '+0987654321',
            'address' => '456 Customer Ave',
        ]);
    }
}
