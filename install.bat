@echo off

REM Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed. Please install it from https://nodejs.org/
    exit /b 1
)

REM Check for npm
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: npm is not installed. Please install it with Node.js.
    exit /b 1
)

REM Check for PHP
where php >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: PHP is not installed. Please install it from https://www.php.net/
    exit /b 1
)

REM Check for Composer
where composer >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Composer is not installed. Please install it from https://getcomposer.org/
    exit /b 1
)

echo Installing Node.js dependencies...
call npm install

echo Installing PHP dependencies (PHPMailer)...
call composer require phpmailer/phpmailer

echo Converting data files...
call npm run convert-all

echo Building the app...
call npm run build

echo Installation complete! The build/ folder is ready for deployment.
echo Please ensure public/config.json is configured with your SMTP details.
pause