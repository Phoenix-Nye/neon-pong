
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
    positionX: number;
    positionY: number;
    velocityX: number;
    velocityY: number;
    ballWidth: number;
    ballHeight: number;
    fillStyle: string;
    previousPositions: { x: number, y: number }[]; // Track past positions
    hitEdges: { x: number, y: number, time: number, tinySquares: TinySquare[] }[];
};

type Paddle = {
    positionX: number;
    positionY: number;
    velocityX: number;
    velocityY: number;
    paddleWidth: number;
    paddleHeight: number;
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
        positionX: 100,
        positionY: 50,
        velocityX: 6,
        velocityY: 2,
        ballWidth: 20,
        ballHeight: 20,
        fillStyle: "rgba(0, 255, 210, 1)",
        previousPositions: [{ x: 100, y: 50 }], // Initial position
        hitEdges: []
    },
];
// Paddle array
let paddleArray: Paddle[] = [
    {
        positionX: 50,
        positionY: canvas.height / 2 - 50,
        velocityX: 0,
        velocityY: 5,
        paddleWidth: 20,
        paddleHeight: 30,
        fillStyle: "crimson"
    },
    {
        positionX: 330,
        positionY: canvas.height / 2 - 50,
        velocityX: 0,
        velocityY: 5,
        paddleWidth: 20,
        paddleHeight: 30,
        fillStyle: "crimson"
    }
];

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

function updateball(ball: Ball, currentTime: number) {
    ball.previousPositions.unshift({ x: ball.positionX, y: ball.positionY });

    if (ball.previousPositions.length > 50) {
        ball.previousPositions.pop();
    }

    let hitEdge = false;

    if (ball.positionX > canvas.clientWidth - ball.ballWidth) {
        ball.velocityX = -ball.velocityX;
        ball.positionX = canvas.clientWidth - ball.ballWidth;
        hitEdge = true;
    }
    if (ball.positionX < 0) {
        ball.velocityX = -ball.velocityX;
        ball.positionX = 0;
        hitEdge = true;
    }
    if (ball.positionY > canvas.clientHeight - ball.ballHeight) {
        ball.velocityY = -ball.velocityY;
        ball.positionY = canvas.clientHeight - ball.ballHeight;
        hitEdge = true;
    }
    if (ball.positionY < 0) {
        ball.velocityY = -ball.velocityY;
        ball.positionY = 0;
        hitEdge = true;
    }

    // Store the hit edge data with timestamp and tinySquares if it occurred
    if (hitEdge) {
        const tinySquares: TinySquare[] = [];
        for (let i = 0; i < 5000; i++) {
            // Generates a random direction in radians
            const theta = Math.random() * 2 * Math.PI;

            // Calculate the coordinates (x, y) on the unit circle
            const speed = Math.random();
            const velocityX = Math.cos(theta) * speed;
            const velocityY = Math.sin(theta) * speed;

            tinySquares.push({
                x: ball.positionX,
                y: ball.positionY,
                velocityX: velocityX,
                velocityY: velocityY,
                lifetime: 500
            });
        }

        ball.hitEdges.unshift({ x: ball.positionX, y: ball.positionY, time: currentTime, tinySquares });

        const cutoffTime = currentTime - 5000;
        ball.hitEdges = ball.hitEdges.filter(edge => edge.time > cutoffTime);
    }

    ball.positionX += ball.velocityX;
    ball.positionY += ball.velocityY;
}
function drawball(ball: Ball) {
    // Draw the trail
    for (let i = 0; i < ball.previousPositions.length; i++) {
        const alpha = 0.8 - i / ball.previousPositions.length; // Fade effect
        c.fillStyle = `rgba(0, 255, 210, ${alpha})`; // Red with decreasing opacity
        const pos = ball.previousPositions[i];
        const width = alpha * ball.ballWidth / 2;
        const height = alpha * ball.ballHeight / 2;
        c.fillRect(pos.x + (ball.ballWidth - width) / 2, pos.y + (ball.ballHeight - height) / 2, width, height);
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
    c.fillRect(ball.positionX, ball.positionY, ball.ballWidth, ball.ballHeight);
}
function drawPaddle(paddle: Paddle) {
    c.fillStyle = paddle.fillStyle;
    c.fillRect(paddle.positionX, paddle.positionY, paddle.paddleWidth, paddle.paddleHeight);
}

function detectPaddleColission(paddle: Paddle, ball: Ball) {
    return !(
        paddle.positionX + paddle.paddleWidth < ball.positionX ||
        paddle.positionX > ball.positionX + ball.ballWidth ||
        paddle.positionY + paddle.paddleHeight < ball.positionY ||
        paddle.positionY > ball.positionY + ball.ballHeight
    );
}

function handleCollision(paddle: Paddle, ball: Ball) {
    if (detectPaddleColission(paddle, ball)) {
        // Determine collision side
        const ballCenterX = ball.positionX + ball.ballWidth / 2;
        const ballCenterY = ball.positionY + ball.ballHeight / 2;
        const paddleCenterX = paddle.positionX + paddle.paddleWidth / 2;
        const paddleCenterY = paddle.positionY + paddle.paddleHeight / 2;

        const dx = ballCenterX - paddleCenterX;
        const dy = ballCenterY - paddleCenterY;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Collision on the sides of the paddle
            if (dx > 0) {
                ball.positionX = paddle.positionX + paddle.paddleWidth;
            } else {
                ball.positionX = paddle.positionX - ball.ballWidth;
            }
            ball.velocityX = -ball.velocityX; // Reverse X velocity
        } else {
            // Collision on the top or bottom of the paddle
            if (dy > 0) {
                ball.positionY = paddle.positionY + paddle.paddleHeight;
            } else {
                ball.positionY = paddle.positionY - ball.ballHeight;
            }
            ball.velocityY = -ball.velocityY; // Reverse Y velocity
        }
    }
}

function updatePaddles() {
    if (keyState["w"]) {
        paddleArray[0].positionY -= paddleArray[0].velocityY;
    }
    if (keyState["s"]) {
        paddleArray[0].positionY += paddleArray[0].velocityY;
    }
    if (keyState["a"]) {
        paddleArray[0].positionX -= paddleArray[0].velocityX;
    }
    if (keyState["d"]) {
        paddleArray[0].positionX += paddleArray[0].velocityX;
    }
    // Example for second paddle (assuming keys 'i', 'k', 'j', 'l' are used):
    if (keyState["5"]) {
        paddleArray[1].positionY -= paddleArray[1].velocityY;
    }
    if (keyState["2"]) {
        paddleArray[1].positionY += paddleArray[1].velocityY;
    }
    if (keyState["1"]) {
        paddleArray[1].positionX -= paddleArray[1].velocityX;
    }
    if (keyState["3"]) {
        paddleArray[1].positionX += paddleArray[1].velocityX;
    }
    for (let paddle of paddleArray) {
        if (paddle.positionY > canvas.clientHeight - paddle.paddleHeight) {
            paddle.positionY = canvas.clientHeight - paddle.paddleHeight;
        }
        if (paddle.positionY < 0) {
            paddle.positionY = 0;
        }
    }

}

function frame() {
    const currentTime = Date.now(); // Get the current timestamp

    // Clear the screen
    c.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // Update paddles based on key states
    updatePaddles();

                                                 // Update and draw balls
    for (let ball of balls) {
        updateball(ball, currentTime);
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

    // Request a new frame
    requestAnimationFrame(frame);
}
frame();
