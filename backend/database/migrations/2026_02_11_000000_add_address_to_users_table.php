<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Address column already exists in create_users_table migration
        // This migration is kept for historical reference only
    }

    public function down(): void
    {
        // No changes needed
    }
};
