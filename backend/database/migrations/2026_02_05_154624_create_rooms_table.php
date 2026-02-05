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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['conference', 'meeting', 'private_office', 'hot_desk', 'event_space'])->default('meeting');
            $table->integer('capacity');
            $table->decimal('price_per_hour', 10, 2);
            $table->string('floor')->nullable();
            $table->string('location')->nullable();
            $table->string('image')->nullable();
            $table->json('amenities')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['available', 'unavailable', 'maintenance'])->default('available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
