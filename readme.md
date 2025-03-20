# Email Campaigner

A simple, zero-config web application built with React and PHP to generate and send personalized emails. Users can input their details, select a recipient from a list (loaded from an Excel file), customize an email template (loaded from a text file), and send emails with their email address appearing in the "From" field. The app compiles to a static build that can be deployed on any Apache or Nginx server with PHP support.

## Features
- React Frontend: Compiled to static HTML, CSS, and JS for easy deployment.
- PHP Backend: Uses PHPMailer to send emails via SMTP, setting the user's email as the "From" address.
- Data Sources:
  - Recipient list generated from an Excel file (addresses.xlsx).
  - Email template loaded from a text file (template.txt).
- WYSIWYG Editor: TinyMCE for user-friendly template editing.
- Branding: Customizable text color, background color, button color, and logo via style.config.json.
- Zero Config: Deployable on any PHP-enabled Apache/Nginx server without additional setup.

## Prerequisites
- Node.js: For building the React app (v14+ recommended).
- PHP: Required on the deployment server (v7.4+ recommended).
- Composer: For installing PHPMailer locally.
- SMTP Server: Access to an SMTP service (e.g., Gmail, SendGrid) for email sending.

## Setup Instructions

### Local Development (Windows 11 Example)
1. Install Node.js:
   - Download and install from nodejs.org.
   - Verify: node -v and npm -v.

2. Install PHP:
   - Download PHP from windows.php.net (e.g., VC16 x64 NTS).
   - Extract to C:\php.
   - Add C:\php to System PATH (System > Advanced system settings > Environment Variables).
   - Verify: php -v.

3. Install Composer:
   - Download Composer-Setup.exe from getcomposer.org.
   - Run installer, point to C:\php\php.exe, and add to PATH.
   - Verify: composer --version.

4. Clone the Repository:
   - git clone <repository-url>
   - cd email_app

5. Run the Install Script:
   - For Windows: Double-click install.bat or run install.bat in Command Prompt.
   - For Linux/macOS: Make executable with chmod +x install.sh, then run ./install.sh.
   - This installs dependencies, converts data files, and builds the app.

6. Configure SMTP:
   - Edit public/config.json with your SMTP details:
     {
       "smtp": {
         "host": "smtp.example.com",
         "username": "your_smtp_username",
         "password": "your_smtp_password",
         "port": 587,
         "encryption": "tls"
       }
     }
   - For Gmail, use an App Password (https://support.google.com/accounts/answer/185833) if 2FA is enabled.

7. Configure Branding (Optional):
   - Edit public/style.config.json to customize appearance:
     {
       "branding": {
         "textColor": "#333333",
         "backgroundColor": "#f5f5f5",
         "buttonColor": "#4CAF50",
         "buttonHoverColor": "#45a049",
         "logoUrl": "https://via.placeholder.com/150x50.png?text=Your+Logo"
       }
     }
   - Replace logoUrl with your logo’s URL or local path (e.g., /logo.png, uploaded separately).

### Deployment
1. Upload to Server:
   - Copy the build/ folder to your Apache/Nginx server (e.g., /var/www/html/email_app).
   - Ensure PHP is enabled on the server.

2. Test:
   - Visit http://yourdomain.com/email_app/ in a browser.
   - Fill out the form and send an email to verify functionality.

## Usage
- Input Details: Enter your first name, last name, and email address.
- Select Recipient: Choose from the dropdown (populated from addresses.json).
- Edit Template: Customize the email body using the TinyMCE editor.
- Send Email: Click "Send Email" to dispatch the message via SMTP, with your email as the "From" address.

## Sample Data
- addresses.xlsx:
  Salutation | Firstname | Lastname | Email
  Mr.        | John      | Doe      | john.doe@example.com
  Ms.        | Jane      | Smith    | jane.smith@example.com
  Dr.        | Alice     | Brown    | alice.brown@example.com
- template.txt:
  Dear $salutation $lastname,

  Thank you for your time. [More text here]

  Best regards,
  $firstname

## Notes
- SMTP Limitations: Some SMTP servers (e.g., Gmail) may override the "From" address with the authenticated account unless using a service like SendGrid/Mailgun with domain verification.
- Security: For production, add:
  - CSRF protection in send-email.php.
  - Input sanitization.
  - Restrict config.json access (e.g., via .htaccess):
    <Files "config.json">
        Order Allow,Deny
        Deny from all
    </Files>
- TinyMCE: Replace no-api-key in Editor.js with your TinyMCE API key for production use.

## Troubleshooting
- PHP Errors: Ensure PHP is installed and the server supports it.
- Composer Fails: Run as Administrator, ensure 7-Zip is installed (C:\Program Files\7-Zip\), and clear cache (composer clear-cache).
- SMTP Issues: Verify config.json credentials and test with a transactional email service if needed.

## Contributing
Feel free to fork this repository, submit issues, or create pull requests with enhancements!

## License
This project is licensed under the MIT License - see the LICENSE file for details (create one if needed).