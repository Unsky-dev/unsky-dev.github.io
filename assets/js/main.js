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

// Gestion NFC
if (!('NDEFReader' in window)) {
    const nfc = document.getElementById('nfc');
    nfc.style.display = 'block';
    nfc.querySelector('#info').style.display = 'block';
    nfc.querySelector('#info').style.color = 'tomato';
    nfc.querySelector('#info').textContent = "La gestion NFC n'est pas supportée par votre navigateur.";
    nfc.querySelector('.writeButton').style.display = 'none';
    nfc.querySelector('.scanButton').style.display = 'none';
    console.log('NFC non supporté.');
} else {
    const nfc = document.getElementById('nfc');
    nfc.style.display = 'block';

    let isWriting = false;

    nfc.querySelector('.writeButton').addEventListener('click', async () => {
        const info = document.getElementById('info');
        const slider = document.getElementById('intensity');

        if (!isWriting) {
            if (slider.value == 0 || slider.disabled) {
                info.style.display = 'block';
                info.style.color = 'tomato';
                info.textContent = 'Veuillez choisir une intensité supérieure à 0%.';
            } else {
                nfc.querySelector('.scanButton').style.display = 'none';
                info.style.display = 'block';
                info.style.color = 'tomato';
                info.textContent = `Cela va écrire avec l'intensité définie: ${slider.value}`;
                nfc.querySelector('.writeButton').textContent = 'Confirmer l\'écriture';
                isWriting = true;
            }
        } else {
            const siteUrl = window.location.origin;
            const message = `Tag avec intensité: ${slider.value}`;
            console.log('Écriture du tag:', message);
            info.style.display = 'block';
            nfc.querySelector('.writeButton').style.display = 'none';
            info.textContent = 'Veuillez approcher le tag NFC...';
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
                info.style.display = 'block';
                info.style.color = 'green';
                info.textContent = 'Tag écrit avec succès!';
            } catch (error) {
                console.error('Erreur lors de l\'écriture sur le tag NFC:', error);
                info.style.display = 'block';
                info.style.color = 'tomato';
                info.textContent = 'Erreur lors de l\'écriture sur le tag NFC.';
            }
            nfc.querySelector('.writeButton').textContent = 'Écrire un tag';
            nfc.querySelector('.scanButton').style.display = 'inline';
            isWriting = false;
        }
    });
}

nfc.querySelector('.scanButton').addEventListener('click', async () => {
    const siteUrl = window.location.origin;
    const info = document.getElementById('info');
    info.style.display = 'block';
    document.querySelector('.writeButton').style.display = 'none';
    document.querySelector('.scanButton').style.display = 'none';
    info.style.color = 'gray';
    info.textContent = 'Veuillez approcher le tag NFC...';
    try {
        const ndef = new NDEFReader();
        await ndef.scan();
        ndef.addEventListener('reading', ({ message }) => {
            console.log('Tag NFC détecté:', message);
            const record = message.records[0];
            if (record.recordType === 'url') {
                const url = new TextDecoder().decode(record.data);
                console.log('URL détectée:', url);
                if (url == url.includes(`${siteUrl}/tag/`)) {
                    info.style.display = 'block';
                    info.style.color = 'green';
                    info.textContent = `Ce tag a été écrit avec l'intensité: ${slider.value}`;
                } else {
                    info.style.display = 'block';
                    info.style.color = 'tomato';
                    info.textContent = 'Ce tag n\'a pas été écrit par cette application.';
                }
            } else {
                info.style.display = 'block';
                info.style.color = 'tomato';
                info.textContent = 'Ce tag ne contient pas une URL valide.';
            }
            ndef.stop();
        });
    } catch (error) {
        console.error('Erreur lors de la lecture du tag NFC:', error);
        info.style.display = 'block';
        info.style.color = 'tomato';
        info.textContent = 'Erreur lors de la lecture du tag NFC.';
    }
});

// Contrôle de l'intensité
const slider = document.getElementById('intensity');
const intensityValue = document.getElementById('intensity-value');
const toggleSwitch = document.getElementById('toggle-switch');
const intensityControl = document.querySelector('.intensity-control');

intensityControl.style.display = 'none';

toggleSwitch.addEventListener('change', () => {
    intensityValue.textContent = '50%';
    if (toggleSwitch.checked) {
        slider.disabled = false;
        intensityControl.style.display = 'block';
        slider.value = 50;
    } else {
        slider.disabled = true;
        slider.value = 0;
        intensityControl.style.display = 'none';
    }
});

slider.addEventListener('input', () => {
    intensityValue.textContent = `${slider.value}%`;
    if (slider.value == 0) {
        toggleSwitch.checked = false;
        slider.disabled = true;
        intensityControl.style.display = 'none';
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