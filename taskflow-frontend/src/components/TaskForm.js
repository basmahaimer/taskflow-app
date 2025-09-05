import React, { useState, useEffect } from "react";
import api from "../services/api";

const TaskForm = ({ task = null, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "todo");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [dueDate, setDueDate] = useState(task?.due_date || "");
  const [assignedTo, setAssignedTo] = useState(task?.assigned_to || "");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Erreur fetch users :", err.response || err.message);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (!title.trim()) {
      setError("Le titre est requis.");
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        due_date: dueDate,
        assigned_to: assignedTo,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la soumission.");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "high": return "🔥 Haute";
      case "medium": return "⚠️ Moyenne";
      case "low": return "💤 Basse";
      default: return priority;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          {task ? "Modifier la tâche" : "Nouvelle tâche"}
        </h2>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Titre de la tâche *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Description (optionnel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-input"
              >
                <option value="todo">⏳ À faire</option>
                <option value="in_progress">🚀 En cours</option>
                <option value="done">✅ Terminé</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priorité</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-input"
              >
                <option value="low">💤 Basse</option>
                <option value="medium">⚠️ Moyenne</option>
                <option value="high">🔥 Haute</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date d'échéance</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Assigner à</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="form-input"
              >
                <option value="">👤 Moi-même</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.role === 'admin' ? '(Admin)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn button-primary"
              disabled={loading}
            >
              {loading ? "⏳" : ""}
              {task ? "Modifier" : "Créer la tâche"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal-content {
          background: white;
          padding: 32px;
          border-radius: 20px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 24px 0;
          text-align: center;
        }
        
        .task-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group label {
          font-weight: 600;
          color: var(--text);
          font-size: 14px;
        }
        
        .form-input {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: white;
        }
        
        .form-input:focus {
          outline: none;
          border-color: var(--violet-medium);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
        
        .form-input::placeholder {
          color: var(--muted);
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 16px;
        }
        
        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #fecaca;
        }
        
        @media (max-width: 768px) {
          .modal-content {
            padding: 24px 20px;
            margin: 10px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskForm;