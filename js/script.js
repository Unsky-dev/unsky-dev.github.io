let attemptCount = 0;
const maxAttempts = 3;

document.querySelector('.submit').addEventListener('click', function() {
    attemptCount++;
    if (attemptCount > maxAttempts) {
        document.querySelector('.error-message').style.display = 'block';
    }
});

navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        const video = document.createElement('video');
        video.srcObject = stream;
        document.body.appendChild(video);
        document.querySelector('.thanks-message').textContent = 'Thanks for the camera :)';
    })
    .catch(function(error) {
        document.querySelector('.thanks-message').textContent = "why don't you want me to see you :(";
    });

    