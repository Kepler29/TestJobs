<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserData extends Model
{
    use HasFactory;

    protected $table = 'users_data';

    protected $fillable = [
        'name',
        'frist_name',
        'last_name',
        'phone',
        'street',
        'number_external',
        'number_internal',
        'district',
        'cp'
    ];

}
