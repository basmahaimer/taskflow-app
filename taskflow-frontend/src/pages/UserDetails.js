import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Navbar";
import api from "../services/api";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [createdTasks, setCreatedTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await api.get(`/admin/users/${id}/details`);
        console.log("Données utilisateur:", res.data);
        
        setUser(res.data);
        
        // Charger les tâches même si les relations ne sont pas présentes
        setCreatedTasks(res.data.tasks_assigned_by || []);
        setAssignedTasks(res.data.tasks_assigned_to || []);
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur détaillée:", err);
        setError(
          err.response?.status === 404
            ? "Utilisateur non trouvé."
            : "Impossible de charger les informations de l'utilisateur."
        );
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [id]);

  // Fonction pour normaliser les classes CSS
  const normalizeForCss = (str) => {
    return str ? str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : '';
  };

  // Fonction pour formater le texte
  const formatText = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).replace(/_/g, ' ');
  };

  if (loading) return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des informations...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="layout">
      <Sidebar />
      <div className="content text-center">
        <p className="error-msg">{error}</p>
        <button className="btn btn-outline" onClick={() => navigate("/admin/users")}>
          ← Retour à la liste
        </button>
      </div>
    </div>
  );

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <div className="user-header">
          <div className="user-avatar-large">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h1 className="page-title">{user?.name}</h1>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>

        <div className="info-card">
          <h2 className="info-card-title">Informations personnelles</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Rôle</span>
              <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Date d'inscription</span>
              <span className="info-value">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : "-"}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">ID Utilisateur</span>
              <span className="info-value user-id">{user?.id}</span>
            </div>
          </div>
        </div>

        <div className="tasks-container">
          <div className="task-section">
            <div className="section-header">
              <h2>Tâches créées par {user?.name}</h2>
              <span className="badge count-badge">{createdTasks.length}</span>
            </div>
            {createdTasks.length > 0 ? (
              <div className="tasks-grid">
                {createdTasks.map((task) => (
                  <div key={task.id} className="task-card">
                    <h3 className="task-title">{task.title}</h3>
                    <div className="task-meta">
                      <span className={`status-badge status-${normalizeForCss(task.status)}`}>
                        {formatText(task.status)}
                      </span>
                      <span className={`priority-badge priority-${normalizeForCss(task.priority)}`}>
                        {formatText(task.priority)}
                      </span>
                    </div>
                    <p className="task-assignee">
                      <strong>Assigné à:</strong> {task.assignee?.name || "Non assigné"}
                    </p>
                    <p className="task-date">
                      <strong>Créé le:</strong> {new Date(task.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    {task.due_date && (
                      <p className="task-date">
                        <strong>Échéance:</strong> {new Date(task.due_date).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    {task.description && (
                      <p className="task-description">
                        <strong>Description:</strong> {task.description.length > 100 
                          ? `${task.description.substring(0, 100)}...` 
                          : task.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>Aucune tâche créée par cet utilisateur.</p>
              </div>
            )}
          </div>

          <div className="task-section">
            <div className="section-header">
              <h2>Tâches assignées à {user?.name}</h2>
              <span className="badge count-badge">{assignedTasks.length}</span>
            </div>
            {assignedTasks.length > 0 ? (
              <div className="tasks-grid">
                {assignedTasks.map((task) => (
                  <div key={task.id} className="task-card">
                    <h3 className="task-title">{task.title}</h3>
                    <div className="task-meta">
                      <span className={`status-badge status-${normalizeForCss(task.status)}`}>
                        {formatText(task.status)}
                      </span>
                      <span className={`priority-badge priority-${normalizeForCss(task.priority)}`}>
                        {formatText(task.priority)}
                      </span>
                    </div>
                    <p className="task-assignee">
                      <strong>Créé par:</strong> {task.creator?.name || "Utilisateur inconnu"}
                    </p>
                    <p className="task-date">
                      <strong>Assigné le:</strong> {new Date(task.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    {task.due_date && (
                      <p className="task-date">
                        <strong>Échéance:</strong> {new Date(task.due_date).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    {task.description && (
                      <p className="task-description">
                        <strong>Description:</strong> {task.description.length > 100 
                          ? `${task.description.substring(0, 100)}...` 
                          : task.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>Aucune tâche assignée à cet utilisateur.</p>
              </div>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="btn button-primary"
            onClick={() => navigate(`/admin/users/${user?.id}/edit`)}
          >
            ✏️ Modifier l'utilisateur
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate("/admin/users")}
          >
            ← Retour à la liste
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;