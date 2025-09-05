<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class AdminTaskController extends Controller
{
    // Retourne toutes les tâches avec infos créateur et assigné (réservé à l’admin)
    public function adminIndex(Request $request)
    {
        // Vérification admin
        if (!$request->user() || !$request->user()->isAdmin()) {
            return response()->json(['error' => 'Accès refusé'], 403);
        }

        $tasks = Task::with(['creator:id,name,email', 'assignee:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($tasks);
    }
}
