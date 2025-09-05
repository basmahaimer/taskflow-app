import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardUser from "./pages/DashboardUser";
import DashboardAdmin from "./pages/DashboardAdmin"; // nouvelle page avec cartes
import GestionUsers from "./pages/GestionUsers";       // liste utilisateurs
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import UserDetails from "./pages/UserDetails";
import AdminTasks from "./pages/AdminTasks";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardUser />} />
        <Route path="/admin" element={<DashboardAdmin />} />  {/* page cartes */}
        <Route path="/admin/users" element={<GestionUsers />} />  {/* liste utilisateurs */}
        <Route path="/admin/add-user" element={<AddUser />} />
        <Route path="/admin/edit-user/:id" element={<EditUser />} />
        <Route path="/admin/user/:id" element={<UserDetails />} />
        <Route path="/admin/tasks" element={<AdminTasks />} />
      </Routes>
    </Router>
  );
}

export default App;
