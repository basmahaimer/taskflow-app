import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Navbar";
import api from "../services/api";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const adminUsers = users.filter(user => user.role === 'admin').length;
  const recentUsers = users.slice(0, 3);

  const cards = [
    { 
      title: "Gestion des utilisateurs", 
      description: "Voir et modifier les utilisateurs", 
      path: "/admin/users",
      icon: "👥"
    },
    { 
      title: "Ajouter un utilisateur", 
      description: "Créer un nouvel utilisateur", 
      path: "/admin/add-user",
      icon: "➕"
    },
    { 
      title: "Voir les tâches", 
      description: "Consulter toutes les tâches", 
      path: "/admin/tasks",
      icon: "📋"
    }
  ];

  if (loading) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="content">
          <div className="text-center py-8">
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <section className="content">
        <h1 className="page-title">Dashboard Admin</h1>
        
        <div className="stats-container">
          <div className="stat-item">
            <h3>{totalUsers}</h3>
            <p>Utilisateurs totaux</p>
          </div>
          <div className="stat-item">
            <h3>{adminUsers}</h3>
            <p>Administrateurs</p>
          </div>
          <div className="stat-item">
            <h3>0</h3>
            <p>Tâches cette semaine</p>
          </div>
        </div>

        <div className="cards-container">
          {cards.map((card, index) => (
            <div
              key={index}
              className="card"
              onClick={() => navigate(card.path)}
            >
              <div className="card-icon">{card.icon}</div>
              <div className="card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="recent-section">
          <h2>Utilisateurs récents</h2>
          <div className="recent-list">
            {recentUsers.map(user => (
              <div key={user.id} className="recent-item">
                <span className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div className="user-info">
                  <p className="user-name">{user.name}</p>
                  <p className="user-email">{user.email}</p>
                </div>
                <span className={`user-role ${user.role}`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardAdmin;