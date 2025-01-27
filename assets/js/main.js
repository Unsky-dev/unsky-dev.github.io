// Vérification et enregistrement du Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
            console.log('Service Worker enregistré avec succès.');

            // Gestion de la mise à jour du Service Worker
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Affichage de la notification de mise à jour
                        const updateNotification = document.createElement('div');
                        updateNotification.textContent = "Nouvelle version disponible ! Cliquez pour mettre à jour.";
                        Object.assign(updateNotification.style, {
                            position: 'fixed',
                            bottom: '0',
                            width: '100%',
                            background: 'black',
                            color: 'white',
                            textAlign: 'center',
                            cursor: 'pointer'
                        });
                        document.body.appendChild(updateNotification);

                        updateNotification.addEventListener('click', () => {
                            newWorker.postMessage({ action: 'skipWaiting' });
                            window.location.reload();
                        });
                    }
                });
            });
        })
        .catch((error) => {
            console.error('Erreur lors de l\'enregistrement du Service Worker :', error);
        });
}

// Gestion de l'installation de l'application
let deferredPrompt;
const installButton = document.getElementById('installButton');
window.getotor = () => atob(atob('UTI5a1pTQndZWElnUTJoaGNteDVJSEJ2ZFhJZ2JHVWdjSEp2YW1WMElFOXdaVzVNZFcwPQ=='));
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
});

installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;

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

// Fonction pour mettre à jour le message d'info
function updateInfoMessage(message, color) {
    const info = document.getElementById('info');
    info.style.display = 'block';
    info.style.color = color;
    info.textContent = message;
}

// Vérifier si NFC est supporté
if (!('NDEFReader' in window)) {
    const nfc = document.getElementById('nfc');
    nfc.style.display = 'block';
    updateInfoMessage("La gestion NFC n'est pas supportée par votre navigateur.", 'tomato');
    nfc.querySelector('.writeButton').style.display = 'none';
    nfc.querySelector('.scanButton').style.display = 'none';
    console.log('NFC non supporté.');
} else {
    const nfc = document.getElementById('nfc');
    nfc.style.display = 'block';

    let isWriting = false;
    const slider = document.getElementById('intensity');

    // Fonction pour masquer/afficher les boutons
    function toggleButtons(disable) {
        const writeButton = nfc.querySelector('.writeButton');
        const scanButton = nfc.querySelector('.scanButton');
        if (disable) {
            writeButton.style.display = 'none';
            scanButton.style.display = 'none';
        } else {
            writeButton.style.display = 'inline'; // Réaffiche les boutons
            scanButton.style.display = 'inline'; // Réaffiche les boutons
        }
    }

    // Écriture du tag
    nfc.querySelector('.writeButton').addEventListener('click', async () => {
        const info = document.getElementById('info');

        if (!isWriting) {
            if (slider.value == 0 || slider.disabled) {
                updateInfoMessage('Veuillez choisir une intensité supérieure à 0%.', 'tomato');
            } else {
                nfc.querySelector('.scanButton').style.display = 'none';
                updateInfoMessage(`Cela va écrire avec l'intensité définie: ${slider.value}`, 'tomato');
                nfc.querySelector('.writeButton').textContent = 'Confirmer l\'écriture';
                isWriting = true;
            }
        } else {
            const siteUrl = window.location.origin;
            const message = `Tag avec intensité: ${slider.value}`;
            console.log('Écriture du tag:', message);
            updateInfoMessage('Veuillez approcher le tag NFC...', 'gray');
            nfc.querySelector('.writeButton').style.display = 'none';

            toggleButtons(true); // Masquer les boutons pendant l'écriture

            try {
                const ndef = new NDEFReader();
                await ndef.write({ 
                    records: [
                        {
                            recordType: "url",
                            data: `${siteUrl}/tag/${slider.value}`
                        }
                    ]
                });
                console.log('URL écrite sur le tag:', `${siteUrl}/tag/${slider.value}`);
                updateInfoMessage('Tag écrit avec succès!', 'green');
            } catch (error) {
                console.error('Erreur lors de l\'écriture sur le tag NFC:', error);
                updateInfoMessage('Erreur lors de l\'écriture sur le tag NFC.', 'tomato');
            }

            // Réinitialiser le bouton après l'écriture
            nfc.querySelector('.writeButton').textContent = 'Écrire un tag';
            nfc.querySelector('.scanButton').style.display = 'inline';

            toggleButtons(false); // Réafficher les boutons après l'écriture
            isWriting = false;
        }
    });

    // Lecture du tag NFC
    nfc.querySelector('.scanButton').addEventListener('click', async () => {
        const siteUrl = window.location.origin;
        const info = document.getElementById('info');
        updateInfoMessage('Veuillez approcher le tag NFC...', 'gray');

        toggleButtons(true); // Masquer les boutons pendant la lecture

        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            ndef.addEventListener('reading', ({ message }) => {
                console.log('Tag NFC détecté:', message);
                const record = message.records[0];
                if (record.recordType === 'url') {
                    const url = new TextDecoder().decode(record.data);
                    console.log('URL détectée:', url);
                    if (url.startsWith(`${siteUrl}/tag/`)) {
                        updateInfoMessage(`Ce tag a été écrit avec l'intensité: ${slider.value}`, 'green');
                    } else {
                        updateInfoMessage('Ce tag n\'a pas été écrit par cette application.', 'tomato');
                    }
                } else {
                    updateInfoMessage('Ce tag ne contient pas une URL valide.', 'tomato');
                }
                ndef.cancel();
            });
        } catch (error) {
            console.error('Erreur lors de la lecture du tag NFC:', error);
            updateInfoMessage('Erreur lors de la lecture du tag NFC.', 'tomato');
        }

        // Réafficher les boutons après la lecture
        toggleButtons(false); // Réafficher les boutons après la lecture
    });
}

// Contrôle de l'intensité
const slider = document.getElementById('intensity');
const intensityValue = document.getElementById('intensity-value');
const toggleSwitch = document.getElementById('toggle-switch');
const intensityControl = document.querySelector('.intensity-control');
const statustext = document.getElementById('status-text');


toggleSwitch.addEventListener('change', () => {
    if (toggleSwitch.checked) {
        intensityValue.textContent = '50%';
        statustext.textContent = 'ON';
        slider.disabled = false;
        intensityControl.classList.add('visible');
        slider.value = 50;
    } else {
        intensityValue.textContent = '0%';
        statustext.textContent = 'OFF';
        slider.disabled = true;
        slider.value = 0;
        intensityControl.classList.remove('visible');
    }
});

slider.addEventListener('input', () => {
    intensityValue.textContent = `${slider.value}%`;
    if (slider.value == 0) {
        toggleSwitch.checked = false;
        intensityControl.classList.remove('visible');
    }
});

// Gestion du bouton de réinitialisation
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', async () => {
    // Effacer le cache du Service Worker
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));

    // Effacer le localStorage et le sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Désenregistrer le Service Worker
    if (navigator.serviceWorker) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
            await registration.unregister();
        }
    }

    // Recharger la page
    window.location.reload();
});