import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Navbar";

const GestionUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
        setFilteredUsers(res.data);
        setLoading(false);
      } catch {
        setError("Impossible de charger les utilisateurs.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } catch {
        setError("Erreur lors de la suppression.");
      }
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <h1 className="page-title text-center mb-6">
          Gestion des utilisateurs
        </h1>
        
        {/* Header avec recherche et bouton d'ajout */}
        <div className="table-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <button
            className="btn button-primary add-btn"
            onClick={() => navigate("/admin/add-user")}
          >
            ➕ Ajouter un utilisateur
          </button>
        </div>

        {error && <p className="error-msg text-center">{error}</p>}

        <div className="table-wrapper">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Chargement des utilisateurs...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <table className="modern-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="table-row">
                    <td className="user-id">{user.id}</td>
                    
                    {/* Clique sur le nom pour voir les détails */}
                    <td
                      className="user-name cursor-pointer text-blue-600 hover:underline"
                      onClick={() => navigate(`/admin/user/${user.id}`)}
                    >
                      {user.name}
                    </td>

                    <td className="user-email">{user.email}</td>
                    <td>
                      <span
                        className={
                          user.role === "admin" 
                            ? "badge badge-admin" 
                            : "badge badge-user"
                        }
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate(`/admin/edit-user/${user.id}`)}
                        title="Modifier l'utilisateur"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(user.id)}
                        title="Supprimer l'utilisateur"
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">
              <div className="no-data-icon">👥</div>
              <h3>Aucun utilisateur trouvé</h3>
              <p>{searchTerm ? "Aucun résultat pour votre recherche." : "Commencez par ajouter un utilisateur."}</p>
              {searchTerm && (
                <button
                  className="btn btn-outline"
                  onClick={() => setSearchTerm("")}
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionUsers;
