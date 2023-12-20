const popup = document.querySelector(".popup");


function ivymode() {
    popup.innerHTML = '<div class="modal" id="modal"> <div class="modal-inner"> <h2>Titre de la modale</h2> <video> <source src="./autre/ivy.mp4" type="video/mp4"> </video> </div></div><style>.modal { background-color: #181818; color: white; border-radius: 10px; text-align: center; top: 0; left: 0; right: 0; bottom: 0; position: fixed; transition: all 0.3s ease-in-out; z-index: -1; opacity: 0;}.modal-inner { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);}.modal.open { z-index: 999; opacity: 1; margin: 30%;}/* Autres styles CSS nécessaires */</style>';
    const modal = document.getElementById("modal");
    modal.classList.add("open");

    return true;
}
