import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Navbar";
import api from "../services/api";

const EditUser = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/users/${id}`);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          password: "",
          role: res.data.role || "user",
        });
      } catch {
        setError("Impossible de charger les informations de l'utilisateur.");
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${id}`, form);
      setSuccess("✅ Utilisateur mis à jour avec succès !");
      setError("");
      setTimeout(() => navigate("/admin/users"), 1200);
    } catch {
      setError("❌ Erreur lors de la mise à jour de l'utilisateur.");
      setSuccess("");
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <h1 className="page-title text-center mb-6">
          Modifier l'utilisateur
        </h1>
        
        <div className="form-center-container">
          <form
            onSubmit={handleSubmit}
            className="form-box"
          >
            {error && <div className="error-msg mb-4 text-center">{error}</div>}
            {success && (
              <div className="text-green-600 font-semibold mb-4 text-center">
                {success}
              </div>
            )}

            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Nom complet"
                value={form.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Adresse email"
                value={form.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Nouveau mot de passe (laisser vide pour ne pas changer)"
                value={form.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <select 
                name="role" 
                value={form.role} 
                onChange={handleChange}
                className="form-input"
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="btn btn-outline"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn button-primary"
              >
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;