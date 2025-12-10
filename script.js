const logoContainer = document.querySelector('.logo-container');
const logo = document.querySelector('.logo');
const nodes = document.querySelectorAll('.node');

// Store base opacity for each node
const nodeBaseOpacities = Array.from(nodes).map(node =>
    parseFloat(node.getAttribute('opacity') || 1)
);

// Generate unique random parameters for each node
const nodeParams = Array.from(nodes).map((node, index) => ({
    scalePhase: index * 2.618,
    opacityPhase: index * 1.414,
}));

logoContainer.addEventListener('mousemove', (e) => {
    const rect = logoContainer.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = rect.width / 2;
    const intensity = Math.min(distance / maxDistance, 1);

    // Create probabilistic cloud effect on hover
    nodes.forEach((node, index) => {
        const time = Date.now() / 1000;
        const params = nodeParams[index];

        const scale = 1 + Math.sin(time * 2 + params.scalePhase) * 0.2 * intensity;
        node.style.transform = `scale(${scale})`;

        const baseOpacity = nodeBaseOpacities[index];
        const opacity = baseOpacity + Math.sin(time * 1.5 + params.opacityPhase) * 0.3 * intensity;
        node.setAttribute('opacity', Math.max(0.2, Math.min(1, opacity)));
    });
});

logoContainer.addEventListener('mouseleave', () => {
    nodes.forEach((node, index) => {
        node.style.transform = 'scale(1)';
        node.setAttribute('opacity', nodeBaseOpacities[index]);
    });
});

// Simple organic idle animation
let idleTime = 0;
function idleAnimate() {
    if (!logoContainer.matches(':hover')) {
        idleTime += 0.012;

        nodes.forEach((node, index) => {
            const params = nodeParams[index];

            // Simple organic pulse
            const scale = 0.9 + Math.abs(Math.sin(idleTime * 0.7 + params.scalePhase)) * 0.15;
            node.style.transform = `scale(${scale})`;

            // Fade in/out organically
            const baseOpacity = nodeBaseOpacities[index];
            const opacity = baseOpacity * (0.6 + Math.abs(Math.sin(idleTime * 0.5 + params.opacityPhase)) * 0.5);
            node.setAttribute('opacity', Math.max(0.2, Math.min(1, opacity)));
        });
    }
    requestAnimationFrame(idleAnimate);
}

idleAnimate();
