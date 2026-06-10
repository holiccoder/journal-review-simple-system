<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : inertia('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/submissions', [SubmissionController::class, 'store'])->name('submissions.store');
    Route::get('/submissions/{submission}/download', [SubmissionController::class, 'download'])->name('submissions.download');
    Route::post('/submissions/{submission}/replace', [SubmissionController::class, 'replace'])->name('submissions.replace');
    Route::get('/submissions/files/{file}/download', [SubmissionController::class, 'downloadFile'])->name('submissions.files.download');
    Route::get('/submissions/history/{history}/download', [SubmissionController::class, 'downloadHistory'])->name('submissions.history.download');
    Route::delete('/submissions/{submission}', [SubmissionController::class, 'destroy'])->name('submissions.destroy');
    Route::get('/users', [UsersController::class, 'index'])->name('users')->middleware('admin');
});

require __DIR__.'/settings.php';
