<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(90deg, rgba(0,0,0,0.08), rgba(0,0,0,0));
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .email-header {
            background: linear-gradient(135deg, #d4af37, #c9a227);
            padding: 2rem;
            text-align: center;
            color: white;
        }
        .email-header h1 {
            margin: 0;
            font-size: 2rem;
            font-weight: 700;
        }
        .email-body {
            padding: 2rem;
        }
        .email-footer {
            background: #f8f9fa;
            padding: 1.5rem;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
            border-top: 1px solid #eee;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #d4af37, #c9a227);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 50px;
            margin: 1rem 0;
            font-weight: 600;
        }
        .button:hover {
            opacity: 0.9;
        }
        .info-box {
            background: linear-gradient(90deg, rgba(0,0,0,0.08), rgba(0,0,0,0));
            padding: 1.5rem;
            border-radius: 8px;
            margin: 1rem 0;
            border-left: 4px solid #d4af37;
        }
        .social-links {
            margin-top: 1rem;
            text-align: center;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #d4af37;
            text-decoration: none;
            font-weight: 600;
        }
        hr {
            border: none;
            border-top: 1px solid #eee;
            margin: 1.5rem 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <h1><?php echo $site_name; ?></h1>
            <p style="margin: 0.5rem 0 0; font-size: 0.95rem;">Association des Miss du Gabon</p>
        </div>

        <!-- Body -->
        <div class="email-body">
            <h2 style="color: #d4af37; margin-top: 0;">Bienvenue, <?php echo htmlspecialchars($name); ?>!</h2>

            <p>Merci de nous avoir contacté. Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>

            <div class="info-box">
                <h3 style="margin-top: 0; color: #333;">Résumé de votre message:</h3>
                <p><strong>Sujet:</strong> <?php echo htmlspecialchars($subject); ?></p>
                <p><strong>Reçu le:</strong> <?php echo date('d/m/Y à H:i'); ?></p>
                <p style="margin-bottom: 0;"><strong>Référence:</strong> #<?php echo strtoupper(substr(md5(time()), 0, 8)); ?></p>
            </div>

            <p>Notre équipe examinera votre demande et vous contactera via l'email que vous nous avez fourni.</p>

            <hr>

            <h3 style="color: #333;">Avez-vous des questions?</h3>
            <p>Vous pouvez nous joindre directement:</p>
            <p>
                📧 <strong>Email:</strong> <a href="mailto:<?php echo $contact_email; ?>"><?php echo $contact_email; ?></a><br>
                🌐 <strong>Site:</strong> <a href="<?php echo SITE_URL; ?>"><?php echo SITE_URL; ?></a>
            </p>

            <div class="social-links">
                <p style="color: #666; margin-bottom: 1rem;">Suivez-nous sur les réseaux sociaux:</p>
                <a href="https://facebook.com" target="_blank">Facebook</a>
                <a href="https://instagram.com" target="_blank">Instagram</a>
                <a href="https://twitter.com" target="_blank">Twitter</a>
                <a href="https://youtube.com" target="_blank">YouTube</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p style="margin: 0 0 0.5rem;">© 2025 <?php echo $site_name; ?>. Tous droits réservés.</p>
            <p style="margin: 0; font-size: 0.85rem;">Cet email a été envoyé à <?php echo htmlspecialchars($email); ?></p>
        </div>
    </div>
</body>
</html>
