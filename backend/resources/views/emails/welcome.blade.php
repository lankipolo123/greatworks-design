<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {{ config('app.name') }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4F46E5;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .button {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to {{ config('app.name') }}!</h1>
    </div>

    <div class="content">
        <h2>Hello {{ $userName }}!</h2>

        <p>Thank you for registering with {{ config('app.name') }}. We're excited to have you on board!</p>

        <p>Your account has been successfully created with the email: <strong>{{ $userEmail }}</strong></p>

        <p>You can now:</p>
        <ul>
            <li>Browse available rooms and workspaces</li>
            <li>Make bookings and reservations</li>
            <li>Manage your profile and preferences</li>
            <li>Track your booking history</li>
        </ul>

        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>

        <p>Best regards,<br>
        The {{ config('app.name') }} Team</p>
    </div>

    <div class="footer">
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>
</html>
