<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class CloudinaryService
{
    protected Cloudinary $cloudinary;

    public function __construct()
    {
        Configuration::instance([
            'cloud' => [
                'cloud_name' => config('cloudinary.cloud_name'),
                'api_key' => config('cloudinary.api_key'),
                'api_secret' => config('cloudinary.api_secret'),
            ],
            'url' => [
                'secure' => config('cloudinary.secure'),
            ],
        ]);

        $this->cloudinary = new Cloudinary();
    }

    /**
     * Upload an image to Cloudinary
     *
     * @param UploadedFile $file
     * @param string $folder
     * @param array $options
     * @return array|null
     */
    public function uploadImage(UploadedFile $file, string $folder = 'default', array $options = []): ?array
    {
        try {
            Log::info('=== CLOUDINARY UPLOAD DEBUG ===');
            Log::info('Cloudinary config:', [
                'cloud_name' => config('cloudinary.cloud_name'),
                'api_key' => config('cloudinary.api_key'),
                'api_secret_set' => !empty(config('cloudinary.api_secret')),
                'secure' => config('cloudinary.secure'),
            ]);

            Log::info('File path: ' . $file->getRealPath());
            Log::info('File exists: ' . (file_exists($file->getRealPath()) ? 'YES' : 'NO'));
            Log::info('Folder: ' . $folder);

            $uploadOptions = array_merge([
                'folder' => $folder,
                'resource_type' => 'image',
                'overwrite' => true,
                'invalidate' => true,
            ], $options);

            Log::info('Upload options:', $uploadOptions);

            Log::info('Calling Cloudinary uploadApi()->upload()...');
            $result = $this->cloudinary->uploadApi()->upload(
                $file->getRealPath(),
                $uploadOptions
            );

            Log::info('Cloudinary response:', $result);

            return [
                'public_id' => $result['public_id'],
                'secure_url' => $result['secure_url'],
                'width' => $result['width'],
                'height' => $result['height'],
                'format' => $result['format'],
                'resource_type' => $result['resource_type'],
            ];
        } catch (\Exception $e) {
            Log::error('=== CLOUDINARY UPLOAD EXCEPTION ===');
            Log::error('Exception class: ' . get_class($e));
            Log::error('Exception message: ' . $e->getMessage());
            Log::error('Exception code: ' . $e->getCode());
            Log::error('Exception trace: ' . $e->getTraceAsString());
            return null;
        }
    }

    /**
     * Upload a profile photo
     *
     * @param UploadedFile $file
     * @param int $userId
     * @return array|null
     */
    public function uploadProfilePhoto(UploadedFile $file, int $userId): ?array
    {
        $folder = config('cloudinary.folders.profile_photos');

        return $this->uploadImage($file, $folder, [
            'public_id' => "user_{$userId}_" . time(),
            'transformation' => [
                'width' => 400,
                'height' => 400,
                'crop' => 'fill',
                'gravity' => 'face',
            ],
        ]);
    }

    /**
     * Upload a room image
     *
     * @param UploadedFile $file
     * @param int $roomId
     * @return array|null
     */
    public function uploadRoomImage(UploadedFile $file, int $roomId): ?array
    {
        $folder = config('cloudinary.folders.room_images');

        return $this->uploadImage($file, $folder, [
            'public_id' => "room_{$roomId}_" . time(),
            'transformation' => [
                'width' => 1200,
                'height' => 800,
                'crop' => 'fill',
                'quality' => 'auto',
            ],
        ]);
    }

    /**
     * Upload a location image
     *
     * @param UploadedFile $file
     * @param int $locationId
     * @return array|null
     */
    public function uploadLocationImage(UploadedFile $file, int $locationId): ?array
    {
        $folder = config('cloudinary.folders.location_images');

        return $this->uploadImage($file, $folder, [
            'public_id' => "location_{$locationId}_" . time(),
            'transformation' => [
                'width' => 1200,
                'height' => 800,
                'crop' => 'fill',
                'quality' => 'auto',
            ],
        ]);
    }

    /**
     * Delete an image from Cloudinary
     *
     * @param string $publicId
     * @return bool
     */
    public function deleteImage(string $publicId): bool
    {
        try {
            $result = $this->cloudinary->uploadApi()->destroy($publicId);
            return $result['result'] === 'ok';
        } catch (\Exception $e) {
            Log::error('Cloudinary delete failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get a transformed image URL
     *
     * @param string $publicId
     * @param array $transformations
     * @return string
     */
    public function getImageUrl(string $publicId, array $transformations = []): string
    {
        return $this->cloudinary->image($publicId)
            ->resize($transformations['resize'] ?? null)
            ->toUrl();
    }
}
