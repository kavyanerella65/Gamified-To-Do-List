let xp = 0, level = 1;
const progressCircle = document.querySelector('.progress-ring_progress') || document.querySelector('.progress-ring_progress');
const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = circumference;

const introMusic=document.getElementById("introMusic");
const bgAudios = {
    1: document.getElementById("bgSound1"),
    2: document.getElementById("bgSound2"),
    3: document.getElementById("bgSound3"),
    4: document.getElementById("bgSound4"),
    5: document.getElementById("bgSound5")
};
const levelUpSound=document.getElementById("levelUpSound");
let currentBgAudio=null;
let musicMuted=false;

document.addEventListener("DOMContentLoaded", () => {
    introMusic.volume=0.6;
    introMusic.loop=true;
    introMusic.muted=false;
    introMusic.play().catch(() => {});

    document.querySelectorAll(".avatar").forEach(el => {
        el.addEventListener("click", playClickSound);
    });
    document.getElementById("addTaskBtn")?.addEventListener( "click",playClickSound);
    document.getElementById("taskInput")?.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            playClickSound();
            addTask();
        }
    });
    document.getElementById("taskList")?.addEventListener("click", e => {
        if (e.target.tagName === "BUTTON") playClickSound();
    });
    document.getElementById("musicToggleBtn").addEventListener("click", toggleMusic);
});

function playClickSound() {
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
}

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
}

function addTask() {
    playClickSound();
    const taskText = document.getElementById("taskInput").value;
    if (!taskText) return;
    const task = document.createElement("div");
    task.classList.add("task");
    task.innerHTML = `<span>${taskText}</span><button onclick="completeTask(this)">✔</button>`;
    document.getElementById("taskList").appendChild(task);
    document.getElementById("taskInput").value = "";
}

function completeTask(btn) {
    playClickSound();
    const task = btn.parentElement;
    if (!task.classList.contains("completed")) {
        task.classList.add("completed");
        xp += 20;
        if (xp >= 100) {
            level++;
            xp = 0;
            document.getElementById("level").innerText = level;
            levelUpAnimation();
        }
        document.getElementById("xp").innerText = xp;
        setProgress((xp / 100) * 100);
    }
}

function levelUpAnimation() {
    const trophy = document.getElementById("trophy");
    trophy.style.display = "block";
    trophy.style.animation = "spin 1s linear infinite";
    confetti({particleCount: 200, spread: 90, origin: { y: 0.6 }});

    if (levelUpSound) {
        levelUpSound.currentTime=0;
        levelUpSound.play();
    }
        setTimeout(() => {
        trophy.style.display = "none";
        trophy.style.animation = "none";
    }, 3000);
}


function selectAvatar(el, avatarIndex) {
    playClickSound();
    // Remove previous selection
    document.querySelectorAll(".avatar").forEach(a => a.classList.remove("selected"));
    el.classList.add("selected");

    // Avatar → Background mapping
    const backgrounds = {
        "avatar1.png": "assets/bgimages/avatar1bg.png",
        "avatar2.png": "assets/bgimages/avatar2bg.png",
        "avatar3.png": "assets/bgimages/avatar3bg.png",
        "avatar4.png": "assets/bgimages/avatar4bg.png",
        "avatar5.png": "assets/bgimages/avatar5bg.png"
    };

    // Get filename from clicked avatar src
    const filename = el.src.split('/').pop();

    // Change page background
    if (backgrounds[filename]) {
        document.body.style.background = `url('${backgrounds[filename]}') no-repeat center center fixed`;
        document.body.style.backgroundSize = "cover";
    }

    introMusic.pause();
    introMusic.currentTime=0;

    Object.values(bgAudios).forEach(audio => {
        audio.pause();
        audio.currentTime=0;
    });

    if (bgAudios[avatarIndex]) {
        currentBgAudio = bgAudios[avatarIndex];
        currentBgAudio.volume=0.6;
        currentBgAudio.loop=true;
        currentBgAudio.muted=musicMuted;
        currentBgAudio.currentTime=0;
        currentBgAudio.play().catch(() => {});
    }
}

function toggleMusic() {
    musicMuted=!musicMuted;
    introMusic.muted=musicMuted;
    Object.values(bgAudios).forEach(audio => audio.muted=musicMuted);
    if (currentBgAudio) currentBgAudio.muted=musicMuted;

    const btn=document.getElementById("musicToggleBtn");
    btn.textContent = musicMuted? "🔇 Music Off" : "🔊 Music On";

    if (musicMuted) {
        introMusic.pause();
        introMusic.currentTime=0;
        Object.values(bgAudios).forEach(audio => {
            audio.pause();
            audio.currentTime=0;
        });
    } else {
        if (currentBgAudio) {
            currentBgAudio.currentTime=0;
            currentBgAudio.play().catch( () => {});
        } else {
            introMusic.currentTime=0;
            introMusic.play().catch( () => {});
        }
    }
}