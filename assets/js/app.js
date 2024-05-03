// Constantes pour les éléments du lecteur
const playlist = document.getElementById("playlist");
const lecteur = document.querySelector("#lecteur");
const cover = document.getElementById("cover");
const randomButton = document.getElementById("randomButton");

// Configuration des URLs pour les covers et les musiques
const config = {
    urlCover: "uploads/covers/",
    urlSound: "uploads/musics/"
}

// Variables
let data;
let lastPlayed = null;

// Fonction pour récupérer les données à partir du fichier JSON
async function fetchMusicData() {
    try {
        const response = await fetch('https://api-main1.onrender.com/api/v1/musics');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Fonction pour jouer une musique
function playMusic(music) {
    lecteur.src = `${config.urlSound}${music.sound}`;
    lecteur.play();
    cover.src = `${config.urlCover}${music.cover}`;
    // Retirer la classe 'playing' de tous les éléments de la playlist
    document.querySelectorAll("li").forEach(item => item.classList.remove('playing'));
    // Ajouter la classe 'playing' à l'élément cliqué
    event.target.classList.add('playing');
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
        li.addEventListener("click", () => {
            playMusic(music);
        });
        playlist.appendChild(li);
    });
})();
