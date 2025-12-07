<?php
/**
 * Test du système Email
 * Accès: http://localhost/test_email.php
 * À supprimer en production!
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/EmailManager.php';

// Simple HTML form pour tester
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Système Email - Association des Miss du Gabon</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 600px;
            margin: 2rem auto;
            padding: 2rem;
            background: linear-gradient(90deg, rgba(0,0,0,0.08), rgba(0,0,0,0));
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 {
            color: #d4af37;
            margin-bottom: 0.5rem;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1.5rem;
            color: #856404;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        label {
            display: block;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #333;
        }
        input, textarea, select {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #eee;
            border-radius: 5px;
            font-family: inherit;
            font-size: 1rem;
            box-sizing: border-box;
        }
        input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: #d4af37;
            box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }
        button {
            background: linear-gradient(135deg, #d4af37, #c9a227);
            color: white;
            padding: 0.75rem 2rem;
            border: none;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            font-size: 1rem;
        }
        button:hover {
            opacity: 0.9;
        }
        .result {
            margin-top: 1.5rem;
            padding: 1rem;
            border-radius: 5px;
        }
        .result.success {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        .result.error {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        .info {
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
            padding: 1rem;
            border-radius: 5px;
            margin-top: 1rem;
        }
        .config-check {
            margin-top: 2rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .config-item {
            margin: 0.5rem 0;
            font-size: 0.9rem;
        }
        .ok { color: #28a745; }
        .error-text { color: #dc3545; }
        .warning-text { color: #ffc107; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Test du Système Email</h1>
        <p>Testez l'envoi d'emails pour l'Association des Miss du Gabon</p>

        <div class="warning">
            ⚠️ <strong>Attention:</strong> Cette page de test doit être supprimée en production!
        </div>

        <form method="POST">
            <div class="form-group">
                <label for="email">Email de test:</label>
                <input type="email" id="email" name="email" 
                       value="<?php echo sanitizeInput($_POST['email'] ?? ''); ?>" 
                       placeholder="votre@email.com" required>
                <small>Entrez l'adresse email où recevoir le test</small>
            </div>

            <div class="form-group">
                <label for="name">Nom:</label>
                <input type="text" id="name" name="name" 
                       value="<?php echo sanitizeInput($_POST['name'] ?? 'Test'); ?>" 
                       placeholder="Votre nom" required>
            </div>

            <div class="form-group">
                <label for="template">Template:</label>
                <select id="template" name="template">
                    <option value="confirmation_email">Email de confirmation</option>
                    <option value="contact_message">Message de contact</option>
                </select>
            </div>

            <button type="submit">📧 Envoyer email de test</button>
        </form>

        <?php
        // Traiter la soumission du formulaire
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $email = sanitizeInput($_POST['email'] ?? '');
            $name = sanitizeInput($_POST['name'] ?? 'Test');
            $template = sanitizeInput($_POST['template'] ?? 'confirmation_email');

            echo '<div class="result ';

            try {
                if (!validateEmail($email)) {
                    throw new Exception('Email invalide');
                }

                // Créer une instance EmailManager
                $emailManager = new EmailManager();
                $emailManager->setTo($email, $name)
                            ->setSubject('Test du système email - ' . SITE_NAME);

                // Charger le template approprié
                if ($template === 'contact_message') {
                    $emailManager->loadTemplate('contact_message', [
                        'name' => 'Expéditeur Test',
                        'email' => 'test@example.com',
                        'phone' => '+241 06 12 34 56',
                        'subject' => 'question',
                        'message' => 'Ceci est un message de test pour valider le système email.<br><br>Si vous recevez cet email, tout fonctionne correctement!',
                        'site_name' => SITE_NAME
                    ]);
                } else {
                    $emailManager->loadTemplate('confirmation_email', [
                        'name' => $name,
                        'email' => $email,
                        'subject' => 'test',
                        'site_name' => SITE_NAME,
                        'contact_email' => EMAIL_CONTACT
                    ]);
                }

                // Envoyer l'email
                $emailManager->send();

                echo 'success">';
                echo '✓ <strong>Email envoyé avec succès!</strong><br>';
                echo 'L\'email a été envoyé à: <strong>' . htmlspecialchars($email) . '</strong>';
                
            } catch (Exception $e) {
                echo 'error">';
                echo '✕ <strong>Erreur lors de l\'envoi:</strong><br>';
                echo htmlspecialchars($e->getMessage());
                logError('Test email error: ' . $e->getMessage());
            }

            echo '</div>';
        }
        ?>

        <div class="config-check">
            <h3>📋 Vérification de la configuration:</h3>
            
            <div class="config-item">
                <span class="<?php echo defined('SMTP_HOST') ? 'ok' : 'error-text'; ?>">
                    <?php echo defined('SMTP_HOST') ? '✓' : '✕'; ?> 
                    SMTP Host: <strong><?php echo SMTP_HOST; ?></strong>
                </span>
            </div>

            <div class="config-item">
                <span class="<?php echo defined('SMTP_USER') ? 'ok' : 'error-text'; ?>">
                    <?php echo defined('SMTP_USER') ? '✓' : '✕'; ?> 
                    SMTP User: <strong><?php echo SMTP_USER; ?></strong>
                </span>
            </div>

            <div class="config-item">
                <span class="<?php echo defined('EMAIL_CONTACT') ? 'ok' : 'error-text'; ?>">
                    <?php echo defined('EMAIL_CONTACT') ? '✓' : '✕'; ?> 
                    Email Contact: <strong><?php echo EMAIL_CONTACT; ?></strong>
                </span>
            </div>

            <div class="config-item">
                <span class="<?php echo function_exists('mail') ? 'ok' : 'error-text'; ?>">
                    <?php echo function_exists('mail') ? '✓' : '✕'; ?> 
                    Fonction mail() disponible
                </span>
            </div>

            <div class="config-item">
                <span class="<?php echo is_writable(__DIR__ . '/logs') ? 'ok' : 'warning-text'; ?>">
                    <?php echo is_writable(__DIR__ . '/logs') ? '✓' : '⚠'; ?> 
                    Dossier logs accessible
                </span>
            </div>

            <div class="config-item">
                <span class="<?php echo is_writable(__DIR__ . '/templates') ? 'ok' : 'error-text'; ?>">
                    <?php echo is_writable(__DIR__ . '/templates') ? '✓' : '✕'; ?> 
                    Dossier templates accessible
                </span>
            </div>
        </div>

        <div class="info">
            <strong>💡 Conseils:</strong>
            <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                <li>Vérifiez l'email de test dans votre dossier Spam si non reçu</li>
                <li>Consultez <code>logs/email.log</code> pour les détails d'erreur</li>
                <li>Assurez-vous que SMTP_PASS est correctement configuré</li>
                <li>Supprimez cette page avant la mise en production</li>
            </ul>
        </div>
    </div>
</body>
</html>
