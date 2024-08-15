
const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement; // eldtrich typescript as expression
const c = canvas.getContext("2d")!;


canvas.style.backgroundColor = "black"; // Change this to the desired color

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//  Types
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

type TinySquare = {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    lifetime: number;
};

//  declare type of Ball
type Ball = {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    width: number;
    height: number;
    fillStyle: string;
    previousPositions: { x: number, y: number }[]; // Track past positions
    hitEdges: { x: number, y: number, time: number, tinySquares: TinySquare[] }[];
};

type Paddle = {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    width: number;
    height: number;
    fillStyle: string;
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//  Model or State
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

// new code
let balls = [
    {
        x: 100,
        y: 50,
        velocityX: 2,
        velocityY: 1.75,
        width: 20,
        height: 20,
        fillStyle: "rgba(0, 255, 210, 1)",
        previousPositions: [{ x: 100, y: 50 }], // Initial position
        hitEdges: []
    },
];
// Paddle array
let paddleArray: Paddle[] = [
    {
        x: 50,
        y: canvas.height / 2 - 50,
        velocityX: 0,
        velocityY: 3,
        width: 20,
        height: 30,
        fillStyle: "crimson"
    },
    {
        x: 330,
        y: canvas.height / 2 - 50,
        velocityX: 0,
        velocityY: 3,
        width: 20,
        height: 30,
        fillStyle: "crimson"
    }
];

let leftscore = 0;
let rightscore = 0;

const keyState: { [key: string]: boolean } = {}; ``

document.body.addEventListener("keydown", (event: KeyboardEvent) => {
    keyState[event.key] = true;
});

document.body.addEventListener("keyup", (event: KeyboardEvent) => {
    keyState[event.key] = false;
});
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//  Frame Updates
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

function updateBall(ball: Ball, currentTime: number) {
    ball.previousPositions.unshift({ x: ball.x, y: ball.y });

    if (ball.previousPositions.length > 50) {
        ball.previousPositions.pop();
    }
    
    let hitEdge = false;

    if (ball.x > canvas.clientWidth - ball.width) {
        ball.velocityX = -ball.velocityX;
        ball.x = canvas.clientWidth - ball.width;
        hitEdge = true;
        leftscore += 1;
        resetBoard();
    }
    if (ball.x < 0) {
        ball.velocityX = -ball.velocityX;
        ball.x = 0;
        hitEdge = true;
        rightscore += 1;
        resetBoard();
    }
    if (ball.y > canvas.clientHeight - ball.height) {
        ball.velocityY = -ball.velocityY;
        ball.y = canvas.clientHeight - ball.height;
        hitEdge = true;
    }
    if (ball.y < 0) {
        ball.velocityY = -ball.velocityY;
        ball.y = 0;
        hitEdge = true;
    }

    // Store the hit edge data with timestamp and tinySquares if it occurred
    if (hitEdge) {
        const tinySquares: TinySquare[] = [];
        const explosionCenterX = ball.x + ball.width / 2;
        const explosionCenterY = ball.y + ball.height / 2;

        for (let i = 0; i < 2000; i++) {
            // Generates a random direction in radians
            const theta = Math.random() * 2 * Math.PI;

            // Calculate the coordinates (x, y) on the unit circle
            const speed = Math.random();
            const velocityX = Math.cos(theta) * speed;
            const velocityY = Math.sin(theta) * speed;

            // Distance from the center of the explosion
            const distance = Math.random() * ball.width;

            // Calculate the position of the tiny square
            const tinySquareX = explosionCenterX + Math.cos(theta) * distance;
            const tinySquareY = explosionCenterY + Math.sin(theta) * distance;

            tinySquares.push({
                x: tinySquareX,
                y: tinySquareY,
                velocityX: velocityX,
                velocityY: velocityY,
                lifetime: 500
            });
        }

        ball.hitEdges.unshift({ x: ball.x, y: ball.y, time: currentTime, tinySquares });

        const cutoffTime = currentTime - 5000;
        ball.hitEdges = ball.hitEdges.filter(edge => edge.time > cutoffTime);
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
}
function drawball(ball: Ball) {
    // Draw the trail
    for (let i = 0; i < ball.previousPositions.length; i++) {
        const alpha = 0.8 - i / ball.previousPositions.length; // Fade effect
        c.fillStyle = `rgba(0, 255, 210, ${alpha})`; // Red with decreasing opacity
        const pos = ball.previousPositions[i];
        const width = alpha * ball.width / 2;
        const height = alpha * ball.height / 2;
        c.fillRect(pos.x + (ball.width - width) / 2, pos.y + (ball.height - height) / 2, width, height);
    }

    // Draw the hit edge effects
    for (const hitEdge of ball.hitEdges) {
        for (const tinySquare of hitEdge.tinySquares) {
            const alpha = tinySquare.lifetime / 500; // Fades out over its lifetime
            c.fillStyle = `rgba(157, 0, 255, ${alpha})`;
            c.fillRect(tinySquare.x, tinySquare.y, 1, 1); // Small squares

            tinySquare.x += tinySquare.velocityX;
            tinySquare.y += tinySquare.velocityY;
            tinySquare.lifetime -= 12; // Assuming 60fps, each frame is ~16ms
        }

        // Filter out expired tiny squares
        hitEdge.tinySquares = hitEdge.tinySquares.filter(sq => sq.lifetime > 0);
    }

    // Draw the current ball
    c.fillStyle = ball.fillStyle;
    c.fillRect(ball.x, ball.y, ball.width, ball.height);
}
function drawPaddle(paddle: Paddle) {
    c.fillStyle = paddle.fillStyle;
    c.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function detectPaddleColission(paddle: Paddle, ball: Ball) {
    return !(
        paddle.x + paddle.width < ball.x ||
        paddle.x > ball.x + ball.width ||
        paddle.y + paddle.height < ball.y ||
        paddle.y > ball.y + ball.height
    );
}

function handleCollision(paddle: Paddle, ball: Ball) {
    if (detectPaddleColission(paddle, ball)) {
        // Determine collision side
        const ballCenterX = ball.x + ball.width / 2;
        const ballCenterY = ball.y + ball.height / 2;
        const paddleCenterX = paddle.x + paddle.width / 2;
        const paddleCenterY = paddle.y + paddle.height / 2;

        const dx = ballCenterX - paddleCenterX;
        const dy = ballCenterY - paddleCenterY;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Collision on the sides of the paddle
            if (dx > 0) {
                ball.x = paddle.x + paddle.width;

            } else {
                ball.x = paddle.x - ball.width;

            }
            ball.velocityX = -ball.velocityX; // Reverse X velocity
            ball.velocityX += Math.sign(ball.velocityX) * 0.2;
            ball.velocityY += Math.sign(ball.velocityY) * 0.1;
        } else {
            // Collision on the top or bottom of the paddle
            if (dy > 0) {
                ball.y = paddle.y + paddle.height;

            } else {
                ball.y = paddle.y - ball.height;

            }
            ball.velocityY = -ball.velocityY; // Reverse Y velocity

        }
    }
}

function updatePaddles() {
    if (keyState["w"]) {
        paddleArray[0].y -= paddleArray[0].velocityY;
    }
    if (keyState["s"]) {
        paddleArray[0].y += paddleArray[0].velocityY;
    }
    if (keyState["a"]) {
        paddleArray[0].x -= paddleArray[0].velocityX;
    }
    if (keyState["d"]) {
        paddleArray[0].x += paddleArray[0].velocityX;
    }
    // Example for second paddle (assuming keys 'i', 'k', 'j', 'l' are used):
    if (keyState["5"]) {
        paddleArray[1].y -= paddleArray[1].velocityY;
    }
    if (keyState["2"]) {
        paddleArray[1].y += paddleArray[1].velocityY;
    }
    if (keyState["1"]) {
        paddleArray[1].x -= paddleArray[1].velocityX;
    }
    if (keyState["3"]) {
        paddleArray[1].x += paddleArray[1].velocityX;
    }
    for (let paddle of paddleArray) {
        if (paddle.y > canvas.clientHeight - paddle.height) {
            paddle.y = canvas.clientHeight - paddle.height;
        }
        if (paddle.y < 0) {
            paddle.y = 0;
        }
    }

}

function resetBoard() {
    // Reset ball to the center of the canvas
    const ball = balls[0];
    ball.x = canvas.width / 2 - ball.width / 2;
    ball.y = canvas.height / 2 - ball.height / 2;

    // Reset the ball's velocity
    ball.velocityX = 2;
    ball.velocityY = 1.75;

    // Reset paddles to their initial positions
    paddleArray[0].y = canvas.height / 2 - paddleArray[0].height / 2;
    paddleArray[1].y = canvas.height / 2 - paddleArray[1].height / 2;

    // Pause for a moment before resuming the game
}

function frame() {
    const currentTime = Date.now(); // Get the current timestamp

    // Clear the screen
    c.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // Update paddles based on key states
    updatePaddles();

                                                 // Update and draw balls
    for (let ball of balls) {
        updateBall(ball, currentTime);
        drawball(ball);
    }

    // Draw paddles
    for (let paddle of paddleArray) {
        drawPaddle(paddle);
    }

    // Handle collisions
    for (let paddle of paddleArray) {
        for (let ball of balls) {
            handleCollision(paddle, ball);
        }
    }
function drawscore() {
    c.font = '30px Arial';
c.fillStyle = 'rgba(77,77,255)';
c.textAlign = 'center';
c.textBaseline = 'middle';  
c.fillText(leftscore + '     ' + rightscore, canvas.width / 2, canvas.height / 10);
}
drawscore();


    // Request a new frame
    requestAnimationFrame(frame);
}
frame();
