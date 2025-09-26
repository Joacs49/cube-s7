const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const sonidoFondo = new Audio('sounds/nivel1.mp3');

sonidoFondo.loop = true;

sonidoFondo.volume = 0.2; 

document.addEventListener('click', () => {
    if (sonidoFondo.paused) {
        sonidoFondo.play().catch(e => console.log("Error al reproducir audio:", e));
    }
}, { once: true });

let nivelActual = 1; 

const sueloY = 350;

const jugador = {
    x: 100,
    y: 300,
    width: 50,
    height: 50,
    color: '#007bff',
    vy: 0,
    gravedad: 0.5,
    fuerzaSalto: -10,
    enElSuelo: true,
    velocidadHorizontal: 5 
};

const plataforma = {
    x: 400,
    y: 260,
    width: 100,
    height: 20,
    color: '#ff9900'
};

const sonidoColision = new Audio('sounds/boing.mp3');

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && jugador.enElSuelo) {
        jugador.vy = jugador.fuerzaSalto;
        jugador.enElSuelo = false;
    }

    if (e.code === 'ArrowLeft') {
        jugador.x -= jugador.velocidadHorizontal;
    }
    if (e.code === 'ArrowRight') {
        jugador.x += jugador.velocidadHorizontal;
    }
});

function actualizar() {
    jugador.vy += jugador.gravedad;
    jugador.y += jugador.vy;

    if (jugador.y + jugador.height >= sueloY) {
        jugador.y = sueloY - jugador.height;
        jugador.vy = 0;
        jugador.enElSuelo = true;
        sonidoColision.currentTime = 0; 
        sonidoColision.play().catch(e => console.log("Error al reproducir sonido:", e));
    }

    if (nivelActual === 2) {
        if (
            jugador.y + jugador.height <= plataforma.y + plataforma.height &&
            jugador.y + jugador.height >= plataforma.y &&
            jugador.x + jugador.width > plataforma.x &&
            jugador.x < plataforma.x + plataforma.width &&
            jugador.vy > 0 
        ) {
            jugador.y = plataforma.y - jugador.height;
            jugador.vy = 0;
            jugador.enElSuelo = true;
            sonidoColision.currentTime = 0;
            sonidoColision.play().catch(e => console.log("Error al reproducir sonido:", e));
        }
    }

    if (jugador.x + jugador.width < 0 && nivelActual === 1) {
        nivelActual = 2;
        jugador.x = 50;
        jugador.y = 300;
        jugador.vy = 0;
        jugador.enElSuelo = true;
    }
}

function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#888';
    ctx.fillRect(0, sueloY, canvas.width, canvas.height - sueloY);

    ctx.fillStyle = jugador.color;
    ctx.fillRect(jugador.x, jugador.y, jugador.width, jugador.height);

    if (nivelActual === 2) {
        ctx.fillStyle = plataforma.color;
        ctx.fillRect(plataforma.x, plataforma.y, plataforma.width, plataforma.height);
    }

    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Nivel ${nivelActual}`, 20, 30); 
}

function loop() {
    actualizar();
    dibujar();
    requestAnimationFrame(loop);
}

loop();