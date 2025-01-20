// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('Service Worker enregistré avec succès.');
    }).catch((error) => {
        console.error('Erreur lors de l\'enregistrement du Service Worker :', error);
    });
}
// Mise à jour du Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        // Nouveau contenu disponible
                        const updateNotification = document.createElement('div');
                        updateNotification.textContent = "Nouvelle version disponible ! Cliquez pour mettre à jour.";
                        updateNotification.style.position = 'fixed';
                        updateNotification.style.bottom = '0';
                        updateNotification.style.width = '100%';
                        updateNotification.style.background = 'black';
                        updateNotification.style.color = 'white';
                        updateNotification.style.textAlign = 'center';
                        updateNotification.style.cursor = 'pointer';
                        document.body.appendChild(updateNotification);

                        updateNotification.addEventListener('click', () => {
                            newWorker.postMessage({ action: 'skipWaiting' });
                            window.location.reload();
                        });
                    }
                }
            });
        });
    });
}

let deferredPrompt;
const installButton = document.getElementById('installButton');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
});

installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
        return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    installButton.style.display = 'none';
});

window.addEventListener('appinstalled', () => {
    installButton.style.display = 'none';
    console.log('Application installée avec succès!');
});

if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    installButton.style.display = 'none';
}

if (!("NDEFReader" in window)) {
    const nfc = document.getElementById('nfc');
    nfc.querySelector('.writeButton').style.display = 'none';
    nfc.querySelector('.scanButton').style.display = 'none';
    nfc.querySelector('#info').style.display = 'block';
    nfc.querySelector('#info').textContent = "La gestion NFC n'est pas supportée par votre navigateur.";
    nfc.querySelector('#info').style.color = 'tomato';
    console.log('NFC non supporté.');
} else {
    const nfc = document.getElementById('nfc');
    nfc.style.display = 'block';
}

let isWriting = false;

nfc.querySelector('.writeButton').addEventListener('click', async () => {
    const info = document.getElementById('info');
    const slider = document.getElementById('intensity');

    if (!isWriting) {
        // Premier clic
        info.style.display = 'block';
        info.textContent = `Cela va écrire avec l'intensité définie: ${slider.value}`;
        nfc.querySelector('.writeButton').textContent = 'Confirmer l\'écriture';
        isWriting = true;
    } else {
        // Deuxième clic
        const message = `Message avec intensité: ${slider.value}`;
        // Code pour écrire le message NFC ici
        console.log('Écriture du message:', message);
        info.style.display = 'block';
        info.style.color = 'green';
        info.textContent = 'Message écrit avec succès!';
        nfc.querySelector('.writeButton').textContent = 'Écrire un tag';
        isWriting = false;
    }
});

    const slider = document.getElementById('intensity');
    const intensityValue = document.getElementById('intensity-value');
    const toggleSwitch = document.getElementById('toggle-switch');
    const intensityControl = document.querySelector('.intensity-control');

    intensityControl.style.display = 'none';

    toggleSwitch.addEventListener('change', () => {
        if (toggleSwitch.checked) {
            slider.disabled = false;
            intensityControl.style.display = 'block';
        } else {
            slider.disabled = true;
            slider.value = 0;
            intensityValue.textContent = '0%';
            intensityControl.style.display = 'none';
        }
    });

    slider.addEventListener('input', () => {
        intensityValue.textContent = `${slider.value}%`;
    });