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
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();                        // Identifiant unique de la tâche
        $table->string('title');             // Titre de la tâche
        $table->text('description')->nullable(); // Description (optionnelle)
        $table->enum('status', ['todo', 'in_progress', 'done'])->default('todo'); // Statut
        $table->enum('priority', ['low', 'medium', 'high'])->default('medium');   // Priorité
        $table->dateTime('due_date')->nullable(); // Date limite
        $table->foreignId('created_by')->constrained('users')->onDelete('cascade'); // Créateur
        $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null'); // Assigné à
        $table->timestamps();                // created_at et updated_at
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
