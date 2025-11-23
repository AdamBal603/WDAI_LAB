const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

let startTime = 0;
let elapsed = 0;
let pausedAt = 0;
let interval = null;
let running = false;

function render(){
    const totalSec = Math.floor(elapsed / 1000);
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;

    if(minutes > 0){
        display.textContent = `${minutes}min ${seconds}s`;
    } else {
        display.textContent = `${seconds}s`;
    }
}

function start(){
    if(running) return;
    running = true;

    startTime = Date.now();
    interval = setInterval(() => {
        elapsed = Date.now() - startTime + pausedAt;
        render();
    }, 200);

    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = true;
}

function stop(){
    if(!running) return;
    running = false;

    clearInterval(interval);
    pausedAt = Date.now() - startTime + pausedAt;

    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = false;
    }

function reset(){
    running = false;
    clearInterval(interval);
    elapsed = 0;
    render();

    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = false;
}

startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stop);
resetBtn.addEventListener("click", reset);

render();