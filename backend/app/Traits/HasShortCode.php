<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasShortCode
{
    protected static function bootHasShortCode(): void
    {
        static::creating(function ($model) {
            $model->short_code = static::generateUniqueShortCode();
        });
    }

    protected static function generateUniqueShortCode(): string
    {
        do {
            $code = strtoupper(Str::random(4));
        } while (static::where('short_code', $code)->exists());

        return $code;
    }
}
