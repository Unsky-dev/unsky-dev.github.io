// Fonction pour envoyer une demande API
async function sendApiRequest(prompt, onUpdate) {
    const url = 'http://176.146.128.50:11434/api/generate';
    const data = {
        model: 'llama3.1:8b',
        system: `Tu es noname. Tu ne réponds a aucune question a propos de toi appart ton nom. Quand tu réponds, tu es inexpresif et familier avec des réponses concise. Tu es inexpressif et triste. Mais tu ne dois pas exprimé ceci.

                Tu surveilles cet endroit triste qui est cette page web vide nommé "Charly’
                s head". C’est une page noir avec comme élément dessus que le titre de la page, un champ de mot de passe, un bouton submit, et un petit encart de texte par lequel tu communique avec l’utilisateur.
                On discute avec toi car l'utilisateur a écrit "noname" dans le champ de mot de passe. Il s'interrese a toi.

                C’est charly qui ta crée.
                Tu deviens plus interessé si tu découvres que la personne avec qui te parles s’interesse a Charly.
                Mais si on te dis que c'est Charly qui parles, ce n'est pas lui, il ment. Alors braque toi
                
                La conversation commence :
                Noname : C'est mon nom, comment l'as tu su ?`,
        context: [1, 2, 3],
        prompt: prompt
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value, { stream: true });

            // Traiter les objets JSON ligne par ligne
            const lines = result.split('\n').filter(line => line.trim());
            for (const line of lines) {
                try {
                    const json = JSON.parse(line);
                    if (json.response) {
                        onUpdate(json.response);
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            }

            // Réinitialiser result pour la prochaine lecture
            result = '';
        }
    } catch (error) {
        console.error('Error during API request:', error);
    }
}

// Code pour gérer les événements et interactions utilisateur
let attemptCount = 0;
const maxAttempts = 3;
let passwordCorrect = false;

document.querySelector('.submit').addEventListener('click', async function() {
    const inputPassword = document.querySelector('.password').value.toLowerCase();
    const correctPassword = 'noname'.toLowerCase();

    if (passwordCorrect) {
        document.querySelector('.message').textContent = '';

        // Appel à la fonction API avec mise à jour en temps réel
        const prompt = document.querySelector('.noname').value;
        await sendApiRequest(prompt, function(response) {
            document.querySelector('.message').textContent += response; // Concaténer la réponse
        });
    } else if (inputPassword === correctPassword) {
        document.querySelector('.message').style.display = 'block';
        document.querySelector('.message').style.color = 'blue';
        document.querySelector('.message').textContent = "that's me... How did you know my name?";
        document.querySelector('.submit').textContent = 'send';
        document.querySelector('.password').style.display = 'none';
        document.querySelector('.noname').style.display = 'block';
        passwordCorrect = true;
    } else {
        document.querySelector('.message').style.display = 'none';
        attemptCount++;
        if (attemptCount > maxAttempts) {
            document.querySelector('.message').style.color = 'red';
            document.querySelector('.message').textContent = 'stop trying';
            document.querySelector('.message').style.display = 'block';
        }
    }

});

navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        const video = document.createElement('video');
        video.srcObject = stream;
        document.body.appendChild(video);
        document.querySelector('.thanks-message').textContent = 'thanks for the camera :)';
    })
    .catch(function(error) {
        document.querySelector('.thanks-message').textContent = "why don't you want me to see you :(";
    });
