<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PreventAdminRoleAssignment
{
    public function handle(Request $request, Closure $next): Response
    {
        if (
            $request->user()
            && $request->user()->role !== 'admin'
            && $request->has('role')
            && $request->input('role') === 'admin'
        ) {
            return response()->json([
                'message' => 'Only admins can assign the admin role.',
            ], 403);
        }

        return $next($request);
    }
}
