<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // SQLite compatible: role is already string-based enum in Laravel
        // No changes needed, moderator can be used as a value
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No changes needed
    }
};
