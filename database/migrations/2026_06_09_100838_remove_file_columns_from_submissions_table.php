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
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropColumn(['file_name', 'file_path', 'size', 'file_extension']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->string('file_name')->nullable()->after('email');
            $table->string('file_path')->nullable()->after('file_name');
            $table->unsignedBigInteger('size')->default(0)->after('file_path');
            $table->string('file_extension', 20)->nullable()->after('size');
        });
    }
};
