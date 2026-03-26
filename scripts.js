

function toggleForm(open){
    const form = document.getElementById('task-modal');
    if(open){
        form.classList.remove('hidden');
    }else{
        form.classList.add('hidden');
    }
}

function handleFormSubmission(state){

    const taskHeadingEl = document.getElementById('task-heading');
    const taskSubheadingEl = document.getElementById('task-subheading');
    const priorityEl = document.getElementById('task-priority');

    const taskHeading = taskHeadingEl.value.trim();
    const taskSubheading = taskSubheadingEl.value.trim();
    const priority = priorityEl.value;

    // create a card
    let card = document.createElement('div');
    card.classList.add('task-card');
    card.setAttribute('draggable', 'true');

    card.innerHTML=`
        <h4>${taskHeading}</h4>
        <p class="task-desc">${taskSubheading} </p>
        <p class="task-priority-${priority}">${priority}</p>
    `;

    const data= {
        id: parseInt(Math.random()*1000000),
        title: taskHeading,
        desc: taskSubheading,
        priority: priority,
        state: state
    }
    console.log(data);

    // saving to session storage
    const tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    tasks.push(data);
    localStorage.setItem('myTasks', JSON.stringify(tasks));

    const columnToAppend = document.getElementById(`task-container-${state}`);
    console.log(columnToAppend);
    columnToAppend.appendChild(card);

    // Reset inputs
    taskHeadingEl.value = '';
    taskSubheadingEl.value = '';
    priorityEl.value = 'easy';

    toggleForm(false);
    renderContent();
}

let stateToAppend = null;
// to add event through the + button in navbar
const addEvent = document.getElementById('add-Event');
addEvent.addEventListener('click', ()=>{
    stateToAppend= 'pending';
    toggleForm(true);
});

// making the close button in the input-form to be functional
const closeModal = document.getElementById('close-modal');
closeModal.addEventListener('click', ()=>{
    toggleForm(false);
    stateToAppend = null;
});

// making the submit button in the form to be functional
const submitModal=document.getElementById('create-task');
submitModal.addEventListener('click',()=>{
    // handle submission
    handleFormSubmission(stateToAppend);
    stateToAppend = null;
    renderContent();
});

const addNewTask = document.querySelectorAll('.add-new');

addNewTask.forEach((addNew)=>{
    addNew.addEventListener('click', (e)=>{
        const parentDiv = addNew.parentElement;
        const targetState= parentDiv.getAttribute('data-state');;

        console.log(JSON.parse(localStorage.getItem('myTasks')));
        stateToAppend = targetState;
        toggleForm(true);
        renderContent();

    });
});

function updateTasks(){
  const container = JSON.parse(localStorage.getItem('myTasks')) || [];
  container.forEach
}

function renderContent(){
    const container = JSON.parse(localStorage.getItem('myTasks')) || [];
    
    let pending='', ongoing='', underReview='', finished=''; 

    let totalTasks = container.length;
    let finishedCount = 0;

    container.forEach((task)=>{
        if(task.state == 'pending'){
            pending += `
                <div class="task-card" draggable="true" id="${task.id}">
                    <h4>${task.title}</h4>
                    <p class="task-desc">${task.desc}</p>
                    <p class="task-priority-${task.priority}">${task.priority}</p>
                </div>
            `;
        }else if(task.state == 'ongoing'){
            ongoing += `
                <div class="task-card" draggable="true" id="${task.id}">
                    <h4>${task.title}</h4>
                    <p class="task-desc">${task.desc}</p>
                    <p class="task-priority-${task.priority}">${task.priority}</p>
                </div>
            `;
        }else if(task.state == 'underReview'){
            underReview += `
                <div class="task-card" draggable="true" id="${task.id}">
                    <h4>${task.title}</h4>
                    <p class="task-desc">${task.desc}</p>
                    <p class="task-priority-${task.priority}">${task.priority}</p>
                </div>
            `;
        }else if(task.state == 'finished'){
            finishedCount++; // ✅ count completed
            finished += `
                <div class="task-card" draggable="true" id="${task.id}">
                    <h4>${task.title}</h4>
                    <p class="task-desc">${task.desc}</p>
                    <p class="task-priority-${task.priority}">${task.priority}</p>
                </div>
            `;
        }
    });

    // ✅ Calculate progress %
    let progress = totalTasks === 0 ? 0 : Math.round((finishedCount / totalTasks) * 100);

    // ✅ Update UI
    document.getElementById("progress-fill").style.width = progress + "%";
    document.getElementById("progress-text").innerText = progress + "%";

    // Existing rendering
    document.getElementById('task-container-pending').innerHTML = pending;
    document.getElementById('task-container-ongoing').innerHTML = ongoing;
    document.getElementById('task-container-underReview').innerHTML = underReview;
    document.getElementById('task-container-finished').innerHTML = finished;
}

renderContent();

function changeState(id, newState){
    const container = JSON.parse(localStorage.getItem('myTasks'));
    const element = container.find(p=>p.id.toString() ==id.toString());
    if(element){
        element.state = newState;
    }

    localStorage.setItem('myTasks', JSON.stringify(container));
    renderContent();
}

// implementing the drag and drop functionality
const containers = document.querySelectorAll('.task-container');


let elementBeingDragged = null;

// 1. Listen for drag events on the WHOLE board
document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('task-card')) {
        elementBeingDragged = e.target;
        // e.target.style.opacity = "0.5";

        e.target.classList.add('dragging');
        // console.log(e.target.id);

    }
});

document.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('task-card')) {
        elementBeingDragged = null;
        // e.target.style.opacity = "1";
        e.target.classList.remove('dragging');
    }
});

containers.forEach(container => {
    container.addEventListener('dragover', (e) => {
        e.preventDefault(); // Required to allow drop
        container.style.backgroundColor = "rgba(0,0,0,0.1)"; // Visual feedback
    });

    container.addEventListener('dragleave', () => {
        container.style.backgroundColor = "transparent"; // Reset feedback
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.style.backgroundColor = "transparent";
        if (elementBeingDragged) {
            // 1. Find the card that is immediately below our mouse cursor
            const afterElement = getDragAfterElement(container, e.clientY);
            
            if (afterElement == null) {
                // If no card is below us, just put it at the end
                container.appendChild(elementBeingDragged);

            } else {
                // If there is a card below us, insert our dragged card before it
                container.insertBefore(elementBeingDragged, afterElement);
            }

            changeState(elementBeingDragged.id, container.parentElement.getAttribute('data-state'));

            console.log(JSON.parse(localStorage.getItem('myTasks')));
            renderContent();
        }
    });
});

function getDragAfterElement(container, y){
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            // Calculate the distance between the mouse and the middle of the card
            const offset = y - box.top - box.height / 2;

            // We only care about cards the mouse is currently "above" (offset < 0)
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
}
function handleTimer() {
    let timerInterval = null;

    // Load from localStorage or default values
    let time = parseInt(localStorage.getItem("time")) || 25 * 60;
    let isRunning = localStorage.getItem("isRunning") === "true";
    let sessionCount = parseInt(localStorage.getItem("sessionCount")) || 0; 

    const timerDisplay = document.getElementById("timer");
    const stateDisplay = document.getElementById("state");
    const sessionDisplay = document.getElementById("sessionCount");
    const alarm = document.getElementById("alarm");
    const container = document.querySelector(".pomodoro");

    function saveState() {
        localStorage.setItem("time", time);
        localStorage.setItem("isRunning", isRunning);
        localStorage.setItem("sessionCount", sessionCount);
    }

    function updateDisplay() {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        timerDisplay.textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function setState(state) {
        stateDisplay.textContent = state;

        container.classList.remove("running", "paused", "idle");

        if (state === "Running") container.classList.add("running");
        else if (state === "Paused") container.classList.add("paused");
        else container.classList.add("idle");
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            time--;
            updateDisplay();
            saveState();

            if (time <= 0) {
                clearInterval(timerInterval);
                alarm.play();

                sessionCount++;
                sessionDisplay.textContent = sessionCount;

                isRunning = false;
                setState("Idle");

                time = 25 * 60;
                updateDisplay();
                saveState();
            }
        }, 1000);
    }

    document.getElementById("start").onclick = () => {
        if (isRunning) return;

        isRunning = true;
        setState("Running");
        saveState();

        startTimer();
    };

    document.getElementById("pause").onclick = () => {
        clearInterval(timerInterval);
        isRunning = false;
        setState("Paused");
        saveState();
    };

    document.getElementById("reset").onclick = () => {
        clearInterval(timerInterval);
        isRunning = false;
        time = 25 * 60;
        sessionCount = 0;

        updateDisplay();
        sessionDisplay.textContent = sessionCount;
        setState("Idle");
        saveState();
    };

    // Initialize UI
    updateDisplay();
    sessionDisplay.textContent = sessionCount;

    if (isRunning) {
        setState("Running");
        startTimer(); // resume automatically
    } else {
        setState("Paused"); // if it wasn't idle before reload
    }
}

handleTimer();


// music player logic

/* ============================================================
   MUSIC PLAYER — JavaScript SNIPPET
   Paste before your closing </body> tag.
   Uses the YouTube IFrame Player API (no preloaded files).
   ============================================================ */

/* -----------------------------------------------------------
   TRACK LIST  — edit these YouTube video IDs to your liking.
   Each entry needs: id (YouTube video ID), title, artist.
   ----------------------------------------------------------- */
const MP_TRACKS = [
  {
    id: "5qap5aO4i9A",           // lofi hip hop radio – beats to relax/study
    title: "Lofi Hip Hop Radio",
    artist: "Lofi Girl"
  },
  {
    id: "jfKfPfyJRdk",           // lofi hip hop radio 2 – beats to relax
    title: "Lofi Chill Beats",
    artist: "Lofi Girl"
  },
  {
    id: "4xDzrJKXOOY",           // synthwave radio
    title: "Synthwave Radio",
    artist: "Nightwave Plaza"
  },
  {
    id: "36YnV9STBqc",           // jazz & bossa nova
    title: "Jazz & Bossa Nova",
    artist: "Café Music BGM"
  },
  {
    id: "7NOSDKb0HlU",           // deep focus music
    title: "Deep Focus",
    artist: "Yellow Brick Cinema"
  }
];

/* -------- Internal state -------- */
const MP = {
  player: null,
  currentIndex: 0,
  isPlaying: false,
  apiReady: false,
  pendingPlay: false
};

/* -------- Load YouTube IFrame API dynamically -------- */
(function loadYTApi() {
  if (window.YT && window.YT.Player) { onYouTubeIframeAPIReady(); return; }
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
})();

/* Called automatically by the YT API script once loaded */
window.onYouTubeIframeAPIReady = function () {
  MP.player = new YT.Player('mp-yt-frame', {
    height: '1',
    width: '1',
    videoId: MP_TRACKS[MP.currentIndex].id,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      rel: 0,
      modestbranding: 1,
    },
    events: {
      onReady: mpOnPlayerReady,
      onStateChange: mpOnStateChange
    }
  });
};

function mpOnPlayerReady(event) {
  MP.apiReady = true;
  mpSetVolume(document.getElementById('mpVolume').value);
  mpBuildTracklist();
  mpUpdateInfo();
  if (MP.pendingPlay) { event.target.playVideo(); MP.pendingPlay = false; }
}

function mpOnStateChange(event) {
  const s = event.data;
  if (s === YT.PlayerState.PLAYING) {
    mpSetPlayingState(true);
  } else if (s === YT.PlayerState.PAUSED || s === YT.PlayerState.ENDED) {
    mpSetPlayingState(false);
    if (s === YT.PlayerState.ENDED) mpNext();
  } else if (s === YT.PlayerState.BUFFERING) {
    mpSetStatus('LOADING', 'loading');
  }
}

/* -------- UI helpers -------- */
function mpSetPlayingState(playing) {
  MP.isPlaying = playing;
  const vinyl = document.getElementById('mpVinyl');
  const eq = document.getElementById('mpEq');
  const iconPlay = document.querySelector('.mp-icon-play');
  const iconPause = document.querySelector('.mp-icon-pause');

  if (playing) {
    vinyl.classList.add('playing');
    eq.classList.add('active');
    iconPlay.style.display = 'none';
    iconPause.style.display = 'block';
    mpSetStatus('NOW PLAYING', '');
  } else {
    vinyl.classList.remove('playing');
    eq.classList.remove('active');
    iconPlay.style.display = 'block';
    iconPause.style.display = 'none';
    mpSetStatus('PAUSED', 'paused');
  }
}

function mpSetStatus(text, cls) {
  const el = document.getElementById('mpStatus');
  el.textContent = text;
  el.className = 'mp-status ' + (cls || '');
}

function mpUpdateInfo() {
  const t = MP_TRACKS[MP.currentIndex];
  document.getElementById('mpTitle').textContent = t.title;
  document.getElementById('mpArtist').textContent = t.artist;
  // Update active track in list
  document.querySelectorAll('.mp-track-item').forEach((el, i) => {
    el.classList.toggle('active', i === MP.currentIndex);
  });
}

function mpBuildTracklist() {
  const list = document.getElementById('mpTracklist');
  list.innerHTML = '';
  MP_TRACKS.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'mp-track-item' + (i === MP.currentIndex ? ' active' : '');
    item.innerHTML = `
      <div class="mp-track-playing-dot"></div>
      <span class="mp-track-num">${i + 1}</span>
      <div class="mp-track-meta">
        <div class="mp-track-name">${t.title}</div>
        <div class="mp-track-sub">${t.artist}</div>
      </div>
    `;
    item.addEventListener('click', () => mpLoadTrack(i, true));
    list.appendChild(item);
  });
}

/* -------- Playback controls -------- */
function mpLoadTrack(index, autoPlay = false) {
  MP.currentIndex = index;
  mpUpdateInfo();
  mpSetStatus('LOADING', 'loading');

  if (!MP.apiReady) {
    MP.pendingPlay = autoPlay;
    return;
  }

  if (autoPlay) {
    MP.player.loadVideoById(MP_TRACKS[index].id);
  } else {
    MP.player.cueVideoById(MP_TRACKS[index].id);
    mpSetPlayingState(false);
    mpSetStatus('READY', '');
  }
}

function mpTogglePlay() {
  if (!MP.apiReady) return;
  if (MP.isPlaying) {
    MP.player.pauseVideo();
  } else {
    MP.player.playVideo();
  }
}

function mpPrev() {
  const newIndex = (MP.currentIndex - 1 + MP_TRACKS.length) % MP_TRACKS.length;
  mpLoadTrack(newIndex, MP.isPlaying);
}

function mpNext() {
  const newIndex = (MP.currentIndex + 1) % MP_TRACKS.length;
  mpLoadTrack(newIndex, MP.isPlaying);
}

function mpSetVolume(val) {
  document.getElementById('mpVolVal').textContent = val;
  // Update slider fill
  const slider = document.getElementById('mpVolume');
  const pct = (val / 100) * 100;
  slider.style.background = `linear-gradient(to right, var(--mp-accent) ${pct}%, var(--mp-border) ${pct}%)`;
  if (MP.apiReady && MP.player) {
    MP.player.setVolume(val);
  }
}

/* -------- Wire up events after DOM ready -------- */
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('mpPlayPause').addEventListener('click', mpTogglePlay);
  document.getElementById('mpPrev').addEventListener('click', mpPrev);
  document.getElementById('mpNext').addEventListener('click', mpNext);

  const vol = document.getElementById('mpVolume');
  vol.addEventListener('input', function () { mpSetVolume(this.value); });

  // Init slider fill
  mpSetVolume(vol.value);

  // Keyboard shortcuts (optional)
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') { e.preventDefault(); mpTogglePlay(); }
    if (e.code === 'ArrowRight') mpNext();
    if (e.code === 'ArrowLeft') mpPrev();
  });
});

