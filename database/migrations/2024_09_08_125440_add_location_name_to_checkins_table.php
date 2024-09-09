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
        Schema::table('checkins', function (Blueprint $table) {
            $table->string('check_in_location')->nullable()->after('check_out_at');
            $table->string('check_out_location')->nullable()->after('check_in_location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('checkins', function (Blueprint $table) {
            $table->string('check_in_location')->nullable();
            $table->string('check_out_location')->nullable();
        });
    }
};
