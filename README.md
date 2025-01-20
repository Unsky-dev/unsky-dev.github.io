# OpenLuminate

OpenLuminate est une application web progressive (PWA) de contrôle de luminaire intelligent, offrant une interface intuitive pour gérer l'éclairage à distance.

## 🧠 Carte mentale

![Carte mentale](./assets/project/carte%20mentale.png)

## 🌟 Fonctionnalités

- Interface utilisateur intuitive et responsive
- Contrôle ON/OFF de l'éclairage
- Réglage de l'intensité lumineuse (0-100%)
- Support NFC pour le contrôle tactile
- Mode hors-ligne avec page de fallback
- Installation en tant qu'application (PWA)
- Design moderne avec thème violet dégradé

## 🛠️ Technologies Utilisées

- HTML5
- CSS3 (avec animations et design responsive)
- JavaScript (Vanilla)
- Service Workers pour la fonctionnalité hors-ligne
- API Web NFC
- Manifest WebApp pour la fonctionnalité PWA

## ⚙️ Installation

1. Clonez le dépôt
2. Servez les fichiers via un serveur web (nécessaire pour le Service Worker)
3. Accédez à l'application via un navigateur moderne
4. Optionnel : Installez l'application via le bouton "Installer l'application"

## 📱 Configuration PWA

L'application peut être installée sur les appareils mobiles et de bureau grâce au fichier manifest qui configure :
- Nom de l'application : "OpenLuminate"
- Nom court : "Luminate"
- Couleurs de thème : #4a00e0
- Mode d'affichage : standalone

## 🔌 Fonctionnalités Hors-ligne

- Cache des ressources essentielles
- Page de fallback personnalisée
- Mise à jour automatique du cache
- Notification de mise à jour disponible

## 👥 Auteurs

- Charly Meriano : Développeur Back-End
- Fabien Perronet : Développeur Front-End
- Nathan Pruvost : Alimentation
- Louai Ouerghi : Alimentation

### 🤝 Co-Auteurs

 - Secret mdrrr : Design UI/UX

## 💡 Support NFC

L'application inclut le support NFC pour :
- Écriture de tags NFC avec les paramètres d'intensité
- Lecture de tags pour le contrôle rapide
- Messages de fallback pour les appareils non compatibles

## 🎨 Design

- Interface utilisateur moderne avec dégradé violet
- Composants interactifs avec animations
- Design responsive pour tous les appareils
- Police Poppins pour une meilleure lisibilité

## 📝 Version

Version actuelle : V1 BETA (2024-2025)

## 🔒 Licence

© 2024-2025 Projet Luminaire - Tous droits réservés. (j'rigole jsp)

## 🔍 Compatibilité

- Navigateurs modernes avec support des Service Workers
- Support PWA requis pour l'installation
- Support NFC optionnel (tkt, ça marche pas encore)
