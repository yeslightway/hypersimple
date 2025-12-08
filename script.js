const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Mouse position
let mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Touch support for mobile
document.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});

// Geometric nodes
class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 2 + 1;
        this.life = 1;
        this.fadeRate = Math.random() * 0.01 + 0.005;
    }

    update() {
        // Move away from mouse slightly
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
            const angle = Math.atan2(dy, dx);
            const force = (150 - distance) / 150;
            this.x += Math.cos(angle) * force * 2;
            this.y += Math.sin(angle) * force * 2;
        }

        // Return to base position
        this.x += (this.baseX - this.x) * 0.05;
        this.y += (this.baseY - this.y) * 0.05;

        // Fade out
        this.life -= this.fadeRate;
    }

    draw() {
        ctx.fillStyle = `rgba(50, 50, 50, ${this.life * 0.6})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const nodes = [];

// Create nodes near mouse
let lastNodeTime = 0;
function createNodesNearMouse() {
    const now = Date.now();
    if (now - lastNodeTime > 50) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const x = mouse.x + Math.cos(angle) * distance;
        const y = mouse.y + Math.sin(angle) * distance;
        nodes.push(new Node(x, y));
        lastNodeTime = now;
    }
}

// Draw connections between nearby nodes
function drawConnections() {
    ctx.strokeStyle = 'rgba(50, 50, 50, 0.2)';
    ctx.lineWidth = 0.5;

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const alpha = (1 - distance / 100) * nodes[i].life * nodes[j].life;
                ctx.strokeStyle = `rgba(50, 50, 50, ${alpha * 0.3})`;
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    // Clear canvas with trail effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create nodes near mouse
    createNodesNearMouse();

    // Update and draw nodes
    for (let i = nodes.length - 1; i >= 0; i--) {
        nodes[i].update();
        if (nodes[i].life <= 0) {
            nodes.splice(i, 1);
        } else {
            nodes[i].draw();
        }
    }

    // Draw connections
    drawConnections();

    requestAnimationFrame(animate);
}

// Start animation
animate();
