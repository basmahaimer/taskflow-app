# Utilise PHP 8.2 avec Apache
FROM php:8.2-apache

# Installer extensions nécessaires
RUN docker-php-ext-install pdo pdo_sqlite

# Installer Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copier le code de Laravel
WORKDIR /var/www/html
COPY . .

# Donner accès aux dossiers nécessaires
RUN chmod -R 775 storage bootstrap/cache

# Installer les dépendances Laravel
RUN composer install --no-dev --optimize-autoloader

# Lancer les migrations + seed puis le serveur
CMD php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=$PORT
