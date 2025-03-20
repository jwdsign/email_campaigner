<?php
require 'vendor/autoload.php'; // PHPMailer via Composer in build/
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Adjust for production
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Load SMTP configuration
$configFile = __DIR__ . '/config.json';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Configuration file not found']);
    exit;
}

$config = json_decode(file_get_contents($configFile), true);
if (!$config || !isset($config['smtp'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid configuration']);
    exit;
}

$smtpConfig = $config['smtp'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['userFirstname']) || !isset($data['userLastname']) || 
    !isset($data['userEmail']) || !isset($data['recipientEmail']) || !isset($data['template'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$mail = new PHPMailer(true);
try {
    // SMTP Configuration from config.json
    $mail->isSMTP();
    $mail->Host = $smtpConfig['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $smtpConfig['username'];
    $mail->Password = $smtpConfig['password'];
    $mail->SMTPSecure = $smtpConfig['encryption'] === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = $smtpConfig['port'];

    // Email details
    $mail->setFrom($data['userEmail'], "{$data['userFirstname']} {$data['userLastname']}");
    $mail->addAddress($data['recipientEmail']);
    $mail->Subject = "Message from {$data['userFirstname']} {$data['userLastname']}";
    $mail->Body = $data['template'];
    $mail->isHTML(true);

    $mail->send();
    echo json_encode(['message' => 'Email sent successfully']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => "Failed to send email: {$mail->ErrorInfo}"]);
}