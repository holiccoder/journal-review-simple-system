<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\SubmissionFile;
use App\Models\SubmissionHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SubmissionController extends Controller
{
    /**
     * Store a newly created submission.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'files' => ['required', 'array'],
            'files.*' => ['file', 'max:10240'],
            'version' => ['required', 'string', 'max:50'],
        ]);

        $submission = $request->user()->submissions()->create([
            'title' => $validated['title'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'version' => $validated['version'],
            'status' => 'under review',
            'submitted_at' => now(),
        ]);

        foreach ($request->file('files') as $file) {
            $submission->files()->create([
                'user_id' => $request->user()->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $file->store('submissions'),
                'file_size' => $file->getSize(),
                'file_extension' => $file->getClientOriginalExtension(),
            ]);
        }

        return back()->with('status', 'File submitted successfully.');
    }

    /**
     * Replace a submission file — archives current data as history.
     */
    public function replace(Request $request, Submission $submission)
    {
        $this->authorize('update', $submission);

        $validated = $request->validate([
            'file' => ['required', 'file', 'max:10240'],
            'status' => ['required', 'string', 'in:under review,needs revision,accepted,rejected,recommended for journal submission'],
            'recommendations' => ['nullable', 'string', 'max:500'],
        ]);

        // Save current state as history before overriding
        $latestFile = $submission->files()->latest()->first();
        $submission->histories()->create([
            'file_name' => $latestFile?->file_name ?? '',
            'file_path' => $latestFile?->file_path ?? '',
            'status' => $submission->status,
            'comment' => $submission->recommendations,
            'submitted_at' => $submission->submitted_at,
            'by_user_id' => $request->user()->id,
        ]);

        $file = $request->file('file');

        $path = $file->store('submissions');

        $submission->files()->create([
            'user_id' => $request->user()->id,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'file_extension' => $file->getClientOriginalExtension(),
        ]);

        // Auto-increment version
        $nextVersion = (string) ((float) $submission->version + 0.1);

        $submission->update([
            'version' => $nextVersion,
            'status' => $validated['status'],
            'recommendations' => $validated['recommendations'] ?? null,
            'submitted_at' => now(),
        ]);

        return back()->with('status', 'File replaced successfully.');
    }

    /**
     * Download a submission file.
     */
    public function download(Submission $submission)
    {
        $this->authorize('view', $submission);

        $latestFile = $submission->files()->latest()->first();

        if (! $latestFile) {
            abort(404, 'File not found.');
        }

        // Support both absolute and relative paths
        if (file_exists($latestFile->file_path)) {
            return response()->download(
                $latestFile->file_path,
                $latestFile->file_name
            );
        }

        // Try as relative path on the local disk
        $diskPath = Storage::path($latestFile->file_path);
        if (file_exists($diskPath)) {
            return response()->download(
                $diskPath,
                $latestFile->file_name
            );
        }

        abort(404, 'File not found.');
    }

    /**
     * Download an individual submission file.
     */
    public function downloadFile(SubmissionFile $file)
    {
        $this->authorize('view', $file->submission);

        if (file_exists($file->file_path)) {
            return response()->download(
                $file->file_path,
                $file->file_name
            );
        }

        $diskPath = Storage::path($file->file_path);
        if (file_exists($diskPath)) {
            return response()->download(
                $diskPath,
                $file->file_name
            );
        }

        abort(404, 'File not found.');
    }

    /**
     * Delete a submission and all related files/histories.
     */
    public function destroy(Request $request, Submission $submission)
    {
        $this->authorize('delete', $submission);

        // Delete stored files from disk
        foreach ($submission->files as $file) {
            Storage::delete($file->file_path);
        }
        foreach ($submission->histories as $history) {
            Storage::delete($history->file_path);
        }

        // DB cascades delete files and histories via foreign key cascadeOnDelete
        $submission->delete();

        return back()->with('status', 'Submission deleted.');
    }

    /**
     * Download a history file.
     */
    public function downloadHistory(SubmissionHistory $history)
    {
        $this->authorize('view', $history->submission);

        if (file_exists($history->file_path)) {
            return response()->download(
                $history->file_path,
                $history->file_name
            );
        }

        $diskPath = Storage::path($history->file_path);
        if (file_exists($diskPath)) {
            return response()->download(
                $diskPath,
                $history->file_name
            );
        }

        abort(404, 'File not found.');
    }
}
