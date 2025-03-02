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

// Fonction pour mettre à jour la LED sur le Pico
function updateLED(value) {
    fetch(`/led?value=${value}`)
      .then(response => response.text())
      .then(text => {
          console.log("LED update:", text);
      })
      .catch(error => {
          console.error("Erreur lors de la mise à jour de la LED:", error);
      });
}

// Gestion du contrôle de l'intensité via l'interface
const slider = document.getElementById('intensity');
const intensityValue = document.getElementById('intensity-value');
const toggleSwitch = document.getElementById('toggle-switch');
const intensityControl = document.querySelector('.intensity-control');

// Masquer le contrôle d'intensité par défaut
intensityControl.style.display = 'none';

// Lors du changement de l'interrupteur
toggleSwitch.addEventListener('change', () => {
    if (toggleSwitch.checked) {
        slider.disabled = false;
        intensityControl.style.display = 'block';
        slider.value = 50;
        intensityValue.textContent = '50%';
        updateLED(50);
    } else {
        slider.disabled = true;
        intensityControl.style.display = 'none';
        slider.value = 0;
        intensityValue.textContent = '0%';
        updateLED(0);
    }
});

// Lors du déplacement du slider
slider.addEventListener('input', () => {
    intensityValue.textContent = `${slider.value}%`;
    updateLED(slider.value);
});

// Gestion NFC
const nfc = document.getElementById('nfc');
if (!('NDEFReader' in window)) {
    nfc.style.display = 'block';
    const info = nfc.querySelector('#info');
    info.style.display = 'block';
    info.style.color = 'tomato';
    info.textContent = "La gestion NFC n'est pas supportée par votre navigateur.";
    nfc.querySelector('.writeButton').style.display = 'none';
    nfc.querySelector('.scanButton').style.display = 'none';
    console.log('NFC non supporté.');
} else {
    nfc.style.display = 'block';
    let isWriting = false;
    const slider = document.getElementById('intensity');
    let writingValue = slider.value;

    // Fonction pour masquer/afficher les boutons
    function toggleButtons(disable) {
        const writeButton = nfc.querySelector('.writeButton');
        const scanButton = nfc.querySelector('.scanButton');
        if (disable) {
            console.log('Désactivation des boutons...');
            writeButton.style.display = 'none';
            scanButton.style.display = 'none';
        } else {
            console.log('Activation des boutons...');
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
                writingValue = slider.value;
                nfc.querySelector('.scanButton').style.display = 'none';
                updateInfoMessage(`Cela va écrire avec l'intensité définie: ${writingValue}`, 'tomato');
                nfc.querySelector('.writeButton').textContent = 'Confirmer l\'écriture';
                isWriting = true;
            }
        } else {
            const siteUrl = window.location.origin;
            const message = `Tag avec intensité: ${writingValue}`;
            console.log('Écriture du tag:', message);
            updateInfoMessage('Veuillez approcher le tag NFC...', 'gray');

            toggleButtons(true);

            try {
                const ndef = new NDEFReader();
                await ndef.write({ 
                    records: [
                        {
                            recordType: "url",
                            data: `${siteUrl}/led?value=${slider.value}`
                        }
                    ]
                });
                console.log('URL écrite sur le tag:', `${siteUrl}/led?value=${slider.value}`);
                info.style.display = 'block';
                info.style.color = 'green';
                info.textContent = 'Tag écrit avec succès!';
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
                    if (url.includes(`${siteUrl}/led?value=`)) {
                        let intensity = url.split(`${siteUrl}/led?value=`)[1];
                        info.style.display = 'block';
                        info.style.color = 'green';
                        info.textContent = `Tag lu: intensité ${intensity}%`;
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
            });
        } catch (error) {
            console.error('Erreur lors de la lecture du tag NFC:', error);
            info.style.display = 'block';
            info.style.color = 'tomato';
            info.textContent = 'Erreur lors de la lecture du tag NFC.';
        }
    });
}

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
