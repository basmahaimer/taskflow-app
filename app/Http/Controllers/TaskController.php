<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\User;

class TaskController extends Controller
{
    // Toutes les tâches visibles par l'utilisateur connecté (user)
    public function index(Request $request)
    {
        $tasks = Task::with(['creator', 'assignee'])
            ->where('created_by', $request->user()->id)
            ->orWhere('assigned_to', $request->user()->id)
            ->get();

        return response()->json($tasks);
    }

    // ✅ Toutes les tâches pour l'admin
    public function adminIndex(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $tasks = Task::with(['creator', 'assignee'])->get();
        return response()->json($tasks);
    }

    // Créer une tâche
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,done',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id'
        ]);

        $task = Task::create(array_merge($validated, [
            'created_by' => $request->user()->id
        ]));

        return response()->json($task, 201);
    }

    // Voir une tâche spécifique
    public function show(Request $request, Task $task)
    {
        if ($task->created_by !== $request->user()->id && $task->assigned_to !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $task->load(['creator', 'assignee']);
        return response()->json($task);
    }

    // Mettre à jour une tâche (créateur, admin OU utilisateur assigné pour le statut)
    public function update(Request $request, Task $task)
    {
        $user = $request->user();
        
        // Vérifier les permissions de base
        $isCreatorOrAdmin = $task->created_by === $user->id || $user->role === 'admin';
        $isAssignedUser = $task->assigned_to === $user->id;
        
        // Si l'utilisateur est seulement assigné (pas admin/créateur)
        if ($isAssignedUser && !$isCreatorOrAdmin) {
            // Autoriser uniquement la modification du statut
            if ($request->hasAny(['title', 'description', 'priority', 'due_date', 'assigned_to'])) {
                return response()->json([
                    'error' => 'Vous ne pouvez modifier que le statut de cette tâche'
                ], 403);
            }
            
            // Valider seulement le statut
            $validated = $request->validate([
                'status' => 'required|in:todo,in_progress,done'
            ]);
        } 
        // Si admin ou créateur, autoriser toutes les modifications
        else if ($isCreatorOrAdmin) {
            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'sometimes|required|in:todo,in_progress,done',
                'priority' => 'sometimes|required|in:low,medium,high',
                'due_date' => 'nullable|date',
                'assigned_to' => 'nullable|exists:users,id'
            ]);
        }
        // Si aucune permission
        else {
            return response()->json(['error' => 'Vous n\'êtes pas autorisé à modifier cette tâche'], 403);
        }

        $task->update($validated);
        return response()->json($task);
    }

    // Supprimer une tâche (seul le créateur ou admin)
    public function destroy(Request $request, Task $task)
    {
        if ($task->created_by !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['error' => 'Seul le créateur ou l\'admin peut supprimer cette tâche'], 403);
        }

        $task->delete();
        return response()->json(['message' => 'Tâche supprimée']);
    }

    // Assigner une tâche (seul le créateur ou admin)
    public function assign(Request $request, Task $task)
    {
        if ($task->created_by !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['error' => 'Seul le créateur ou l\'admin peut assigner cette tâche'], 403);
        }

        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id'
        ]);

        $task->assigned_to = $validated['assigned_to'];
        $task->save();

        return response()->json($task);
    }
}