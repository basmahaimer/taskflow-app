import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const res = await api.post("/login", formData);

      if (!res.data.access_token) {
        setError("Aucun token reçu du backend.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.data.access_token);

      const userRes = await api.get("/user");
      const userRole = userRes.data.role;

      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>Connexion</h1>
          <p>Bienvenue sur TaskFlow</p>
        </div>
        
        {error && <p className="error-msg">{error}</p>}
        
        <form onSubmit={handleSubmit} className="auth-form">
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
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Pas encore de compte ? <Link to="/register" className="auth-link">Créer un compte</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;