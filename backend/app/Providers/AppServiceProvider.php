<?php

namespace App\Providers;

use App\Models\Reservation;
use App\Models\Room;
use App\Models\Ticket;
use App\Models\User;
use App\Observers\ReservationObserver;
use App\Observers\RoomObserver;
use App\Observers\TicketObserver;
use App\Observers\UserObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        User::observe(UserObserver::class);
        Ticket::observe(TicketObserver::class);
        Room::observe(RoomObserver::class);
        Reservation::observe(ReservationObserver::class);
    }
}
