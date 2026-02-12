<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
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
            background-color: #10B981;
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
        .booking-details {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #e5e7eb;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #6b7280;
        }
        .value {
            color: #111827;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #6b7280;
            font-size: 14px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
        }
        .status-confirmed {
            background-color: #D1FAE5;
            color: #065F46;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Booking Confirmed!</h1>
    </div>

    <div class="content">
        <h2>Hello {{ $user->name }}!</h2>

        <p>Your booking has been confirmed. Here are your booking details:</p>

        <div class="booking-details">
            <div class="detail-row">
                <span class="label">Booking ID:</span>
                <span class="value">#{{ $booking->id }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Room:</span>
                <span class="value">{{ $room->name ?? 'N/A' }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">{{ \Carbon\Carbon::parse($booking->date)->format('F j, Y') }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">{{ \Carbon\Carbon::parse($booking->start_time)->format('g:i A') }} - {{ \Carbon\Carbon::parse($booking->end_time)->format('g:i A') }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Duration:</span>
                <span class="value">{{ $booking->duration }} hours</span>
            </div>
            <div class="detail-row">
                <span class="label">Status:</span>
                <span class="value">
                    <span class="status-badge status-confirmed">{{ ucfirst($booking->status) }}</span>
                </span>
            </div>
        </div>

        <p><strong>Important Information:</strong></p>
        <ul>
            <li>Please arrive at least 10 minutes before your scheduled time</li>
            <li>Bring a valid ID for verification</li>
            <li>Check-in at the reception desk</li>
        </ul>

        <p>If you need to make any changes to your booking, please contact our support team as soon as possible.</p>

        <p>We look forward to seeing you!</p>

        <p>Best regards,<br>
        The {{ config('app.name') }} Team</p>
    </div>

    <div class="footer">
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>
</html>
