import React, { useState } from "react";

const LoginForm = ({ onSubmit, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg w-96"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Se connecter</h2>

      {error && (
        <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{error}</div>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Connexion
      </button>

      <p className="mt-4 text-center">
        Pas encore de compte ?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          S’inscrire
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
