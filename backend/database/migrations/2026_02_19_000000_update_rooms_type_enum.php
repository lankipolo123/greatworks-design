<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE rooms MODIFY COLUMN type ENUM('co_working', 'virtual_offices', 'private_offices', 'events_meeting_room') DEFAULT 'co_working'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE rooms MODIFY COLUMN type ENUM('conference', 'meeting', 'private_office', 'hot_desk', 'event_space') DEFAULT 'meeting'");
    }
};
