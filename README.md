# 📋 TaskFlow - Application de Gestion des Tâches

![Laravel](https://img.shields.io/badge/Laravel-10-FF2D20?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)

**TaskFlow** est une application complète de gestion des tâches conçue pour les équipes, permettant une organisation efficace du travail avec une interface intuitive et des fonctionnalités avancées.

## ✨ Fonctionnalités Principales

### 👤 Espace Utilisateur
- **Authentification sécurisée** avec tokens Sanctum
- **Tableau de bord personnel** avec statistiques des tâches
- **Gestion complète des tâches** (création, modification, suppression)
- **Système de statuts** (À faire → En cours → Terminé)
- **Assignation flexible** (à soi-même ou aux autres utilisateurs)
- **Filtres avancés** par priorité et statut

### 👑 Espace Administrateur
- **Gestion centralisée des utilisateurs**
- **Tableau de bord administratif** complet
- **Création et modification** des comptes utilisateurs
- **Supervision** de l'ensemble des activités

## 🛠️ Architecture Technique

```
taskflow-app/
├── 📁 backend/          # API Laravel 10 + Sanctum
│   ├── app/
│   │   ├── Models/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Middleware/
│   │   └── Policies/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
└── 📁 frontend/         # Application React
    ├── src/
    │   ├── components/  # Composants réutilisables
    │   ├── pages/       # Pages de l'application
    │   ├── services/    # Configuration API
    │   └── styles/      # Feuilles de style
    └── public/
```

## 🚀 Installation Locale

### Prérequis
- **PHP** 8.1 ou supérieur
- **Composer** 
- **Node.js** 16+ et npm
- **MySQL** 5.7+ ou MariaDB
- **Git**

### 1. Cloner le projet
```bash
git clone https://github.com/basmahaimer/taskflow-app.git
cd taskflow-app
```

### 2. Configuration du Backend (Laravel)
```bash
# Installation des dépendances PHP
cd backend
composer install

# Configuration de l'environnement
cp .env.example .env

# Génération de la clé d'application
php artisan key:generate

# Configuration de la base de données
# Éditez le fichier .env avec vos paramètres :
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=taskflow_db
DB_USERNAME=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe

# Migration et seeding de la base
php artisan migrate --seed

# Installation de Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate

# Démarrage du serveur
php artisan serve
```
📌 Le serveur API sera disponible sur http://localhost:8000

### 3. Configuration du Frontend (React)
```bash
# Installation des dépendances JavaScript
cd ../frontend
npm install

# Configuration de l'URL API
# Vérifiez que REACT_APP_API_URL pointe vers votre backend
# Dans le fichier .env ou .env.local :
REACT_APP_API_URL=http://localhost:8000

# Démarrage de l'application
npm start
```
📌 L'application sera disponible sur http://localhost:3000

## 🔐 Comptes de Test

Après le seeding, ces comptes sont disponibles :

### Administrateur
- **Email:** admin@taskflow.com
- **Mot de passe:** password
- **Accès:** Dashboard complet + gestion utilisateurs

### Utilisateur Standard
- **Email:** user@taskflow.com  
- **Mot de passe:** password
- **Accès:** Gestion de ses tâches uniquement

## 📡 API Endpoints

### Authentification
- `POST /api/register` - Création de compte
- `POST /api/login` - Connexion et obtention du token
- `POST /api/logout` - Déconnexion

### Tâches (Protégé par auth:sanctum)
- `GET /api/tasks` - Liste des tâches de l'utilisateur
- `POST /api/tasks` - Création d'une nouvelle tâche
- `GET /api/tasks/{id}` - Détails d'une tâche
- `PUT /api/tasks/{id}` - Modification d'une tâche
- `DELETE /api/tasks/{id}` - Suppression d'une tâche
- `PUT /api/tasks/{id}/status` - Changement de statut

### Administration (Middleware admin)
- `GET /api/admin/users` - Liste des utilisateurs
- `POST /api/admin/users` - Création d'utilisateur
- `PUT /api/admin/users/{id}` - Modification d'utilisateur
- `DELETE /api/admin/users/{id}` - Suppression d'utilisateur

## 🚦 Déploiement en Production

### Options Recommandées
- **Frontend:** Vercel, Netlify ou GitHub Pages
- **Backend:** Heroku, DigitalOcean ou Render
- **Base de données:** MySQL, PostgreSQL ou SQLite

### Variables d'environnement critiques
```env
# Backend
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com

# Frontend  
REACT_APP_API_URL=https://votre-api.com
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/ma-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout ma fonctionnalité'`)
4. Push sur la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs Laravel (`storage/logs/laravel.log`)
2. Consultez les issues GitHub existantes
3. Créez une nouvelle issue avec des détails complets

## 🌟 Remerciements

Développé avec passion en utilisant les technologies modernes pour offrir une expérience utilisateur optimale.

---

**TaskFlow** - Organisez votre travail, boostez votre productivité ! 🚀

*Développé par [Basma Haimer](https://github.com/basmahaimer)*
