// Constantes pour les éléments du lecteur
const elements = {
    playlist: document.getElementById("playlist"),
    lecteur: document.querySelector("#lecteur"),
    cover: document.getElementById("cover"),
    randomButton: document.getElementById("randomButton"),
    disque: document.querySelector(".disque")
};

// Configuration des URLs pour les covers et les musiques
const config = {
    urlCover: "uploads/covers/",
    urlSound: "uploads/musics/"
};

// Variables
let data;
let lastPlayed = null;

// Fonction pour récupérer les données à partir du fichier JSON
async function fetchMusicData() {
    const response = await fetch("https://api2-6seh.onrender.com/api/v1/musics/");
    const dbMusic = await response.json();
    data = dbMusic.result;
    data.forEach((music) => {
        const li = document.createElement("li");
        li.textContent = music.title;
        li.addEventListener("click", () => playMusic(music, li));
        elements.playlist.appendChild(li);
    });
}

// Fonction pour jouer une musique
function playMusic(music, target) {
    elements.lecteur.src = `${config.urlSound}${music.sound}`;
    elements.cover.src = `${config.urlCover}${music.cover}`;
    elements.lecteur.play();
    // Retirer la classe 'playing' de tous les éléments de la playlist
    document.querySelectorAll("li").forEach(item => item.classList.remove('playing'));
    // Ajouter la classe 'playing' à l'élément cliqué
    target.classList.add('playing');
    // Faire tourner le vinyle
    elements.disque.classList.remove('pause');
}

// Fonction pour jouer une musique aléatoire
function playRandomMusic() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * data.length);
    } while (randomIndex === lastPlayed);
    lastPlayed = randomIndex;
    // Récupérer la musique correspondante
    const randomMusic = data[randomIndex];
    // Jouer la musique
    playMusic(randomMusic, elements.playlist.children[randomIndex]);
}

// Ajouter un écouteur d'événements au lecteur pour mettre en pause le vinyle lorsque la musique est en pause
elements.lecteur.addEventListener('pause', function() {
    elements.disque.classList.add('pause');
});

// Ajouter un écouteur d'événements au lecteur pour faire tourner le vinyle lorsque la musique reprend
elements.lecteur.addEventListener('play', function() {
    elements.disque.classList.remove('pause');
});

// Ajouter un écouteur d'événements au bouton "Musique Aléatoire"
elements.randomButton.addEventListener("click", playRandomMusic);

// Point d'entrée
(async () => {
    await fetchMusicData();
})();
