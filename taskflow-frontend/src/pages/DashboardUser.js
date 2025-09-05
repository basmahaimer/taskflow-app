import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Navbar";

const DashboardUser = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  useEffect(() => {
    calculateStats();
    filterTasks();
  }, [tasks, selectedPriority, selectedStatus]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      setError("Impossible de charger vos tâches.");
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur chargement users:", err);
    }
  };

  const calculateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "done").length;
    const inProgress = tasks.filter(t => t.status === "in_progress").length;
    const todo = tasks.filter(t => t.status === "todo").length;
    
    setStats({ total, completed, inProgress, todo });
  };

  const filterTasks = () => {
    let filtered = tasks;
    
    if (selectedPriority !== "all") {
      filtered = filtered.filter(t => t.priority === selectedPriority);
    }
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter(t => t.status === selectedStatus);
    }
    
    setFilteredTasks(filtered);
  };

  const handleStatusChange = async (id, currentStatus) => {
    const statusOrder = ["todo", "in_progress", "done"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const newStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    
    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      setError("Erreur lors du changement d'état.");
      console.error("Erreur détaillée:", err.response?.data);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      try {
        await api.delete(`/tasks/${id}`);
        setTasks(tasks.filter(t => t.id !== id));
      } catch {
        setError("Erreur lors de la suppression.");
      }
    }
  };

  const handleFormSubmit = async (taskData) => {
    try {
      if (editingTask) {
        const res = await api.put(`/tasks/${editingTask.id}`, taskData);
        setTasks(tasks.map(t => t.id === editingTask.id ? res.data : t));
      } else {
        const res = await api.post("/tasks", taskData);
        setTasks([...tasks, res.data]);
      }
      setShowForm(false);
      setEditingTask(null);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la sauvegarde.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case "high": return { color: "priority-high", icon: "🔥", label: "Haute" };
      case "medium": return { color: "priority-medium", icon: "⚠️", label: "Moyenne" };
      case "low": return { color: "priority-low", icon: "💤", label: "Basse" };
      default: return { color: "priority-default", icon: "📋", label: priority };
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "todo": return { color: "status-todo", icon: "⏳", label: "À faire" };
      case "in_progress": return { color: "status-progress", icon: "🚀", label: "En cours" };
      case "done": return { color: "status-done", icon: "✅", label: "Terminé" };
      default: return { color: "status-default", icon: "📋", label: status };
    }
  };

  if (loading) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement de vos tâches...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      
      <div className="content">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Mes Tâches</h1>
            <p className="dashboard-subtitle">Gérez votre productivité</p>
          </div>
          
          <button
            onClick={() => { setShowForm(true); setEditingTask(null); }}
            className="btn button-primary"
          >
            ➕ Nouvelle Tâche
          </button>
        </div>

        {/* Statistiques */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Tâches totales</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.completed}</h3>
              <p>Terminées</p>
              <span className="stat-change">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <h3>{stats.inProgress}</h3>
              <p>En cours</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{stats.todo}</h3>
              <p>À faire</p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Priorité:</label>
            <select 
              value={selectedPriority} 
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="filter-select"
            >
              <option value="all">Toutes</option>
              <option value="high">🔥 Haute</option>
              <option value="medium">⚠️ Moyenne</option>
              <option value="low">💤 Basse</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Statut:</label>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tous</option>
              <option value="todo">⏳ À faire</option>
              <option value="in_progress">🚀 En cours</option>
              <option value="done">✅ Terminé</option>
            </select>
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {/* Grille des tâches */}
        <div className="tasks-grid">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => {
              const priorityInfo = getPriorityInfo(task.priority);
              const statusInfo = getStatusInfo(task.status);
              
              return (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <span className={`priority-badge ${priorityInfo.color}`}>
                      {priorityInfo.icon} {priorityInfo.label}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  
                  <div className="task-meta">
                    <span className={`status-badge ${statusInfo.color}`}>
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                    
                    {task.due_date && (
                      <span className="task-date">
                        📅 {new Date(task.due_date).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                    
                    {task.assigned_to && task.assignee && (
                      <span className="task-assignee">
                        👤 {task.assignee.name}
                      </span>
                    )}
                  </div>
                  
                  <div className="task-actions">
                    <button
                      onClick={() => handleStatusChange(task.id, task.status)}
                      className="btn btn-sm btn-primary"
                    >
                      {task.status === "todo" ? "Commencer" : task.status === "in_progress" ? "Terminer" : "Réouvrir"}
                    </button>
                    
                    <button
                      onClick={() => handleEdit(task)}
                      className="btn btn-sm btn-outline"
                    >
                      ✏️
                    </button>
                    
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="btn btn-sm btn-danger"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Aucune tâche trouvée</h3>
              <p>{selectedPriority !== "all" || selectedStatus !== "all" 
                ? "Essayez de modifier vos filtres" 
                : "Commencez par créer votre première tâche !"}</p>
            </div>
          )}
        </div>

        {/* Modal de formulaire */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{editingTask ? "Modifier la tâche" : "Nouvelle tâche"}</h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleFormSubmit({
                  title: formData.get('title'),
                  description: formData.get('description'),
                  priority: formData.get('priority'),
                  status: formData.get('status'),
                  due_date: formData.get('due_date'),
                  assigned_to: formData.get('assigned_to')
                });
              }}>
                <div className="form-group">
                  <input
                    type="text"
                    name="title"
                    placeholder="Titre de la tâche *"
                    defaultValue={editingTask?.title}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <textarea
                    name="description"
                    placeholder="Description"
                    defaultValue={editingTask?.description}
                    className="form-input"
                    rows="3"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <select 
                      name="priority" 
                      defaultValue={editingTask?.priority || "medium"}
                      className="form-input"
                    >
                      <option value="low">💤 Priorité basse</option>
                      <option value="medium">⚠️ Priorité moyenne</option>
                      <option value="high">🔥 Priorité haute</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <select 
                      name="status" 
                      defaultValue={editingTask?.status || "todo"}
                      className="form-input"
                    >
                      <option value="todo">⏳ À faire</option>
                      <option value="in_progress">🚀 En cours</option>
                      <option value="done">✅ Terminé</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <input
                    type="date"
                    name="due_date"
                    placeholder="Date d'échéance"
                    defaultValue={editingTask?.due_date}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <select 
                    name="assigned_to" 
                    defaultValue={editingTask?.assigned_to || ""}
                    className="form-input"
                  >
                    <option value="">👤 Moi-même</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} {user.role === 'admin' ? '(Admin)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-outline"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="btn button-primary"
                  >
                    {editingTask ? "Modifier" : "Créer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .layout {
          background: linear-gradient(135deg, var(--violet) 0%, var(--violet-dark) 100%);
          min-height: 100vh;
        }
        
        .content {
          background: var(--bg);
          border-radius: 24px;
          margin: 20px;
          padding: 24px;
          min-height: calc(100vh - 40px);
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        
        .dashboard-subtitle {
          color: var(--muted);
          margin-top: 8px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        
        .stat-card {
          background: var(--white);
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .stat-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
        }
        
        .stat-content h3 {
          font-size: 28px;
          font-weight: 800;
          color: var(--violet);
          margin: 0 0 4px 0;
        }
        
        .stat-content p {
          color: var(--muted);
          margin: 0 0 8px 0;
          font-weight: 600;
        }
        
        .stat-change {
          background: var(--violet);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .filters-section {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
          padding: 20px;
          background: var(--white);
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .filter-group label {
          font-weight: 600;
          color: var(--text);
        }
        
        .filter-select {
          padding: 10px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
        }
        
        .tasks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }
        
        .task-card {
          background: var(--white);
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }
        
        .task-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }
        
        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .task-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          margin: 0;
          flex: 1;
        }
        
        .priority-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .priority-high {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .priority-medium {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
        
        .priority-low {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        .task-description {
          color: var(--muted);
          margin: 0 0 20px 0;
          line-height: 1.5;
        }
        
        .task-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        
        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .status-todo {
          background: rgba(156, 163, 175, 0.1);
          color: #6b7280;
          border: 1px solid rgba(156, 163, 175, 0.2);
        }
        
        .status-progress {
          background: rgba(59, 130, 246, 0.1);
          color: #2563eb;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .status-done {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        .task-date, .task-assignee {
          font-size: 12px;
          color: var(--muted);
          padding: 4px 8px;
          background: #f8fafc;
          border-radius: 12px;
        }
        
        .task-actions {
          display: flex;
          gap: 8px;
        }
        
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: var(--muted);
        }
        
        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }
        
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
          background: var(--white);
          padding: 32px;
          border-radius: 20px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        .modal-content h2 {
          margin: 0 0 24px 0;
          color: var(--text);
          text-align: center;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: var(--violet-medium);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }
        
        @media (max-width: 768px) {
          .content {
            margin: 10px;
            padding: 16px;
          }
          
          .dashboard-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .filters-section {
            flex-direction: column;
          }
          
          .tasks-grid {
            grid-template-columns: 1fr;
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

export default DashboardUser;