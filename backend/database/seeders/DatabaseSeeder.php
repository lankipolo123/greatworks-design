<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        DB::table('locations')->insert([
            [
                'name'        => 'GreatWork Studio',
                'address'     => '2F ABDC Building, Sct. Rallos, cor Sct. Tuason St, Diliman, Quezon City',
                'description' => 'Join us at GreatWork Tomas Morato and let your creativity thrive in a space that combines innovation, affordability, and accessibility. Your path to success starts right here!',
                'status'      => 'active',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'GreatWork Business Campus',
                'address'     => '3/F Main GreatWork Ben-Lor IT Center, Diliman, Quezon City, Metro Manila',
                'description' => 'Unlock your potential in a dynamic, affordable, and professional environment. Join us at GreatWork Quezon Ave and witness your ideas take flight right in the heart of this bustling city. Your success begins here!',
                'status'      => 'active',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'GreatWork Mega Tower',
                'address'     => '24th, 32nd, and 34 Floor SM Mega Tower, Ortigas Avenue, Mandaluyong, Metro Manila',
                'description' => null,
                'status'      => 'active',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}
