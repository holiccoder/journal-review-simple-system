<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Show all non-admin users (students).
     */
    public function index(Request $request): Response
    {
        $students = User::where('is_admin', false)
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

        return Inertia::render('settings/students', [
            'students' => $students,
        ]);
    }

    /**
     * Create a new student (non-admin user).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', Password::defaults()],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'is_admin' => false,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Student created.')]);

        return back();
    }

    /**
     * Update a student's details.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'password' => ['nullable', 'string', Password::defaults(), 'confirmed'],
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (! empty($validated['password'])) {
            $data['password'] = $validated['password'];
        }

        $user->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Student updated.')]);

        return back();
    }

    /**
     * Delete a student.
     */
    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Student deleted.')]);

        return back();
    }
}
