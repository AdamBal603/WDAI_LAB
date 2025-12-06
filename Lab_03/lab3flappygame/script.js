const PIPE_GAP = 150;      // odstęp między rurą górną i dolną
const PIPE_INTERVAL = 900; // odstęp czasowy między pojawianiem rur (ms)
const PIPE_SPEED = 2;      // prędkość przesuwania rur
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreEl = document.getElementById("finalScore");
let isDead = false;    // ptak już uderzył w rurę
let isGameOver = false; // ptak uderzył w ziemię

// punkty
let score = 0;
const scoreEl = document.getElementById("score");

function updateScore() {
    pipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + 60 < bird.offsetLeft) {
            pipe.passed = true;
            score++;
            scoreEl.textContent = score;
        }
    });
}



// generowanie rur
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
    const pipeHeight = 320;   // wysokość graficzna rury

    const minTop = 88;        // minimalna pozycja otworu
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

let birdY = 200;
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
        hitGround();
    }
}


document.addEventListener("keydown", (e) => {
    if (e.code === "Space") flap();
});

document.addEventListener("click", flap);

function flap() {
    if (isDead) return;
    velocity = jump;
    gravityDelay = 20;
}

// kolizja z rurą
function checkCollision() {
    const birdRect = bird.getBoundingClientRect();
    const pipes = document.querySelectorAll(".pipe");

    pipes.forEach(pipe => {
        const pipeRect = pipe.getBoundingClientRect();

        if (
            birdRect.left < pipeRect.right &&
            birdRect.right > pipeRect.left &&
            birdRect.top < pipeRect.bottom &&
            birdRect.bottom > pipeRect.top
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

function hitPipe() {
    if (isDead) return;

    isDead = true;
    gameRunning = false;
    bird.style.transform = "rotate(90deg)";
}

function hitGround() {
    if (isGameOver) return;

    isGameOver = true;

    finalScoreEl.textContent = score;
    gameOverScreen.classList.remove("hidden");
}
