
const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement; // eldtrich typescript as expression
const c = canvas.getContext("2d")!;

canvas.style.backgroundColor = "black"; // Change this to the desired color

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//  Types
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

type Vector2 = { x: number, y: number };

type Player = {
    type: "player",
    position: Vector2,
    controls: { up: string, down: string, left: string, right: string, shoot: string},
    speed: number,
}

type Bullet = {
    type: "bullet",
    position: Vector2,
    size: Vector2,
    color: string,
    bulletspeed: number
}

type Entity = Player | Bullet;

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//  Model or State
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

const displayList: Entity[] = [
    { type: "player", position: { x: 10, y: 10 }, controls: { up: "w", left:"a", down: "s", right: "d", shoot: " "}, speed: 1 }//,
    //{ type: "ball", position: { x: 120, y: 20 }, size: { x: 10, y: 10 }, color: "red"},
    //{ type: "ball", position: { x: 120, y: 60 }, size: { x: 10, y: 10 }, color: "blue"},
]


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

function updateState() {
    for (let entity of displayList) {
        if (entity.type == "player") {
            // check if players keys are down and move
            if (keyState[entity.controls.right]) {
                entity.position.x += entity.speed;
            }
            if (keyState[entity.controls.left]) {
                entity.position.x -= entity.speed;
            }
            if (keyState[entity.controls.down]) {
                entity.position.y += entity.speed;
            }
            if (keyState[entity.controls.up]) {
                entity.position.y -= entity.speed;
            }
            if (keyState[entity.controls.shoot]) {
                displayList.push ({
                    type: "bullet",
                    "color": "orange",
                    "position": {x:10, y:10},
                    "size": {x: 10, y:10},
                    "bulletspeed": 1
                })
            }
        }
        else if (entity.type == "bullet") {

        }
    }
}

function renderState() {
    // Clear the screen
    c.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for (let entity of displayList) {
        if (entity.type == "player") {
            c.fillStyle = "purple";
            c.fillRect(entity.position.x, entity.position.y, 30, 30);
        }
        else if (entity.type == "bullet") {            
            c.fillStyle = entity.color;
            c.fillRect(entity.position.x, entity.position.y, entity.size.x, entity.size.y);
        }
    }

 }

function handleFrame() {
    updateState();
    renderState();
    // Request a new frame
    requestAnimationFrame(handleFrame);
}
handleFrame();
