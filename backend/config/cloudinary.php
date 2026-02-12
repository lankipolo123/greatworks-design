<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    |
    | Configure your Cloudinary credentials and settings here.
    | You can get these from your Cloudinary Dashboard.
    |
    */

    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
    'api_key' => env('CLOUDINARY_API_KEY'),
    'api_secret' => env('CLOUDINARY_API_SECRET'),
    'secure' => env('CLOUDINARY_SECURE', true),

    /*
    |--------------------------------------------------------------------------
    | Upload Presets
    |--------------------------------------------------------------------------
    |
    | Define your upload presets for different types of images.
    |
    */

    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),

    /*
    |--------------------------------------------------------------------------
    | Folder Structure
    |--------------------------------------------------------------------------
    |
    | Organize your uploads in folders.
    |
    */

    'folders' => [
        'profile_photos' => 'greatworks/profiles',
        'room_images' => 'greatworks/rooms',
        'location_images' => 'greatworks/locations',
    ],
];
