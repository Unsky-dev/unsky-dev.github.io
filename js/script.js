let attemptCount = 0;
const maxAttempts = 3;

document.querySelector('.submit').addEventListener('click', function() {
    const inputPassword = document.querySelector('.password').value.toLowerCase();
    const correctPassword = 'charly-djudh'.toLowerCase();

    if (inputPassword === correctPassword) {
        document.querySelector('.message').style.display = 'block';
        document.querySelector('.message').style.color = 'blue';
        document.querySelector('.message').textContent = "that's me... How did you know my name?";
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

    