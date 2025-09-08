// src/components/UserSidebar.js
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaHome, FaBars } from "react-icons/fa";
import api from "../services/api";

const UserSidebar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user");
        setUser(res.data);
      } catch {}
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <button className="hamburger" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
        <FaBars />
      </button>

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">TaskFlow</h2>
          {user && (
            <p style={{ color: "rgba(255,255,255,0.85)", marginTop: 6, fontSize: 13 }}>
              {user.name} — {user.role}
            </p>
          )}
        </div>

        <nav className="menu">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            <FaHome /> Tableau de bord
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Déconnexion
          </button>
        </div>
      </aside>

      <div className={`overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
    </>
  );
};

export default UserSidebar;