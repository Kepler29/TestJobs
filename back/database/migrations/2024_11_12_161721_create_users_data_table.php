<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(){
        Schema::create('users_data', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('frist_name');
            $table->string('last_name');
            $table->string('phone');
            $table->string('street');
            $table->string('number_external');
            $table->string('number_internal');
            $table->string('district');
            $table->string('cp');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_data');
    }
};
