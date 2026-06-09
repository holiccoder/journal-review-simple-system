<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id',
    'title',
    'name',
    'email',
    'version',
    'status',
    'comment',
    'submitted_at',
])]
class Submission extends Model
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns this submission.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the history records for this submission.
     */
    public function histories(): HasMany
    {
        return $this->hasMany(SubmissionHistory::class);
    }

    /**
     * Get the files for this submission.
     */
    public function files(): HasMany
    {
        return $this->hasMany(SubmissionFile::class);
    }
}
