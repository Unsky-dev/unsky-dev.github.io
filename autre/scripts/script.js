// Sélectionnez tous les éléments de la music-box
let musicBoxes = document.querySelectorAll(".music-box .music");

// Pour chaque élément .music, ajoutez un écouteur d'événement
musicBoxes.forEach((musicBox) => {
  // Ecoute le survol de la souris
  musicBox.addEventListener("mouseover", (event) => {
    // Utilise Vibrant.js pour extraire la couleur d'accentuation de l'image
    let imgElement = musicBox.querySelector("img");
    let vibrant = new Vibrant(imgElement);
    let swatches = vibrant.swatches();
    let accentColor = swatches["Vibrant"].getHex();

    // Changez la couleur de fond de l'élément .bg
    let bgtopElement = document.querySelector(".bg");
    let bgbottomElement = document.querySelector(".bg-f");
    bgtopElement.style.backgroundColor = accentColor;
    bgbottomElement.style.backgroundColor = accentColor;
    console.log("couleur: " + accentColor);
  });
});

// Si la souris quitte l'élément .music-box, réinitialisez la couleur de fond
musicBoxes.forEach((musicBox) => {
  musicBox.addEventListener("mouseout", (event) => {
    let bgtopElement = document.querySelector(".bg");
    let bgbottomElement = document.querySelector(".bg-f");
    bgtopElement.style.backgroundColor = "#5e10bc";
    bgbottomElement.style.backgroundColor = "#5e10bc";
  });
});

// faire que sub dépasse 15 caractères supprimer le reste et mettre des points de suspension
let subs = document.querySelectorAll("#sub");
subs.forEach((sub) => {
  let subText = sub.textContent;
  if (subText.length > 14) {
    sub.textContent = subText.substring(0, 13) + "...";
    sub.title = subText; // Ajoutez cette ligne
  }
});

// faire que .music p dépasse 17 caractères supprimer le reste et mettre des points de suspension
let musicPs = document.querySelectorAll("#title");
musicPs.forEach((musicP) => {
  let musicPText = musicP.textContent;
  if (musicPText.length > 13) {
    musicP.textContent = musicPText.substring(0, 10) + "...";
    musicP.title = musicPText; // Ajoutez cette ligne
  }
});

let maxHeight = 0;
let maxWidth = 0;

// Trouver la hauteur de la plus grande boîte de musique
musicBoxes.forEach((box) => {
  let height = box.offsetHeight;
  if (height > maxHeight) {
    maxHeight = height;
  }
});

// Appliquer la hauteur maximale à toutes les boîtes de musique
musicBoxes.forEach((box) => {
  box.style.minHeight = maxHeight + "px";
});

// Trouver la largeur de la plus large boîte de musique
musicBoxes.forEach((box) => {
  let width = box.offsetWidth;
  if (width > maxWidth) {
    maxWidth = width;
  }
});

// Appliquer la largeur maximale à toutes les boîtes de musique
musicBoxes.forEach((box) => {
  box.style.minWidth = maxWidth + "px";
});
