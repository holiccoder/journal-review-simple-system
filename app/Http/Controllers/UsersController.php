<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsersController extends Controller
{
    /**
     * Show all registered users except the authenticated admin.
     */
    public function index(Request $request)
    {
        $users = User::where('id', '!=', $request->user()->id)
            ->withCount('submissions')
            ->latest()
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'submission_count' => $user->submissions_count,
                'created_at' => $user->created_at?->format('Y-m-d H:i'),
            ]);

        return Inertia::render('users', [
            'users' => $users,
        ]);
    }
}
