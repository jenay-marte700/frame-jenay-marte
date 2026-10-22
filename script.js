
const frame = document.querySelector('.frame');
const artist = 'PinkPantheress';

let albums = [];
let current = 0;

//itunes api
async function getData() {
    const url = 'https://itunes.apple.com/search?term='
        + encodeURIComponent(artist)
        + '&entity=song&limit=200';

    const response = await fetch(url);
    const data = await response.json();

// filter songs by artist
    const songs = data.results.filter(song =>
        song.artistName.toLowerCase() === artist.toLowerCase()
        && song.collectionName
        && song.artworkUrl100
    );

    // remove duplicates
    albums = [];

    for (let song of songs) {
        const alreadyAdded = albums.some(album =>
            album.collectionName === song.collectionName
        );

        if (!alreadyAdded) {
            albums.push(song);
        }
    }

    // list items
    frame.innerHTML = '';

    albums.forEach(album => {
        const item = document.createElement('li');
        item.textContent = album.collectionName;
        frame.appendChild(item);
    });

    showAlbum();
}

// display album
function showAlbum() {
    if (albums.length === 0) {
        document.querySelector('#artist').textContent =
            'No releases found';
        document.querySelector('#album').textContent = '';
        document.querySelector('#number').textContent = '';
        return;
    }

    const album = albums[current];

    document.querySelector('#cover').src =
        album.artworkUrl100.replace('100x100bb', '600x600bb');

    document.querySelector('#artist').textContent =
        album.artistName;

    document.querySelector('#album').textContent =
        album.collectionName;

    document.querySelector('#number').textContent =
        (current + 1) + ' / ' + albums.length;
}

// next
function nextAlbum() {
    if (albums.length === 0) return;

    current++;

    if (current >= albums.length) {
        current = 0;
    }

    showAlbum();
}

// back
function previousAlbum() {
    if (albums.length === 0) return;

    current--;

    if (current < 0) {
        current = albums.length - 1;
    }

    showAlbum();
}

// buttons
document.querySelector('#next').addEventListener('click', nextAlbum);
document.querySelector('#select').addEventListener('click', nextAlbum);
document.querySelector('#previous').addEventListener('click', previousAlbum);

document.querySelector('#menu').addEventListener('click', () => {
    current = 0;
    showAlbum();
});



getData().catch(error => {
    console.error('Could not load releases:', error);

    document.querySelector('#artist').textContent =
        'Could not load releases';
});
