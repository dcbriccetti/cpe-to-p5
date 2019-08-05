const secs = () => millis() / 1000;

pushed = (block) => {
    push();
    block();
    pop();
};

class Ball {
    constructor(vel) {
        this.pos   = createVector(0, 0, 0);
        this.vel   = vel;
        this.accel = createVector(0, -9.81, 0);
        this.lastUpdate = secs();
    }

    update() {
        const now = secs();
        const dt = now - this.lastUpdate;
        this.lastUpdate = now;
        this.pos.add(p5.Vector.mult(this.vel, dt));
        this.vel.add(p5.Vector.mult(this.accel, dt));
    }

    draw() {
        pushed(() => {
            translate(this.pos.x, this.pos.y, this.pos.z);
            noStroke();
            ambientMaterial(255, 0, 0);
            directionalLight(255, 255, 255, 1, 1, -1);
            sphere(1);
        });
    }
}

let balls = [];
let nextLaunchTime;

function setup() {
    createCanvas(displayWidth, displayHeight, WEBGL);
    nextLaunchTime = secs();
}

function draw() {
    background('lightgray');
    translate(0, height / 2, 0);
    scale(30, -30, 30);

    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });

    if (secs() > nextLaunchTime) {
        fetch('/accel').then(response => response.json()).then(accel => {
            balls.push(new Ball(createVector(...accel)));
            nextLaunchTime = secs() + 0.3;
        });
    }
}
