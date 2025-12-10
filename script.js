const logoContainer = document.querySelector('.logo-container');
const logo = document.querySelector('.logo');
const nodes = document.querySelectorAll('.node');
const nodeCenter = document.querySelector('.node-center');
const connections = document.querySelectorAll('.connection');

logoContainer.addEventListener('mousemove', (e) => {
    const rect = logoContainer.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const angle = Math.atan2(y, x) * (180 / Math.PI);
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = rect.width / 2;
    const intensity = Math.min(distance / maxDistance, 1);

    // Pulse nodes based on proximity
    nodes.forEach((node, index) => {
        const scale = 1 + intensity * 0.5 * Math.sin((Date.now() / 1000 + index) * 2);
        node.style.transform = `scale(${Math.max(0.8, scale)})`;
    });

    // Pulse center node
    const centerScale = 1 + intensity * 0.6;
    nodeCenter.style.transform = `scale(${centerScale})`;

    // Animate connections
    connections.forEach((connection, index) => {
        const opacity = 0.2 + intensity * 0.5 * Math.sin((Date.now() / 1000 + index * 0.5) * 3);
        connection.setAttribute('opacity', Math.max(0.1, opacity));
    });
});

logoContainer.addEventListener('mouseleave', () => {
    // Reset transformations
    nodes.forEach(node => {
        node.style.transform = 'scale(1)';
    });

    nodeCenter.style.transform = 'scale(1)';

    connections.forEach((connection, index) => {
        const baseOpacity = index < 8 ? (index < 4 ? 0.4 : 0.3) : 0.2;
        connection.setAttribute('opacity', baseOpacity);
    });
});

// Subtle idle animation
let idleTime = 0;
function idleAnimate() {
    if (!logoContainer.matches(':hover')) {
        idleTime += 0.016;

        // Pulse nodes subtly
        nodes.forEach((node, index) => {
            const scale = 1 + Math.sin(idleTime * 0.8 + index * 0.5) * 0.1;
            node.style.transform = `scale(${scale})`;
        });

        // Pulse center
        const centerScale = 1 + Math.sin(idleTime * 0.6) * 0.15;
        nodeCenter.style.transform = `scale(${centerScale})`;

        // Animate connection opacity
        connections.forEach((connection, index) => {
            const baseOpacity = index < 8 ? (index < 4 ? 0.4 : 0.3) : 0.2;
            const opacity = baseOpacity + Math.sin(idleTime + index * 0.3) * 0.1;
            connection.setAttribute('opacity', Math.max(0.1, opacity));
        });
    }
    requestAnimationFrame(idleAnimate);
}

idleAnimate();
