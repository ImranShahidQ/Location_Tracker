<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckIn extends Model
{
    use HasFactory;

    protected $table = 'checkins';

    protected $fillable = ['user_id', 'latitude', 'longitude', 'check_in_at', 'check_out_at', 'check_in_location', 'check_out_location'];
}
