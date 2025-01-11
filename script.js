const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const bird = {
    x: 50,
    y: 300,
    width: 40,
    height: 90,
    gravity: 0.5,
    lift: -10,
    velocity: 0,
    image: null // Placeholder for the bird image
};

const pipes = [];
const pipeWidth = 50;
const gap = 250;
const pipeSpacing = 300;
let score = 0;
let isGameOver = false;

// Load the bird image
bird.image = new Image();
bird.image.src = 'S.PNG'; // Replace with your friend's image file path

// Load pipe image
const pipeImage = new Image();
pipeImage.src = 'anjal.PNG'; // Replace with your bamboo image file path

// Wait for both images to load before starting the game
let assetsLoaded = 0;
bird.image.onload = () => assetsLoaded++;
pipeImage.onload = () => assetsLoaded++;

// Initialize pipes
function initPipes() {
    for (let i = 0; i < 5; i++) {
        const pipeX = canvas.width + i * pipeSpacing;
        const topHeight = Math.random() * (canvas.height / 2);
        const bottomHeight = canvas.height - topHeight - gap;

        pipes.push({
            top: { x: pipeX, y: 0, width: pipeWidth, height: topHeight },
            bottom: { x: pipeX, y: canvas.height - bottomHeight, width: pipeWidth, height: bottomHeight }
        });
    }
}

// Draw bird (replace rectangle with image)
function drawBird() {
    if (bird.image.complete) {
        ctx.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
    } else {
        // Fallback if image hasn't loaded yet
        ctx.fillStyle = '#FF5733';
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    }
}

// Draw pipes with image
function drawPipes() {
    pipes.forEach(pipe => {
        if (pipeImage.complete) {
            // Draw top pipe
            ctx.drawImage(pipeImage, pipe.top.x, pipe.top.y, pipe.top.width, pipe.top.height);
            // Draw bottom pipe
            ctx.drawImage(pipeImage, pipe.bottom.x, pipe.bottom.y, pipe.bottom.width, pipe.bottom.height);
        } else {
            // Fallback if image hasn't loaded yet
            ctx.fillStyle = '#228B22'; // Green for pipes
            ctx.fillRect(pipe.top.x, pipe.top.y, pipe.top.width, pipe.top.height);
            ctx.fillRect(pipe.bottom.x, pipe.bottom.y, pipe.bottom.width, pipe.bottom.height);
        }
    });
}

// Update bird position
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        endGame();
    }
}

// Update pipes
function updatePipes() {
    pipes.forEach(pipe => {
        pipe.top.x -= 2;
        pipe.bottom.x -= 2;
    });

    if (pipes.length && pipes[0].top.x + pipeWidth < 0) {
        pipes.shift();
        score++;
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].top.x < canvas.width - pipeSpacing) {
        const pipeX = pipes[pipes.length - 1].top.x + pipeSpacing;
        const topHeight = Math.random() * (canvas.height / 2);
        const bottomHeight = canvas.height - topHeight - gap;

        pipes.push({
            top: { x: pipeX, y: 0, width: pipeWidth, height: topHeight },
            bottom: { x: pipeX, y: canvas.height - bottomHeight, width: pipeWidth, height: bottomHeight }
        });
    }
}

// Check collisions
function checkCollisions() {
    pipes.forEach(pipe => {
        if (
            (bird.x < pipe.top.x + pipeWidth &&
                bird.x + bird.width > pipe.top.x &&
                bird.y < pipe.top.height) ||
            (bird.x < pipe.bottom.x + pipeWidth &&
                bird.x + bird.width > pipe.bottom.x &&
                bird.y + bird.height > pipe.bottom.y)
        ) {
            endGame();
        }
    });
}

// End game
function endGame() {
    isGameOver = true;
    alert(`Game Over! Your score: ${score}`);
    document.location.reload();
}

// Draw score
function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`score 5 nhi par kiya to gay hai tu: ${score}`, 10, 30);
}

// Handle key press
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        bird.velocity = bird.lift;
    }
});

// Game loop
function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateBird();
    updatePipes();
    checkCollisions();

    drawBird();
    drawPipes();
    drawScore();

    requestAnimationFrame(gameLoop);
}

// Start the game when both images are loaded
function startGame() {
    if (assetsLoaded === 2) {
        initPipes();
        gameLoop();
    } else {
        setTimeout(startGame, 100);
    }
}

startGame();
