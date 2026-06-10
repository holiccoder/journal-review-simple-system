<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show the dashboard with user submissions.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = $user->is_admin
            ? \App\Models\Submission::with('user')
            : $user->submissions();

        $submissions = $query
            ->with(['histories', 'files'])
            ->latest('submitted_at')
            ->get()
            ->map(fn ($submission) => [
                'id' => $submission->id,
                'title' => $submission->title,
                'name' => $submission->name,
                'email' => $submission->email,
                'version' => $submission->version,
                'status' => $submission->status,
                'recommendations' => $submission->recommendations,
                'user_id' => $submission->user_id,
                'user_name' => $submission->user?->name,
                'submitted_at' => $submission->submitted_at?->format('Y-m-d H:i'),
                'download_url' => route('submissions.download', $submission),
                'replace_url' => route('submissions.replace', $submission),
                'delete_url' => route('submissions.destroy', $submission),
                'files' => $submission->files
                    ->sortByDesc('created_at')
                    ->values()
                    ->map(fn ($f) => [
                        'id' => $f->id,
                        'user_id' => $f->user_id,
                        'file_name' => $f->file_name,
                        'file_size' => $f->file_size,
                        'file_extension' => $f->file_extension,
                        'created_at' => $f->created_at?->format('Y-m-d H:i'),
                        'is_uploader_admin' => $f->user ? (bool) $f->user->is_admin : false,
                        'download_url' => route('submissions.files.download', $f),
                    ]),
                'histories' => $submission->histories
                    ->sortByDesc('submitted_at')
                    ->values()
                    ->map(fn ($h) => [
                        'id' => $h->id,
                        'file_name' => $h->file_name,
                        'status' => $h->status,
                        'comment' => $h->comment,
                        'submitted_at' => $h->submitted_at?->format('Y-m-d H:i'),
                        'download_url' => route('submissions.history.download', $h),
                    ]),
                'history_count' => $submission->histories->count(),
            ]);

        return Inertia::render('dashboard', [
            'submissions' => $submissions,
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'is_admin' => (bool) $request->user()->is_admin,
                'submission_count' => $request->user()->submission_count,
            ],
            'users_count' => \App\Models\User::count(),
        ]);
    }
}
