<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'submission_id',
    'by_user_id',
    'file_name',
    'file_path',
    'status',
    'comment',
    'submitted_at',
])]
class SubmissionHistory extends Model
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
     * Get the submission that owns this history record.
     */
    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    /**
     * Get the user who performed this action.
     */
    public function byUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'by_user_id');
    }
}
