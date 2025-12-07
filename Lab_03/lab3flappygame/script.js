// dźwięki
const dieSFX = new Audio("assets/Sound Efects/die.wav");
const hitSFX = new Audio("assets/Sound Efects/hit.wav");
const pointSFX = new Audio("assets/Sound Efects/point.wav");
const swooshSFX = new Audio("assets/Sound Efects/swoosh.wav");
const wingSFX = new Audio("assets/Sound Efects/wing.wav");

// punkty
let score = 0;
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("finalScore");
const bestScoreEl = document.getElementById("bestScore");
let bestScore = localStorage.getItem("bestScore") || 0;

bestScoreEl.textContent = "Rekord: " + bestScore;

function updateScore() {
    pipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + 60 < bird.offsetLeft) {
            pipe.passed = true;
            score++;
            scoreEl.textContent = score;
            pointSFX.currentTime = 0;
            pointSFX.play();
        }
    });
}

document.addEventListener("keydown", function(event) {
    if(event.key === "r" || event.key === "R") {
        localStorage.clear();
        bestScore = 0;
        alert("Rekord został zresetowany");
    }
});

// koniec gry
const gameOverScreen = document.getElementById("gameOverScreen");
let isDead = false;
let isGameOver = false;

function hitPipe() {
    if (isDead) return;

    hitSFX.play();
    dieSFX.play();
    isDead = true;
    gameRunning = false;
    bird.style.transform = "rotate(90deg)";
}

function hitGround() {
    if (isGameOver) return;

    if (!isDead) hitSFX.play();

    isGameOver = true;

    setTimeout(() => {
        swooshSFX.play();

        finalScoreEl.textContent = score;

        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem("bestScore", bestScore);
        }

        bestScoreEl.textContent = bestScore;

        gameOverScreen.classList.remove("hidden");

    }, 300);

}

// generowanie rur
const PIPE_GAP = 150;      // odstęp między rurą górną i dolną
const PIPE_INTERVAL = 1200; // odstęp czasowy między pojawianiem rur (ms)
const PIPE_SPEED = 2;      // prędkość przesuwania rur

const pipesContainer = document.getElementById("pipes");
let pipes = [];
let gameRunning = false;

function startPipes() {
    gameRunning = true;
    spawnPipe();
    setInterval(spawnPipe, PIPE_INTERVAL);
}

function spawnPipe() {
    if (!gameRunning) return;

    const screenHeight = window.innerHeight;
    const pipeHeight = 320;

    const minTop = 90;
    const maxTop = screenHeight - PIPE_GAP - pipeHeight + minTop;

    const gapTop = Math.max(minTop, Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop);

    // --- RURA GÓRNA ---
    const topPipe = document.createElement("img");
    topPipe.src = "assets/Flappy Bird/pipe-green.png";
    topPipe.classList.add("pipe", "pipe-top");
    topPipe.style.left = "100vw";
    topPipe.style.top = (gapTop - pipeHeight) + "px";

    // --- RURA DOLNA ---
    const bottomPipe = document.createElement("img");
    bottomPipe.src = "assets/Flappy Bird/pipe-green.png";
    bottomPipe.classList.add("pipe");
    bottomPipe.style.left = "100vw";
    bottomPipe.style.top = (gapTop + PIPE_GAP) + "px";

    pipesContainer.appendChild(topPipe);
    pipesContainer.appendChild(bottomPipe);

    pipes.push({ topPipe, bottomPipe, x: window.innerWidth, passed: false });
}

// scrollowanie rur
function updatePipes() {
    if (isDead) return;

    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.x -= PIPE_SPEED;

        pipe.topPipe.style.left = pipe.x + "px";
        pipe.bottomPipe.style.left = pipe.x + "px";

        // Usuwanie rur, które wyszły poza ekran
        if (pipe.x < -60) {
            pipe.topPipe.remove();
            pipe.bottomPipe.remove();
            pipes.splice(i, 1);
        }
    }
}

// ptaszek
const bird = document.getElementById("bird");

let birdY = 300;
let velocity = 0;
let gravity = 0.1;
let jump = -2;
let gravityDelay = 0;
let gameOver = false;

function updateBird() {
    if (!isDead) {
        if (gravityDelay > 0) {
            gravityDelay--;
        } else {
            velocity += gravity;
        }
    } else {
        velocity += gravity;
    }

    birdY += velocity;
    bird.style.top = birdY + "px";

    if (!isDead) {
        bird.style.transform = velocity < 0
            ? "rotate(-25deg)"
            : "rotate(35deg)";
    }

    if (birdY > 520) {
        bird.style.transform = "rotate(90deg)";
        hitGround();
    }
}


document.addEventListener("keydown", (e) => {
    if (e.code === "Space") flap();
});

document.addEventListener("click", flap);

function flap() {
    if (isDead) return;
    wingSFX.currentTime = 0;
    wingSFX.play();
    velocity = jump;
    gravityDelay = 20;
}

// kolizja z rurą lub sufitem
function checkCollision() {
    const birdRect = bird.getBoundingClientRect();
    const pipes = document.querySelectorAll(".pipe");

    pipes.forEach(pipe => {
        const pipeRect = pipe.getBoundingClientRect();

        if (
            (birdRect.left < pipeRect.right &&
            birdRect.right > pipeRect.left &&
            birdRect.top < pipeRect.bottom &&
            birdRect.bottom > pipeRect.top) ||
            birdY < 0
        ) {
            hitPipe();
        }
    });
}


// scrollowanie podłoża
const base = document.getElementById("base");
let offset = 0;

function animateBase() {
    if (!isDead) {
        offset -= 2;
        base.style.backgroundPositionX = offset + "px";
    }
    
    requestAnimationFrame(animateBase);
}

animateBase();

// rozpoczęcie gry
const message = document.getElementById("message");
let gameStarted = false;

document.addEventListener("click", startGame);
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") startGame();
});

function gameLoop() {
    if (isGameOver) return;

    updateScore();
    updateBird();
    updatePipes();
    checkCollision();

    requestAnimationFrame(gameLoop);
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        message.classList.add("hidden");
        startPipes();
        gameLoop();
    }
}
