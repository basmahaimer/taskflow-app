import React, { useState } from "react";

const RegisterForm = ({ onSubmit, error }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, password, password_confirmation: passwordConfirmation });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg w-96"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte</h2>

      {error && (
        <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{error}</div>
      )}

      <input
        type="text"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />

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

      <input
        type="password"
        placeholder="Confirmer le mot de passe"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        S’inscrire
      </button>
      <p className="mt-4 text-center">
             Déjà un compte ?{" "}
    <a href="/" className="text-blue-600 hover:underline">
        Se connecter
  </a>
</p>

    </form>
  );
};

export default RegisterForm;
