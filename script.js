const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballRadius = 8;

const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0
};

const computer = {
    x: canvas.width - 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0,
    speed: 4
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    dx: 5,
    dy: 5,
    speed: 5
};

const keys = {};
let mouseY = canvas.height / 2;

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update functions
function updatePlayerPaddle() {
    const moveSpeed = 6;
    
    // Mouse control
    if (mouseY < player.y + paddleHeight / 2) {
        player.y -= moveSpeed;
    } else if (mouseY > player.y + paddleHeight / 2) {
        player.y += moveSpeed;
    }
    
    // Arrow key control
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= moveSpeed;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - paddleHeight) {
        player.y += moveSpeed;
    }
    
    // Keep paddle in bounds
    player.y = Math.max(0, Math.min(canvas.height - paddleHeight, player.y));
}

function updateComputerPaddle() {
    const computerCenter = computer.y + computer.height / 2;
    const difficulty = 0.7; // Adjust computer difficulty (0-1, higher = harder)
    
    if (computerCenter < ball.y - 35) {
        computer.y += computer.speed * difficulty;
    } else if (computerCenter > ball.y + 35) {
        computer.y -= computer.speed * difficulty;
    }
    
    // Keep paddle in bounds
    computer.y = Math.max(0, Math.min(canvas.height - paddleHeight, computer.y));
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Wall collision (top and bottom)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
    }
    
    // Paddle collision
    if (ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height) {
        ball.dx = Math.abs(ball.dx);
        ball.x = player.x + player.width + ball.radius;
        const collidePoint = ball.y - (player.y + player.height / 2);
        collidePoint < 0 ? ball.dy = -ball.speed : ball.dy = ball.speed;
    }
    
    if (ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height) {
        ball.dx = -Math.abs(ball.dx);
        ball.x = computer.x - ball.radius;
        const collidePoint = ball.y - (computer.y + computer.height / 2);
        collidePoint < 0 ? ball.dy = -ball.speed : ball.dy = ball.speed;
    }
    
    // Score and reset
    if (ball.x < 0) {
        computer.score++;
        updateScore();
        resetBall();
    }
    
    if (ball.x > canvas.width) {
        player.score++;
        updateScore();
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() * 2 - 1) * ball.speed;
}

function updateScore() {
    document.getElementById('playerScore').textContent = player.score;
    document.getElementById('computerScore').textContent = computer.score;
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawCenter() {
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw elements
    drawCenter();
    drawPaddle(player);
    drawPaddle(computer);
    drawBall();
}

// Game loop
function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    player.score = 0;
    computer.score = 0;
    player.y = canvas.height / 2 - paddleHeight / 2;
    computer.y = canvas.height / 2 - paddleHeight / 2;
    resetBall();
    updateScore();
}

// Start the game
resetGame();
gameLoop();