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
            background: linear-gradient(135deg, #007A3D, #FEDD00);
            padding: 2rem;
            text-align: center;
            color: white;
        }
        .email-header h1 {
            margin: 0;
            font-size: 1.5rem;
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
        .message-box {
            background: linear-gradient(90deg, rgba(0,0,0,0.08), rgba(0,0,0,0));
            padding: 1.5rem;
            border-radius: 8px;
            margin: 1rem 0;
            border-left: 4px solid #d4af37;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        .info-item {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 5px;
        }
        .info-item strong {
            color: #d4af37;
            display: block;
            margin-bottom: 0.5rem;
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
            <h1>🎀 Nouveau Message de Contact</h1>
            <p style="margin: 0.5rem 0 0; font-size: 0.95rem;"><?php echo $site_name; ?></p>
        </div>

        <!-- Body -->
        <div class="email-body">
            <h2 style="color: #007A3D; margin-top: 0;">Message de <?php echo htmlspecialchars($name); ?></h2>

            <div class="info-grid">
                <div class="info-item">
                    <strong>📧 Email:</strong>
                    <a href="mailto:<?php echo htmlspecialchars($email); ?>"><?php echo htmlspecialchars($email); ?></a>
                </div>
                <div class="info-item">
                    <strong>📱 Téléphone:</strong>
                    <?php echo !empty($phone) ? htmlspecialchars($phone) : 'Non fourni'; ?>
                </div>
            </div>

            <div class="info-item" style="grid-column: 1 / -1; margin-bottom: 1rem;">
                <strong style="color: #FEDD00;">📋 Sujet:</strong>
                <?php 
                $subjects = [
                    'concours' => 'Inscription concours',
                    'partenariat' => 'Partenariat',
                    'question' => 'Question générale',
                    'media' => 'Demande médias',
                    'autre' => 'Autre'
                ];
                echo htmlspecialchars($subjects[$subject] ?? $subject);
                ?>
            </div>

            <hr>

            <h3 style="color: #333;">💬 Message:</h3>
            <div class="message-box">
                <?php echo $message; ?>
            </div>

            <hr>

            <div style="background: #fff3cd; padding: 1rem; border-radius: 5px; border-left: 4px solid #ffc107;">
                <strong style="color: #856404;">⚡ Action suggérée:</strong>
                <p style="margin: 0.5rem 0 0;">Répondre à ce message ou prendre action selon le sujet.</p>
            </div>

            <hr>

            <p style="text-align: center; color: #666; font-size: 0.9rem;">
                <strong>Cet email a été envoyé automatiquement le <?php echo date('d/m/Y à H:i'); ?></strong>
            </p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p style="margin: 0 0 0.5rem;">© 2025 <?php echo $site_name; ?>. Tous droits réservés.</p>
            <p style="margin: 0; font-size: 0.85rem;">Veuillez ne pas répondre directement à cet email. Contactez <?php echo htmlspecialchars($email); ?> directement.</p>
        </div>
    </div>
</body>
</html>
