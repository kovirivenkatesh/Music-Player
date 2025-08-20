document.addEventListener("DOMContentLoaded", () => {
  const progress = document.getElementById("progress");
  const song = document.getElementById("song");
  const ctrlIcon = document.getElementById("ctrlIcon");
  const title = document.getElementById("title");
  const artist = document.getElementById("artist");
  const songImg = document.getElementById("songImg");

  const overlay = document.getElementById("overlay");
  const tabPlaylist = document.getElementById("tabPlaylist");
  const tabAlbums = document.getElementById("tabAlbums");
  const sectionPlaylist = document.getElementById("sectionPlaylist");
  const sectionAlbums = document.getElementById("sectionAlbums");
  const allSongsList = document.getElementById("allSongs");
  const albumsContainer = document.getElementById("albums");

 
  const songsData = [
    {
      title: "Hungry Cheetah",
      artist: "Sujeeth | Thaman S",
      src: "playlist/[iSongs.info] 01 - Hungry Cheetah OG Glimpse.mp3",
      img: "song images/og 1.jpg",
      album: "OG",
      albumImg: "album images/og.jpg"
    },
    {
      title: "Firestorm",
      artist: "Sujeeth | Thaman S",
      src: "playlist/[iSongs.info] 02 - Firestorm.mp3",
      img: "song images/og 2.jpg",
      album: "OG",
      albumImg: "album images/og.jpg"
    },
    {
      title: "Prathi Kadalo",
      artist: "Child Singers Group",
      src: "playlist/Prathi Kadalo.mp3",
      img: "song images/salaar 2.jpg",
      album: "Salaar",
      albumImg: "album images/salaar.avif"
    },
    {
      title: "Sooreede",
      artist: "Harini Ivaturi",
      src: "playlist/Sooreede.mp3",
      img: "song images/salaar 1.jpg",
      album: "Salaar",
      albumImg: "album images/salaar.avif"
    },
    {
      title: "Sound of Salaar",
      artist: "Ravi Barsur Team",
      src: "playlist/Sound of Salaar.mp3",
      img: "song images/salaar 3.jpg",
      album: "Salaar",
      albumImg: "album images/salaar.avif"
    }
  ];

  let currentIndex = 0;

  // ===== Player logic =====
  function loadSong(index) {
    const s = songsData[index];
    currentIndex = index;
    song.src = s.src;
    title.textContent = s.title;
    artist.textContent = s.artist;
    songImg.src = s.img;
    song.load();
    highlightActiveListItem(index);
  }

  function playPause() {
    if (ctrlIcon.classList.contains("fa-pause")) {
      song.pause();
      ctrlIcon.classList.remove("fa-pause");
      ctrlIcon.classList.add("fa-play");
    } else {
      song.play();
      ctrlIcon.classList.add("fa-pause");
      ctrlIcon.classList.remove("fa-play");
    }
  }

  function nextSong() {
    // random next
    const next = Math.floor(Math.random() * songsData.length);
    loadSong(next);
    song.play();
    ctrlIcon.classList.add("fa-pause");
    ctrlIcon.classList.remove("fa-play");
  }

  function prevSong() {
    const prev = (currentIndex - 1 + songsData.length) % songsData.length;
    loadSong(prev);
    song.play();
    ctrlIcon.classList.add("fa-pause");
    ctrlIcon.classList.remove("fa-play");
  }

  // progress bar
  song.onloadedmetadata = () => {
    progress.max = song.duration || 0;
    progress.value = song.currentTime || 0;
  };

  setInterval(() => {
    if (!isNaN(song.currentTime)) {
      progress.value = song.currentTime;
    }
  }, 500);

  progress.onchange = () => {
    song.currentTime = progress.value;
    song.play();
    ctrlIcon.classList.add("fa-pause");
    ctrlIcon.classList.remove("fa-play");
  };

  song.addEventListener("ended", nextSong);

  // expose for HTML onclicks
  window.playPause = playPause;
  window.nextSong = nextSong;
  window.prevSong = prevSong;
  window.toggleOverlay = () => {
    overlay.classList.toggle("hidden");
  };

  // ===== Overlay tabs =====
  function showPlaylist() {
    tabPlaylist.classList.add("active");
    tabAlbums.classList.remove("active");
    sectionPlaylist.classList.remove("hidden");
    sectionAlbums.classList.add("hidden");
  }

  function showAlbums() {
    tabAlbums.classList.add("active");
    tabPlaylist.classList.remove("active");
    sectionAlbums.classList.remove("hidden");
    sectionPlaylist.classList.add("hidden");
  }

  tabPlaylist.addEventListener("click", showPlaylist);
  tabAlbums.addEventListener("click", showAlbums);

  // ===== Build Playlist (All Songs) =====
  function buildAllSongs() {
    allSongsList.innerHTML = "";
    songsData.forEach((s, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <i class="fa-solid fa-music"></i>
        <span>${s.title} – ${s.artist}</span>
      `;
      li.addEventListener("click", () => {
        loadSong(i);
        song.play();
        ctrlIcon.classList.add("fa-pause");
        ctrlIcon.classList.remove("fa-play");
        // keep overlay open as per your request (fixed & floating while scroll)
      });
      allSongsList.appendChild(li);
    });
  }

  // highlight active in "All Songs"
  function highlightActiveListItem(index) {
    const items = allSongsList.querySelectorAll("li");
    items.forEach((el, i) => el.classList.toggle("active", i === index));
  }

  // ===== Build Albums (grouped) =====
  function buildAlbums() {
    albumsContainer.innerHTML = "";
    const groups = {};

    // group by album
    songsData.forEach((s, i) => {
      if (!groups[s.album]) groups[s.album] = { img: s.albumImg || s.img, tracks: [] };
      groups[s.album].tracks.push({ ...s, index: i });
    });

    // create cards
    Object.keys(groups).forEach((albumName) => {
      const card = document.createElement("div");
      card.className = "album-card";

      const img = document.createElement("img");
      img.className = "album-cover";
      img.src = groups[albumName].img;

      const head = document.createElement("div");
      head.className = "album-head";

      const title = document.createElement("div");
      title.className = "album-title";
      title.textContent = albumName;

      const toggle = document.createElement("button");
      toggle.className = "album-toggle";
      toggle.textContent = "Tracks";

      head.appendChild(title);
      head.appendChild(toggle);

      const tracksList = document.createElement("ul");
      tracksList.className = "album-tracks hidden";

      groups[albumName].tracks.forEach((t) => {
        const li = document.createElement("li");
        li.textContent = `${t.title} - ${t.artist}`;
        li.addEventListener("click", () => {
          loadSong(t.index);
          song.play();
          ctrlIcon.classList.add("fa-pause");
          ctrlIcon.classList.remove("fa-play");
        });
        tracksList.appendChild(li);
      });

      toggle.addEventListener("click", () => {
        tracksList.classList.toggle("hidden");
      });

      card.appendChild(img);
      card.appendChild(head);
      card.appendChild(tracksList);

      albumsContainer.appendChild(card);
    });
  }

  // ===== Init =====
  buildAllSongs();
  buildAlbums();
  loadSong(currentIndex);
  showPlaylist(); // default tab
});
