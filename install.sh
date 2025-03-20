#!/bin/bash

# Exit on any error
set -e

# Check for Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

# Check for npm
if ! command -v npm >/dev/null 2>&1; then
    echo "Error: npm is not installed. Please install it with Node.js."
    exit 1
fi

# Check for PHP
if ! command -v php >/dev/null 2>&1; then
    echo "Error: PHP is not installed. Please install it from https://www.php.net/"
    exit 1
fi

# Check for Composer
if ! command -v composer >/dev/null 2>&1; then
    echo "Error: Composer is not installed. Please install it from https://getcomposer.org/"
    exit 1
fi

echo "Installing Node.js dependencies..."
npm install

echo "Installing PHP dependencies (PHPMailer)..."
composer require phpmailer/phpmailer

echo "Converting data files..."
npm run convert-all

echo "Building the app..."
npm run build

echo "Installation complete! The build/ folder is ready for deployment."
echo "Please ensure public/config.json is configured with your SMTP details."