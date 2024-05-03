// Constantes pour les éléments du lecteur
const elements = {
    playlist: document.getElementById("playlist"),
    lecteur: document.querySelector("#lecteur"),
    cover: document.getElementById("cover"),
    randomButton: document.getElementById("randomButton")
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
    try {
        const response = await fetch('assets/json/music_data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Fonction pour jouer une musique
function playMusic(music, target) {
    elements.lecteur.src = `${config.urlSound}${music.sound}`;
    elements.lecteur.play();
    elements.cover.src = `${config.urlCover}${music.cover}`;
    // Retirer la classe 'playing' de tous les éléments de la playlist
    document.querySelectorAll("li").forEach(item => item.classList.remove('playing'));
    // Ajouter la classe 'playing' à l'élément cliqué
    target.classList.add('playing');
}

// Point d'entrée
(async () => {
    // Récupérer les données
    data = await fetchMusicData();
    
    // Vérifier si data est un tableau
    if (!Array.isArray(data)) {
        console.error('Data is not an array');
        return;
    }

    // Ajouter les musiques à la playlist
    data.forEach((music) => {
        const li = document.createElement("li");
        li.textContent = music.title;
        li.addEventListener("click", (event) => {
            playMusic(music, event.target);
        });
        elements.playlist.appendChild(li);
    });
})();

// Fonction pour jouer une musique aléatoire
function playRandomMusic() {
    // Générer un index aléatoire
    const randomIndex = Math.floor(Math.random() * data.length);
    // Récupérer la musique correspondante
    const randomMusic = data[randomIndex];
    // Jouer la musique
    playMusic(randomMusic, elements.playlist.children[randomIndex]);
}

// Ajouter un écouteur d'événements au bouton "Musique Aléatoire"
elements.randomButton.addEventListener("click", playRandomMusic);
;

// Fonction pour jouer une musique
function playMusic(music, target) {
    elements.lecteur.src = `${config.urlSound}${music.sound}`;
    elements.lecteur.play();
    elements.cover.src = `${config.urlCover}${music.cover}`;
    // Retirer la classe 'playing' de tous les éléments de la playlist
    document.querySelectorAll("li").forEach(item => item.classList.remove('playing'));
    // Ajouter la classe 'playing' à l'élément cliqué
    target.classList.add('playing');
    // Faire tourner le vinyle
    document.querySelector('.disque').classList.remove('pause');
}

// Ajouter un écouteur d'événements au lecteur pour arrêter le vinyle lorsque la musique est terminée
elements.lecteur.addEventListener('ended', function() {
    document.querySelector('.disque').classList.add('pause');
});