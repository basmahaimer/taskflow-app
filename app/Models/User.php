<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Tâches créées par l'utilisateur
    public function tasksAssignedBy() {
        return $this->hasMany(Task::class, 'created_by');
    }

    // Tâches assignées à l'utilisateur
    public function tasksAssignedTo() {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    public function isAdmin() {
        return $this->role === 'admin';
    }
}
