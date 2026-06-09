<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('submission_histories', function (Blueprint $table) {
            $table->foreignId('by_user_id')->nullable()->after('submission_id')->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submission_histories', function (Blueprint $table) {
            $table->dropForeign(['by_user_id']);
            $table->dropColumn('by_user_id');
        });
    }
};
