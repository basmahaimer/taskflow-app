import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Navbar";
import api from "../services/api";

const AddUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/users", form);
      setSuccess("✅ Utilisateur ajouté avec succès !");
      setError("");
      setTimeout(() => navigate("/admin/users"), 1200);
    } catch {
      setError("❌ Erreur lors de l'ajout de l'utilisateur.");
      setSuccess("");
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <h1 className="page-title text-center mb-6">
          Ajouter un utilisateur
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
                placeholder="Mot de passe"
                value={form.password}
                onChange={handleChange}
                required
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
                Créer l'utilisateur
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;