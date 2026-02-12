# Cloudinary & Brevo Integration Guide

This guide will help you set up **Cloudinary** for image storage and **Brevo** for email functionality in your GreatWorks application.

---

## Table of Contents

1. [Cloudinary Setup](#cloudinary-setup)
2. [Brevo Setup](#brevo-setup)
3. [Environment Configuration](#environment-configuration)
4. [Using Cloudinary for Profile Photos](#using-cloudinary-for-profile-photos)
5. [Sending Emails with Brevo](#sending-emails-with-brevo)
6. [Testing](#testing)

---

## Cloudinary Setup

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account
3. After signing up, you'll be redirected to your **Dashboard**

### 2. Get Your Cloudinary Credentials

From your Cloudinary Dashboard, you'll need:

- **Cloud Name**: Found at the top of the dashboard
- **API Key**: Found in the "Account Details" section
- **API Secret**: Found in the "Account Details" section (click "Show" to reveal)

### 3. Configure Cloudinary in Laravel

Add these credentials to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_SECURE=true
```

### 4. Optional: Create Upload Presets

1. In Cloudinary Dashboard, go to **Settings > Upload**
2. Scroll to **Upload presets**
3. Create a preset for optimized uploads (optional)
4. Add the preset name to your `.env`:

```env
CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

---

## Brevo Setup

### 1. Create a Brevo Account

1. Go to [https://www.brevo.com/](https://www.brevo.com/) (formerly Sendinblue)
2. Sign up for a free account (300 emails/day on free tier)
3. Verify your email address

### 2. Get Your SMTP Credentials

1. Log in to your Brevo account
2. Go to **SMTP & API > SMTP**
3. Click on **"Generate a new SMTP key"**
4. Copy your SMTP credentials:
   - **SMTP Server**: smtp-relay.brevo.com
   - **Port**: 587
   - **Login**: Your email address
   - **SMTP Key**: The generated key (acts as password)

### 3. Verify Your Sender Email

1. Go to **Senders & IPs > Senders**
2. Add and verify the email address you want to send from
3. Follow the verification process (confirm via email)

### 4. Configure Brevo in Laravel

Add these credentials to your `.env` file:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=your_brevo_email@example.com
MAIL_PASSWORD=your_smtp_key_here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourwebsite.com"
MAIL_FROM_NAME="GreatWorks"
```

**Important:** Replace `MAIL_FROM_ADDRESS` with the verified sender email from step 3.

---

## Environment Configuration

Your complete `.env` file should include:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_SECURE=true
CLOUDINARY_UPLOAD_PRESET=

# Brevo Email Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=your_brevo_email@example.com
MAIL_PASSWORD=your_smtp_key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@greatworks.com"
MAIL_FROM_NAME="${APP_NAME}"
```

---

## Using Cloudinary for Profile Photos

### API Endpoints

#### Upload Profile Photo

**Endpoint:** `POST /api/users/{user_id}/profile-photo`

**Headers:**
```
Authorization: Bearer {your_token}
Content-Type: multipart/form-data
```

**Body:**
```
photo: [image file] (max 5MB, formats: jpeg, jpg, png, gif, webp)
```

**Example using cURL:**
```bash
curl -X POST http://your-domain.com/api/users/1/profile-photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "photo=@/path/to/image.jpg"
```

**Response:**
```json
{
  "message": "Profile photo uploaded successfully",
  "photo_url": "https://res.cloudinary.com/your_cloud/image/upload/v123456789/greatworks/profiles/user_1_1234567890.jpg",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profile_photo": "https://res.cloudinary.com/..."
  }
}
```

#### Delete Profile Photo

**Endpoint:** `DELETE /api/users/{user_id}/profile-photo`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Response:**
```json
{
  "message": "Profile photo deleted successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "profile_photo": null
  }
}
```

### Frontend Integration Example

```javascript
// Upload profile photo
async function uploadProfilePhoto(userId, photoFile) {
  const formData = new FormData();
  formData.append('photo', photoFile);

  const response = await fetch(`/api/users/${userId}/profile-photo`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${yourToken}`
    },
    body: formData
  });

  return await response.json();
}

// Usage in your frontend
const fileInput = document.querySelector('#photo-input');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const result = await uploadProfilePhoto(currentUserId, file);
  console.log('Upload result:', result);
});
```

---

## Sending Emails with Brevo

### Available Email Templates

#### 1. Welcome Email

Send a welcome email when a new user registers:

```php
use App\Mail\WelcomeMail;
use Illuminate\Support\Facades\Mail;

// In your AuthController or wherever you handle registration
$user = User::create([...]);

// Send welcome email
Mail::to($user->email)->send(new WelcomeMail($user));
```

#### 2. Booking Confirmation Email

Send a booking confirmation email:

```php
use App\Mail\BookingConfirmationMail;
use Illuminate\Support\Facades\Mail;

// After creating a booking
$booking = Booking::create([...]);
$booking->load(['user', 'room']);

// Send booking confirmation
Mail::to($booking->user->email)->send(new BookingConfirmationMail($booking));
```

### Example: Send Welcome Email on Registration

Update your `AuthController::register()` method:

```php
public function register(Request $request): JsonResponse
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
    ]);

    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'role' => 'customer',
        'status' => 'active',
    ]);

    // Send welcome email
    Mail::to($user->email)->send(new WelcomeMail($user));

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => $user,
    ], 201);
}
```

### Creating Custom Email Templates

1. Create a new Mailable class:
```bash
php artisan make:mail YourMailName
```

2. Edit the generated file in `app/Mail/YourMailName.php`

3. Create the email view in `resources/views/emails/your-mail-name.blade.php`

4. Send the email:
```php
Mail::to($user->email)->send(new YourMailName($data));
```

---

## Testing

### Test Cloudinary Upload

```bash
# Test uploading a profile photo
curl -X POST http://localhost:8000/api/users/1/profile-photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "photo=@test-image.jpg"
```

### Test Email Sending

```bash
# In Laravel Tinker
php artisan tinker

# Send a test welcome email
$user = User::first();
Mail::to($user->email)->send(new \App\Mail\WelcomeMail($user));

# Check logs
tail -f storage/logs/laravel.log
```

### Queue Emails (Recommended for Production)

For better performance, queue emails instead of sending them synchronously:

```php
// Instead of:
Mail::to($user->email)->send(new WelcomeMail($user));

// Use queue:
Mail::to($user->email)->queue(new WelcomeMail($user));
```

Make sure your queue worker is running:
```bash
php artisan queue:work
```

---

## Troubleshooting

### Cloudinary Issues

1. **Upload fails with 401 error**
   - Check your API Key and Secret are correct
   - Ensure CLOUDINARY_CLOUD_NAME is set correctly

2. **Image quality is poor**
   - Adjust transformation parameters in `CloudinaryService.php`
   - Increase quality: `'quality' => 'auto:best'`

### Brevo Email Issues

1. **Emails not sending**
   - Verify your SMTP credentials
   - Check if sender email is verified in Brevo dashboard
   - Check Laravel logs: `storage/logs/laravel.log`

2. **Emails going to spam**
   - Verify your domain with Brevo
   - Set up SPF and DKIM records
   - Use a professional from address

3. **Daily limit reached**
   - Free tier: 300 emails/day
   - Upgrade your Brevo plan if needed
   - Consider using queue to space out emails

---

## Additional Resources

- [Cloudinary PHP Documentation](https://cloudinary.com/documentation/php_integration)
- [Brevo API Documentation](https://developers.brevo.com/)
- [Laravel Mail Documentation](https://laravel.com/docs/mail)

---

## Support

If you encounter any issues, please:
1. Check the logs in `storage/logs/laravel.log`
2. Verify all environment variables are set correctly
3. Test with Laravel Tinker for debugging
4. Contact support if issues persist

---

**Happy coding!**
