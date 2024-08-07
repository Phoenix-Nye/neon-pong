
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
        velocityX: 6,
        velocityY: 2,
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
        velocityY: 5,
        width: 20,
        height: 30,
        fillStyle: "crimson"
    },
    {
        x: 330,
        y: canvas.height / 2 - 50,
        velocityX: 0,
        velocityY: 5,
        width: 20,
        height: 30,
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
<<<<<<< HEAD
    ball.previousPositions.unshift({ x: ball.x, y: ball.y });

=======
    let explosionX = 0;
    let explosionY = 0;
    let hitEdge = false;
    ball.previousPositions.unshift({ x: ball.positionX, y: ball.positionY });
    
>>>>>>> 6c7f48e900062c849d4d24e0ce3a970141874c3e
    if (ball.previousPositions.length > 50) {
        ball.previousPositions.pop();
    }

<<<<<<< HEAD
    let hitEdge = false;

    if (ball.x > canvas.clientWidth - ball.width) {
=======
    // Right side
    if (ball.positionX > canvas.clientWidth - ball.ballWidth) {
>>>>>>> 6c7f48e900062c849d4d24e0ce3a970141874c3e
        ball.velocityX = -ball.velocityX;
        ball.x = canvas.clientWidth - ball.width;
        hitEdge = true;
        explosionX = +20;
    }
<<<<<<< HEAD
    if (ball.x < 0) {
=======
    // Left side Finished
    if (ball.positionX < 0) {
>>>>>>> 6c7f48e900062c849d4d24e0ce3a970141874c3e
        ball.velocityX = -ball.velocityX;
        ball.x = 0;
        hitEdge = true;
        explosionX = 0;
    }
<<<<<<< HEAD
    if (ball.y > canvas.clientHeight - ball.height) {
=======
    // Floor
    if (ball.positionY > canvas.clientHeight - ball.ballHeight) {
>>>>>>> 6c7f48e900062c849d4d24e0ce3a970141874c3e
        ball.velocityY = -ball.velocityY;
        ball.y = canvas.clientHeight - ball.height;
        hitEdge = true;
        explosionY = 20;
    }
<<<<<<< HEAD
    if (ball.y < 0) {
=======
    // Ceiling finished
    if (ball.positionY < 0) {
>>>>>>> 6c7f48e900062c849d4d24e0ce3a970141874c3e
        ball.velocityY = -ball.velocityY;
        ball.y = 0;
        hitEdge = true;
        explosionY = 0;
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
<<<<<<< HEAD
                x: ball.x,
                y: ball.y,
=======
                x: ball.positionX + explosionX,
                y: ball.positionY + explosionY,
>>>>>>> 6c7f48e900062c849d4d24e0ce3a970141874c3e
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
