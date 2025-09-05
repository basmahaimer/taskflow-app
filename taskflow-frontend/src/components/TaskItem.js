import React from "react";

const TaskItem = ({ task, onStatusChange, onEdit, onDelete }) => {
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case "high":
        return { color: "bg-red-100 border-red-300 text-red-800", icon: "🔥", label: "High" };
      case "medium":
        return { color: "bg-yellow-100 border-yellow-300 text-yellow-800", icon: "⚠️", label: "Medium" };
      case "low":
        return { color: "bg-green-100 border-green-300 text-green-800", icon: "💤", label: "Low" };
      default:
        return { color: "bg-gray-100 border-gray-300 text-gray-800", icon: "📋", label: priority };
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "todo":
        return { color: "bg-gray-100 border-gray-300 text-gray-800", icon: "⏳", label: "À faire" };
      case "in_progress":
        return { color: "bg-blue-100 border-blue-300 text-blue-800", icon: "🚀", label: "En cours" };
      case "done":
        return { color: "bg-green-100 border-green-300 text-green-800", icon: "✅", label: "Terminé" };
      default:
        return { color: "bg-gray-100 border-gray-300 text-gray-800", icon: "📋", label: status };
    }
  };

  const getNextActionLabel = (status) => {
    switch (status) {
      case "todo": return "Commencer";
      case "in_progress": return "Terminer";
      case "done": return "Réouvrir";
      default: return "Changer";
    }
  };

  const priorityInfo = getPriorityInfo(task.priority);
  const statusInfo = getStatusInfo(task.status);

  return (
    <div className="task-card">
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
        
        {task.assigned_to_name && task.assigned_to_name !== "Moi-même" && (
          <span className="task-assignee">
            👤 {task.assigned_to_name}
          </span>
        )}
      </div>
      
      <div className="task-actions">
        <button
          onClick={() => onStatusChange(task.id, task.status)}
          className="btn btn-sm btn-primary"
          title={getNextActionLabel(task.status)}
        >
          {getNextActionLabel(task.status)}
        </button>
        
        <button
          onClick={() => onEdit(task)}
          className="btn btn-sm btn-outline"
          title="Modifier"
        >
          ✏️
        </button>
        
        <button
          onClick={() => onDelete(task.id)}
          className="btn btn-sm btn-danger"
          title="Supprimer"
        >
          🗑️
        </button>
      </div>

      <style jsx>{`
        .task-card {
          background: white;
          padding: 20px;
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
          margin-bottom: 12px;
        }
        
        .task-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          margin: 0;
          flex: 1;
          line-height: 1.4;
        }
        
        .priority-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid;
          white-space: nowrap;
        }
        
        .task-description {
          color: var(--muted);
          margin: 0 0 16px 0;
          line-height: 1.5;
          font-size: 14px;
        }
        
        .task-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
          align-items: center;
        }
        
        .status-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid;
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
          justify-content: flex-end;
        }
        
        @media (max-width: 768px) {
          .task-header {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
          
          .task-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
          
          .task-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskItem;