#!/usr/bin/env bash

# Install dependencies
composer install --optimize-autoloader --no-dev

# Optimize Laravel
php artisan optimize:clear
php artisan optimize
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Set permissions
chmod -R 775 storage bootstrap/cache