<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // CRUD Tâches (User)
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/{task}', [TaskController::class, 'show']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
    Route::post('/tasks/{task}/assign', [TaskController::class, 'assign']);

    // Routes Admin (protégées par le middleware admin)
    Route::middleware('admin')->group(function () {
        // CRUD Utilisateurs
        Route::apiResource('admin/users', AdminUserController::class);
        
        // Route spéciale pour voir un user avec ses tâches
        Route::get('/admin/users/{id}/details', [AdminUserController::class, 'showWithTasks']);
        
        // Route pour voir toutes les tâches
        Route::get('/admin/tasks', [TaskController::class, 'adminIndex']);
    });
});