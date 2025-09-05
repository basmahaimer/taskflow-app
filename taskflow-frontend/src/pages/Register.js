import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    password_confirmation: "" 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await api.post("/register", formData);

      localStorage.setItem("token", res.data.access_token);

      const userRes = await api.get("/user");
      const userRole = userRes.data.role;

      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>Inscription</h1>
          <p>Rejoignez TaskFlow</p>
        </div>
        
        {error && <p className="error-msg">{error}</p>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <input
              type="text"
              name="name"
              placeholder="Nom complet"
              value={formData.name}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>
          
          <div className="auth-form-group">
            <input
              type="email"
              name="email"
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>
          
          <div className="auth-form-group">
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>
          
          <div className="auth-form-group">
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirmer le mot de passe"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Inscription..." : "Créer un compte"}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Déjà un compte ? <Link to="/" className="auth-link">Se connecter</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;