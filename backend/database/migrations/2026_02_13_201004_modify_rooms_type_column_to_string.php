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
        Schema::table('rooms', function (Blueprint $table) {
            // Change type column from ENUM to VARCHAR
            $table->string('type')->default('Meeting Rooms')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            // Revert back to ENUM
            $table->enum('type', ['conference', 'meeting', 'private_office', 'hot_desk', 'event_space'])
                ->default('meeting')
                ->change();
        });
    }
};
