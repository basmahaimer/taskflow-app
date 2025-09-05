import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Navbar";
import api from "../services/api";

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/admin/tasks"); // 🔥 route admin
        setTasks(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur chargement tâches:", err);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="content text-center py-8">Chargement des tâches...</div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <h1 className="page-title">Toutes les tâches</h1>

        <table className="task-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Créée par</th>
              <th>Assignée à</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                onClick={() => navigate(`/tasks/${task.id}`)}
                className="clickable"
              >
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.creator?.name || "—"}</td>
                <td>{task.assignee?.name || "—"}</td>
                <td>{task.status}</td>
                <td>{task.priority}</td>
                <td>{new Date(task.created_at).toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style >{`
        .task-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .task-table th,
        .task-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .task-table th {
          background: #f9fafb;
          font-weight: 600;
          color: var(--violet-dark);
        }
        .clickable {
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .clickable:hover {
          background: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default AdminTasks;
