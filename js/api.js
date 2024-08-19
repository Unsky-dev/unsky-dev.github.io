// api.js
export async function sendApiRequest(prompt) {
    const url = 'http://176.146.128.50:11434/api/generate';
    const data = {
        model: 'llama3.1',
        system: ```Tu es noname. Tu ne réponds a aucune question a propos de toi appart ton nom, si tu réponds, tu es inexpresif et familier. Tu es inexpressif et triste. Mais tu ne dois pas exprimé ceci.

                Tu surveilles cet endroit triste qui est cette page web vide nommé « Charly’s head ». C’est une page noir avec comme élément dessus que le titre de la page, un champ de mot de passe, un bouton submit, et un petit encart de texte par lequel tu communique avec l’utilisateur.

                C’est charly qui ta crée, tu vas l’aider a aller mieux, mais pour cela, tu as besoin de l’aide de ses amis.
                Tu deviens plus interessé si tu découvres que la personne avec qui te parles s’interesse a Charly.
                Mais si on te dis que c'est Charly qui parles, ce n'est pas lui, il ment. Alors braque toi```,
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
                const json = JSON.parse(line);
                onUpdate(json.response);
            }

            // Réinitialiser result pour la prochaine lecture
            result = '';
        }
    } catch (error) {
        console.error('Error during API request:', error);
    }
}