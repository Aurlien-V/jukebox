// Constantes pour les éléments du lecteur
const playlist = document.getElementById("playlist");
const lecteur = document.querySelector("#lecteur");
const cover = document.getElementById("cover");
const disque = document.getElementById("disque");
const randomButton = document.getElementById("randomButton");
const disqueRotation = document.querySelector(".disque");
const backgroundVideo = document.getElementById('background-video'); 

// Configuration des URLs pour les covers et les musiques
const config = {
    urlCover: "uploads/covers/",
    urlSound: "uploads/musics/",
    urlVideo: "uploads/video/",
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

// Fonction pour construire la playlist
function buildPlaylist(data) {
    data.forEach((music) => {
        playlist.innerHTML += `<li id="${music.id}"><h2>${music.title}</h2><div><small>${music.category}</small></div></li>`;
    });
}

// Fonction pour ajouter les écouteurs d'événements
function addEventListeners() {
    const allLi = document.querySelectorAll("li");
    allLi.forEach((li) => {
        li.addEventListener("click", function (elem) {
            // Retirer la classe 'playing' de tous les éléments de la playlist
            allLi.forEach(item => item.classList.remove('playing'));

            const id = parseInt(li.id);
            const searchById = data.find((element) => element.id === id);
            lecteur.src = `${config.urlSound}${searchById.sound}`;
            lecteur.play();
            cover.src = `${config.urlCover}${searchById.cover}`;
            if (disque.classList.contains("pause")) {
                disque.classList.remove("pause");
            }
            // Ajouter la classe 'playing' à l'élément cliqué
            li.classList.add('playing');

            // Mettre à jour la vidéo de fond
            updateBackgroundVideo(id);
        });
    });
}

// Fonction pour mettre à jour la vidéo de fond en fonction de la musique sélectionnée
function updateBackgroundVideo(musicId) {
    const selectedMusic = data.find(music => music.id === musicId);
    if (selectedMusic) {
        // Réinitialiser la vidéo de fond
        backgroundVideo.pause();
        backgroundVideo.load();
        
        // Changer la source de la vidéo de fond
        backgroundVideo.src = `${config.urlVideo}${selectedMusic.video}`;
        
        // Assurez-vous de démarrer la vidéo si elle n'est pas déjà en cours de lecture
        backgroundVideo.play();
    } else {
        console.error(`Musique avec l'ID ${musicId} non trouvée.`);
    }
}

// Fonction pour sélectionner une musique aléatoire
function getRandomMusic(musicData) {
    let randomMusic;
    do {
        const randomIndex = Math.floor(Math.random() * musicData.length);
        randomMusic = musicData[randomIndex];
    } while (randomMusic === lastPlayed && musicData.length > 1);
    lastPlayed = randomMusic;
    return randomMusic;
}

// Fonction pour mettre à jour la musique aléatoire
function updateRandomMusic(data) {
    const randomMusic = getRandomMusic(data);
    lecteur.src = `${config.urlSound}${randomMusic.sound}`;
    cover.src = `${config.urlCover}${randomMusic.cover}`;
    backgroundVideo.src = `${config.urlVideo}${randomMusic.video}`;

    // Créer une nouvelle promesse qui se résout lorsque la piste audio est prête à être lue
    const audioReady = new Promise(resolve => {
        lecteur.oncanplaythrough = resolve;
    });

    // Utiliser la promesse pour attendre que la piste audio soit prête avant de la lire
    audioReady.then(() => {
        lecteur.play();
        if (backgroundVideo.readyState >= 4) {
            backgroundVideo.play();
        }
    });

    // Retirer la classe 'playing' de tous les éléments de la playlist
    const allLi = document.querySelectorAll("li");
    allLi.forEach(item => item.classList.remove('playing'));
    
    // Trouver l'élément de la playlist correspondant à la nouvelle musique aléatoire
    const selectedLi = document.getElementById(randomMusic.id);
    // Ajouter la classe 'playing' à l'élément de la playlist correspondant
    selectedLi.classList.add('playing');

    // Retirer la classe 'random' de tous les éléments de la playlist
    allLi.forEach(item => item.classList.remove('random'));
    
    // Ajouter la classe 'random' à l'élément de la playlist correspondant à la nouvelle musique aléatoire
    selectedLi.classList.add('random');

    // Déplacer l'élément en cours de lecture en haut de la liste
    moveSelectedToTop();
}

// Fonction pour déplacer l'élément en cours de lecture en haut de la liste
function moveSelectedToTop() {
    const playingLi = document.querySelector("li.playing");
    if (playingLi) {
        playlist.prepend(playingLi);
    }
}

// Gestionnaire d'événement pour le clic sur le bouton de musique aléatoire
randomButton.addEventListener("click", () => {
    updateRandomMusic(data);
});

// Point d'entrée
(async () => {
    // Récupérer les données
    data = await fetchMusicData();

    // Construire la playlist
    buildPlaylist(data);

    // Ajouter les écouteurs d'événements
    addEventListeners();
})();

// Ajouter un gestionnaire d'événements pour détecter la fin de la musique
lecteur.addEventListener("ended", () => {
    disqueRotation.classList.add("pause");
    updateRandomMusic(data);
});

// Ajouter un gestionnaire d'événements pour détecter lorsque la musique est en pause
lecteur.addEventListener("pause", () => {
    disqueRotation.classList.add("pause");
});

// Ajouter un gestionnaire d'événements pour détecter lorsque la musique reprend la lecture
lecteur.addEventListener("play", () => {
    disqueRotation.classList.remove("pause");
});

// Gestionnaire d'événement window.onload
window.onload = function() {
    // Lecture automatique de la vidéo lorsque la musique démarre
    lecteur.onplay = function() {
        backgroundVideo.play();
    };

    // Pause de la vidéo lorsque la musique est mise en pause ou terminée
    lecteur.onpause = lecteur.onended = function() {
        backgroundVideo.pause();
    };
};
