import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import UserSidebar from "../components/UserSidebar";
import "../styles/DashboardUser.css";

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
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchCurrentUser();
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
      const nonAdminUsers = res.data.filter(user => user.role !== 'admin');
      setUsers(nonAdminUsers);
    } catch (err) {
      console.error("Erreur chargement users:", err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/user");
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Erreur chargement user:", err);
    }
  };

  const getTaskPermissions = (task) => {
    if (!currentUser || !task) {
      return { canChangeStatus: false, canEdit: false, canDelete: false };
    }

    const isAdmin = currentUser.role === 'admin';
    const isCreator = task.created_by === currentUser.id;
    const isAssignedToMe = task.assigned_to === currentUser.id;
    
    return {
      canChangeStatus: isAdmin || isCreator || isAssignedToMe,
      canEdit: isAdmin || isCreator,
      canDelete: isAdmin || isCreator
    };
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
      if (err.response?.status === 403) {
        setError("Vous n'êtes pas autorisé à modifier cette tâche.");
      } else {
        setError("Erreur lors du changement d'état.");
      }
      console.error("Erreur détaillée:", err.response?.data);
    }
  };

  const handleEdit = (task) => {
    const permissions = getTaskPermissions(task);
    if (!permissions.canEdit) {
      setError("Vous n'êtes pas autorisé à modifier cette tâche.");
      return;
    }
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const task = tasks.find(t => t.id === id);
    const permissions = getTaskPermissions(task);
    
    if (!permissions.canDelete) {
      setError("Vous n'êtes pas autorisé à supprimer cette tâche.");
      return;
    }

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      try {
        await api.delete(`/tasks/${id}`);
        setTasks(tasks.filter(t => t.id !== id));
      } catch (err) {
        if (err.response?.status === 403) {
          setError("Vous n'êtes pas autorisé à supprimer cette tâche.");
        } else {
          setError("Erreur lors de la suppression.");
        }
        console.error("Erreur détaillée:", err.response?.data);
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
        <UserSidebar />
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
      <UserSidebar />
      
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
              const permissions = getTaskPermissions(task);
              
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
                    {permissions.canChangeStatus && (
                      <button
                        onClick={() => handleStatusChange(task.id, task.status)}
                        className="btn btn-sm btn-primary"
                      >
                        {task.status === "todo" ? "Commencer" : task.status === "in_progress" ? "Terminer" : "Réouvrir"}
                      </button>
                    )}
                    
                    {permissions.canEdit && (
                      <button
                        onClick={() => handleEdit(task)}
                        className="btn btn-sm btn-outline"
                      >
                        ✏️
                      </button>
                    )}
                    
                    {permissions.canDelete && (
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="btn btn-sm btn-danger"
                      >
                        🗑️
                      </button>
                    )}

                    {/* Message si l'utilisateur est assigné mais ne peut que changer le statut */}
                    {task.assigned_to === currentUser?.id && 
                     !permissions.canEdit && 
                     permissions.canChangeStatus && (
                      <span className="text-muted">Modification limitée</span>
                    )}

                    {/* Message pour lecture seule */}
                    {!permissions.canChangeStatus && !permissions.canEdit && !permissions.canDelete && (
                      <span className="text-muted">Lecture seule</span>
                    )}
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
                        {user.name}
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
    </div>
  );
};

export default DashboardUser;