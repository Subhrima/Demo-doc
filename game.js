const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 16;
const PLAYER_X = 30;
const AI_X = canvas.width - 30 - PADDLE_WIDTH;

// Game state
let playerY = canvas.height/2 - PADDLE_HEIGHT/2;
let aiY = canvas.height/2 - PADDLE_HEIGHT/2;
let ballX = canvas.width/2 - BALL_SIZE/2;
let ballY = canvas.height/2 - BALL_SIZE/2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() * 2 - 1);

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

function draw() {
    // Background
    drawRect(0, 0, canvas.width, canvas.height, '#23262e');
    // Net
    for (let i = 20; i < canvas.height; i += 40) {
        drawRect(canvas.width/2-2, i, 4, 25, '#444');
    }
    // Player paddle
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');
    // AI paddle
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');
    // Ball
    drawCircle(ballX+BALL_SIZE/2, ballY+BALL_SIZE/2, BALL_SIZE/2, '#f6d32d');
}

function update() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom wall collision
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballSpeedY *= -1;
        ballY = Math.max(0, Math.min(ballY, canvas.height - BALL_SIZE));
    }

    // Left paddle collision
    if (
        ballX <= PLAYER_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT &&
        ballX >= PLAYER_X // prevent ball from sticking "behind"
    ) {
        ballSpeedX *= -1.1; // bounce and speed up a bit
        // Add some randomness based on where it hits the paddle
        let collidePoint = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
        let normalize = collidePoint / (PADDLE_HEIGHT/2);
        ballSpeedY = normalize * 5;
        ballX = PLAYER_X + PADDLE_WIDTH; // prevent sticking
    }

    // Right paddle (AI) collision
    if (
        ballX + BALL_SIZE >= AI_X &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT &&
        ballX + BALL_SIZE <= AI_X + PADDLE_WIDTH + BALL_SIZE // prevent ball from sticking "behind"
    ) {
        ballSpeedX *= -1.1;
        let collidePoint = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
        let normalize = collidePoint / (PADDLE_HEIGHT/2);
        ballSpeedY = normalize * 5;
        ballX = AI_X - BALL_SIZE;
    }

    // Reset if ball goes out
    if (ballX < 0 || ballX > canvas.width) {
        resetBall();
    }

    // Simple AI: follow the ball
    let aiCenter = aiY + PADDLE_HEIGHT/2;
    if (aiCenter < ballY + BALL_SIZE/2 - 10) {
        aiY += 4;
    } else if (aiCenter > ballY + BALL_SIZE/2 + 10) {
        aiY -= 4;
    }
    // Clamp AI paddle
    aiY = Math.max(0, Math.min(aiY, canvas.height - PADDLE_HEIGHT));
}

function resetBall() {
    ballX = canvas.width/2 - BALL_SIZE/2;
    ballY = canvas.height/2 - BALL_SIZE/2;
    // Randomize starting direction
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random() * 2 - 1);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Mouse controls for player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT/2;
    // Clamp
    playerY = Math.max(0, Math.min(playerY, canvas.height - PADDLE_HEIGHT));
});

// Start the game
gameLoop();
