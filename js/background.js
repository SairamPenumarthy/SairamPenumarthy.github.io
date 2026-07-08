/*
  Animated particle background.
  Tune look/feel via CONFIG below — everything scales automatically
  with window size (see tuneConfig()).
*/
const CONFIG = {
    particleCount : 120,       // number of dots
    baseSpeed     : 0.5,       // movement speed
    connectRadius : 300,       // px — max distance to draw a line between particles
    mouseRadius   : 360,       // px — max distance to connect mouse to a particle
    mouseRepel    : 160,       // px — radius of mouse repulsion
    mouseMult     : 3,         // max speed multiplier of particles from mouse
    bgColor       : '#050810',
    dotColor      : [100, 150, 255],   // R, G, B
    lineColor     : [70,  110, 220],   // R, G, B
    maxRipples    : 100,        // max ripple count; get a reasonable # from tests
    rippleSegments: 120,        // ripple wave segments
    rippleSpeed   : 3,          // ripple expansion speed
    rippleMaxRadius: 400,       // ripple cut-off radius
    rippleThickness: 5,         // thickness of ripple wave
    rippleStrength: 10,         // how hard particles get pushed
    rippleMult    : 100,        // max speed multiplier of particles from ripple
    rippleMaxWaveHeight: 18,
    friction      : 0.985,
};

const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

let W, H, DPR = 1;
let particles = [];
let ripples = [];
let mouseX = -9999, mouseY = -9999;

function spawnRipple(x, y) {
    ripples.push({ x, y, radius: 0, strength: CONFIG.rippleStrength });
    if (ripples.length > CONFIG.maxRipples) ripples.shift();
}

/*
  Ripples/clicks are handled on `window` rather than the canvas: the canvas
  sits behind the page content (z-index: -1), so nav/sections/cards are what
  actually receive the click. Listening on window still gets clientX/clientY
  correctly no matter what element was clicked, so the effect works over the
  whole page, not just the slivers of canvas not covered by content.
*/
window.addEventListener('click', e => spawnRipple(e.clientX, e.clientY));

window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

/* Touch support (mobile has no mousemove/click-on-canvas equivalent) */
window.addEventListener('touchstart', e => {
    const t = e.touches[0];
    if (!t) return;
    mouseX = t.clientX;
    mouseY = t.clientY;
    spawnRipple(t.clientX, t.clientY);
}, { passive: true });

window.addEventListener('touchmove', e => {
    const t = e.touches[0];
    if (!t) return;
    mouseX = t.clientX;
    mouseY = t.clientY;
}, { passive: true });

window.addEventListener('touchend', () => {
    mouseX = -9999;
    mouseY = -9999;
}, { passive: true });

/*
  Resize the canvas to the viewport (crisp on high-DPI/mobile screens via
  devicePixelRatio) and reposition existing particles proportionally so a
  resize/orientation-change doesn't teleport them or wipe the scene.
*/
function applyCanvasSize() {
    DPR = window.devicePixelRatio || 1;
    const newW = window.innerWidth;
    const newH = window.innerHeight;

    if (particles.length && W && H) {
        const sx = newW / W;
        const sy = newH / H;
        for (const p of particles) {
            p.x *= sx;
            p.y *= sy;
        }
    }

    W = newW;
    H = newH;
    canvas.width  = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

/* Recompute CONFIG scaling based on the current viewport size */
function tuneConfig() {
    // Scales parameters of background based on window size
    const ref = Math.min(W, H);

    // Reference viewport min-dimension (px) the opt_* values below were
    // tuned for. Must be the same unit as `ref` (a pixel length, not an
    // area) or opt_ratio collapses and every effect shrinks toward zero.
    const optimal_ref = 1080;
    const opt_particleCount = 120;
    const opt_connectRadius = 300;
    const opt_mouseRadius = 360;
    const opt_mouseRepel = 160;
    const opt_baseSpeed = 0.5;
    const opt_mouseMult = 3;
    const opt_rippleSpeed = 3;
    const opt_rippleMaxRadius = 400;
    const opt_rippleStrength = 10;
    const opt_rippleMult = 100;
    const opt_rippleThickness = 5;
    const opt_rippleMaxWaveHeight = 18;

    const opt_ratio = ref / optimal_ref;
    CONFIG.particleCount = Math.max(20, Math.ceil(opt_particleCount * opt_ratio));
    CONFIG.connectRadius = opt_connectRadius * opt_ratio;
    CONFIG.mouseRadius = opt_mouseRadius * opt_ratio;
    CONFIG.mouseRepel = opt_mouseRepel * opt_ratio;
    CONFIG.baseSpeed = opt_baseSpeed * opt_ratio;
    CONFIG.mouseMult = opt_mouseMult * opt_ratio;
    CONFIG.rippleSpeed = opt_rippleSpeed * opt_ratio;
    CONFIG.rippleMaxRadius = opt_rippleMaxRadius * opt_ratio;
    CONFIG.rippleStrength = opt_rippleStrength * opt_ratio;
    CONFIG.rippleMult = opt_rippleMult * opt_ratio;
    CONFIG.rippleThickness = opt_rippleThickness * opt_ratio;
    CONFIG.rippleMaxWaveHeight = opt_rippleMaxWaveHeight * opt_ratio;
}

function makeParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = CONFIG.baseSpeed * (0.5 + Math.random());
    return {
        x  : Math.random() * W,
        y  : Math.random() * H,
        vx : Math.cos(angle) * speed,
        vy : Math.sin(angle) * speed,
        r  : 1.5 + Math.random() * 1.5,   // dot radius
    };
}

/* Add/remove particles to match CONFIG.particleCount without resetting existing ones */
function syncParticleCount() {
    while (particles.length < CONFIG.particleCount) particles.push(makeParticle());
    if (particles.length > CONFIG.particleCount) particles.length = CONFIG.particleCount;
}

function draw() {
    /* Clear */
    ctx.fillStyle = CONFIG.bgColor;
    ctx.fillRect(0, 0, W, H);

    const [dr, dg, db] = CONFIG.dotColor;
    const [lr, lg, lb] = CONFIG.lineColor;
    const CR2 = CONFIG.connectRadius * CONFIG.connectRadius;

    /* ── Particle-particle connections ── */
    for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
            const b  = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;

            if (d2 < CR2) {
                /* Inverse-square falloff: alpha = (1 - d/R)^2 */
                const t     = 1 - Math.sqrt(d2) / CONFIG.connectRadius;
                const alpha = t * t * 0.65;

                ctx.beginPath();
                ctx.strokeStyle = `rgba(${lr},${lg},${lb},${alpha})`;
                ctx.lineWidth   = t * 1.2;
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    }

    /* ── Mouse connections ── */
    for (const p of particles) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const d  = Math.sqrt(dx * dx + dy * dy);

        if (d < CONFIG.mouseRadius) {
            const t = 1 - d / CONFIG.mouseRadius;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${dr},${dg},${db},${t * 0.4})`;
            ctx.lineWidth   = t * 1.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
        }
    }

    /* ── Move & draw dots ── */
    for (const p of particles) {
        /* Move */
        p.x += p.vx;
        p.y += p.vy;

        /* Friction */
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > CONFIG.baseSpeed) {
            const decay = CONFIG.friction;  // tweak: closer to 1 = slower decay
            p.vx *= decay;
            p.vy *= decay;
        }

        /* Bounce off edges */
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        p.x = Math.max(0, Math.min(W, p.x));
        p.y = Math.max(0, Math.min(H, p.y));

        /* Mouse repulsion */
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const md  = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < CONFIG.mouseRepel && md > 0) {
            // Speed *before* this frame's repulsion nudge. Only clamp to the
            // mouse's own speed cap if the particle wasn't already moving
            // faster than that (e.g. from a ripple) — otherwise a dot that
            // just got kicked by a ripple and happens to be near the cursor
            // gets its velocity slashed back down on the very next frame.
            const spdBefore = Math.sqrt(p.vx * p.vx + p.vy * p.vy);

            const force = (CONFIG.mouseRepel - md) / CONFIG.mouseRepel * 0.04;
            p.vx += (mdx / md) * force;
            p.vy += (mdy / md) * force;

            const max = CONFIG.baseSpeed * CONFIG.mouseMult;
            if (spdBefore <= max) {
                const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (spd > max) { p.vx *= max / spd; p.vy *= max / spd; }
            }
        }

        /* Draw dot */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dr},${dg},${db},0.85)`;
        ctx.fill();
    }

    /* ── Ripple shockwaves ── */
    for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += CONFIG.rippleSpeed;  // expansion speed

        const thickness = CONFIG.rippleThickness;  // how wide the shockwave ring is

        /* Draw the expanding ring */
        const alpha = Math.max(0, 1 - rip.radius / CONFIG.rippleMaxRadius);
        const segments = CONFIG.rippleSegments;                // how smooth the ring is
        const waveFreq = 8;                                    // number of wave peaks around the ring
        const progress = rip.radius / CONFIG.rippleMaxRadius;  // 0 -> 1 over the ring's lifetime
        const rippleStart = 0;                                 // don't start waving until this % traveled
        const rampUp  = Math.max(0, (progress - rippleStart) / (1 - rippleStart));
        const waveAmp = rampUp * rampUp * CONFIG.rippleMaxWaveHeight * alpha;
        const timeOff  = rip.radius * 0.04; // makes the wave animate outward

        ctx.beginPath();
        for (let s = 0; s <= segments; s++) {
            const angle     = (s / segments) * Math.PI * 2;
            const wobble    = Math.sin(angle * waveFreq + timeOff) * waveAmp;
            const r         = rip.radius + wobble;
            const px        = rip.x + Math.cos(angle) * r;
            const py        = rip.y + Math.sin(angle) * r;
            s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(${dr},${dg},${db},${alpha * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        /* Push particles that fall within the ring */
        for (const p of particles) {
            const dx = p.x - rip.x;
            const dy = p.y - rip.y;
            const d  = Math.sqrt(dx * dx + dy * dy);

            if (d > 0 && Math.abs(d - rip.radius) < thickness) {
                /* Force falls off with distance from shockwave front */
                const proximity = 1 - Math.abs(d - rip.radius) / thickness;
                const force = proximity * rip.strength / (d * 0.1 + 1);

                p.vx += (dx / d) * force;
                p.vy += (dy / d) * force;

                /* Speed cap */
                const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                const max = CONFIG.baseSpeed * CONFIG.rippleMult;
                if (spd > max) { p.vx *= max / spd; p.vy *= max / spd; }
            }
        }

        /* Remove ripple once it's faded out */
        if (rip.radius > CONFIG.rippleMaxRadius) ripples.splice(i, 1);
    }

    requestAnimationFrame(draw);
}

/* ---------------------------------- Init --------------------------------- */

applyCanvasSize();
tuneConfig();
syncParticleCount();
draw();

/*
  Canvas size updates immediately so nothing looks stretched/cut off mid-drag
  or mid-orientation-change. Re-tuning CONFIG and the particle count is
  debounced so a burst of resize events (dragging a window edge, a mobile
  browser's address bar collapsing on scroll) doesn't thrash the scene.
*/
let resizeTimer;
function handleViewportChange() {
    applyCanvasSize();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        tuneConfig();
        syncParticleCount();
    }, 150);
}

window.addEventListener('resize', handleViewportChange);
window.addEventListener('orientationchange', handleViewportChange);
