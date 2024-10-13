class Animal {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
    }

    move(canvas) {
        this.x += (Math.random() - 0.5) * this.speed;
        this.y += (Math.random() - 0.5) * this.speed;
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
    }
}

class Rabbit extends Animal {
    constructor(x, y) {
        super(x, y, 2);
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Wolf extends Animal {
    constructor(x, y) {
        super(x, y, 3);
    }

    draw(ctx) {
        ctx.fillStyle = 'gray';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 7, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Ecosystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.rabbits = [];
        this.wolves = [];
        this.running = false;

        for (let i = 0; i < 50; i++) {
            this.rabbits.push(new Rabbit(Math.random() * canvas.width, Math.random() * canvas.height));
        }
        for (let i = 0; i < 10; i++) {
            this.wolves.push(new Wolf(Math.random() * canvas.width, Math.random() * canvas.height));
        }
    }

    update() {
        // 移动动物
        this.rabbits.forEach(rabbit => rabbit.move(this.canvas));
        this.wolves.forEach(wolf => wolf.move(this.canvas));

        // 兔子繁殖
        if (Math.random() < 0.02 && this.rabbits.length < 100) {
            const parent = this.rabbits[Math.floor(Math.random() * this.rabbits.length)];
            this.rabbits.push(new Rabbit(parent.x, parent.y));
        }

        // 狼捕食和繁殖
        this.wolves.forEach(wolf => {
            for (let i = this.rabbits.length - 1; i >= 0; i--) {
                const rabbit = this.rabbits[i];
                const distance = Math.hypot(wolf.x - rabbit.x, wolf.y - rabbit.y);
                if (distance < 10) {
                    this.rabbits.splice(i, 1);
                    if (Math.random() < 0.1 && this.wolves.length < 50) {
                        this.wolves.push(new Wolf(wolf.x, wolf.y));
                    }
                    break;
                }
            }
        });

        // 动物死亡
        this.rabbits = this.rabbits.filter(() => Math.random() > 0.001);
        this.wolves = this.wolves.filter(() => Math.random() > 0.002);

        this.draw();
        this.updateStats();

        if (this.running) {
            requestAnimationFrame(() => this.update());
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.rabbits.forEach(rabbit => rabbit.draw(this.ctx));
        this.wolves.forEach(wolf => wolf.draw(this.ctx));
    }

    updateStats() {
        document.getElementById('rabbit-count').textContent = this.rabbits.length;
        document.getElementById('wolf-count').textContent = this.wolves.length;
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.update();
        }
    }

    pause() {
        this.running = false;
    }

    reset() {
        this.rabbits = [];
        this.wolves = [];
        for (let i = 0; i < 50; i++) {
            this.rabbits.push(new Rabbit(Math.random() * this.canvas.width, Math.random() * this.canvas.height));
        }
        for (let i = 0; i < 10; i++) {
            this.wolves.push(new Wolf(Math.random() * this.canvas.width, Math.random() * this.canvas.height));
        }
        this.draw();
        this.updateStats();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('ecosystem');
    const ecosystem = new Ecosystem(canvas);

    document.getElementById('start').addEventListener('click', () => ecosystem.start());
    document.getElementById('pause').addEventListener('click', () => ecosystem.pause());
    document.getElementById('reset').addEventListener('click', () => ecosystem.reset());

    ecosystem.draw();
    ecosystem.updateStats();
});
