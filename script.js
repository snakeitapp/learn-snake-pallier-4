const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");

const welcomeScreen = document.getElementById("welcomeScreen");
const languageScreen = document.getElementById("languageScreen");
const signupScreen = document.getElementById("signupScreen");
const loginScreen = document.getElementById("loginScreen");
const gameScreen = document.getElementById("gameScreen");

const getStartedButton = document.getElementById("getStartedButton");
const alreadyAccountText = document.getElementById("alreadyAccountText");
const continueAfterLanguage = document.getElementById("continueAfterLanguage");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

const startButton = document.getElementById("startButton");
const gameOverMessage = document.getElementById("gameOverMessage");
const gameOverText = document.getElementById("gameOverText");
const restartButton = document.getElementById("restartButton");

const languageCards = document.querySelectorAll(".language-card");

canvas.width = 320;
canvas.height = 640;

const gridSize = 20;
const tileCountX = canvas.width / gridSize;
const tileCountY = canvas.height / gridSize;

let snake = [];
let direction = { x: 1, y: 0 };
let food = null;

let gameLoop;
let gameRunning = false;
let selectedLanguage = "en";

/* =========================
   TRANSLATIONS
========================= */

const translations = {
    fr: {
        welcomeTitle: "Snake It!",
        getStarted: "Get Started",
        alreadyAccount: "I already have an account",

        languageTitle: "Choisis ta langue",
        languageSubtitle: "Cette langue changera l'interface et les règles de l'application.",
        continue: "Continuer",

        signupTitle: "Crée ton compte",
        signupSubtitle: "Sauvegarde ta progression et reprends plus tard sur un autre appareil.",
        labelName: "Nom",
        labelEmail: "Email",
        labelPassword: "Mot de passe",
        placeholderName: "Ton nom",
        placeholderEmail: "ton@email.com",
        placeholderPassword: "••••••••",
        signupInfo: "Version prototype : les données du compte sont sauvegardées localement pour le moment.",
        createAccount: "Créer mon compte",

        start: "START",
        gameOver: "Game Over",
        replay: "Rejouer"
    },

    en: {
        welcomeTitle: "Snake It!",
        getStarted: "Get Started",
        alreadyAccount: "I already have an account",

        languageTitle: "Choose your language",
        languageSubtitle: "This will change the app interface and lesson texts.",
        continue: "Continue",

        signupTitle: "Create your account",
        signupSubtitle: "Save your progress and continue later on another device.",
        labelName: "Name",
        labelEmail: "Email",
        labelPassword: "Password",
        placeholderName: "Your name",
        placeholderEmail: "your@email.com",
        placeholderPassword: "••••••••",
        signupInfo: "Prototype version: account data is only saved locally for now.",
        createAccount: "Create account",

        start: "START",
        gameOver: "Game Over",
        replay: "Replay"
    },

    de: {
        welcomeTitle: "Snake It!",
        getStarted: "Los geht's",
        alreadyAccount: "Ich habe bereits ein Konto",

        languageTitle: "Wähle deine Sprache",
        languageSubtitle: "Diese Sprache ändert die App-Oberfläche und die Regeln.",
        continue: "Weiter",

        signupTitle: "Erstelle dein Konto",
        signupSubtitle: "Speichere deinen Fortschritt und mache später auf einem anderen Gerät weiter.",
        labelName: "Name",
        labelEmail: "E-Mail",
        labelPassword: "Passwort",
        placeholderName: "Dein Name",
        placeholderEmail: "deine@email.com",
        placeholderPassword: "••••••••",
        signupInfo: "Prototyp-Version: Kontodaten werden aktuell nur lokal gespeichert.",
        createAccount: "Konto erstellen",

        start: "START",
        gameOver: "Game Over",
        replay: "Erneut spielen"
    }
};

/* =========================
   UI / LANGUAGE
========================= */

function applyLanguage(lang) {
    selectedLanguage = lang;
    const t = translations[lang];

    document.getElementById("welcomeTitle").innerHTML = t.welcomeTitle;
    document.getElementById("getStartedButton").textContent = t.getStarted;
    document.getElementById("alreadyAccountText").textContent = t.alreadyAccount;

    document.getElementById("languageTitle").textContent = t.languageTitle;
    document.getElementById("languageSubtitle").textContent = t.languageSubtitle;
    document.getElementById("continueAfterLanguage").textContent = t.continue;

    document.getElementById("signupTitle").textContent = t.signupTitle;
    document.getElementById("signupSubtitle").textContent = t.signupSubtitle;
    document.getElementById("labelName").textContent = t.labelName;
    document.getElementById("labelEmail").textContent = t.labelEmail;
    document.getElementById("labelPassword").textContent = t.labelPassword;
    document.getElementById("nameInput").placeholder = t.placeholderName;
    document.getElementById("emailInput").placeholder = t.placeholderEmail;
    document.getElementById("passwordInput").placeholder = t.placeholderPassword;
    document.getElementById("signupInfo").textContent = t.signupInfo;
    document.getElementById("createAccountButton").textContent = t.createAccount;

    startButton.textContent = t.start;
    gameOverText.textContent = t.gameOver;
    restartButton.textContent = t.replay;
}

function showScreen(screenToShow) {
    const screens = [welcomeScreen, languageScreen, signupScreen, loginScreen, gameScreen];
    screens.forEach(screen => screen.classList.add("hidden"));
    screenToShow.classList.remove("hidden");
}

/* =========================
   NAVIGATION
========================= */

getStartedButton.addEventListener("click", () => {
    showScreen(languageScreen);
});

alreadyAccountText.addEventListener("click", () => {
    showScreen(loginScreen);
});

languageCards.forEach(card => {
    card.addEventListener("click", () => {
        languageCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");

        selectedLanguage = card.dataset.lang;
        continueAfterLanguage.disabled = false;
    });
});

continueAfterLanguage.addEventListener("click", () => {
    applyLanguage(selectedLanguage);
    showScreen(signupScreen);
});

signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const accountData = {
        language: selectedLanguage,
        name: document.getElementById("nameInput").value.trim(),
        email: document.getElementById("emailInput").value.trim(),
        password: document.getElementById("passwordInput").value.trim()
    };

    localStorage.setItem("snakeAppAccount", JSON.stringify(accountData));

    showScreen(gameScreen);
    initGame();
});

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const storedAccount = JSON.parse(localStorage.getItem("snakeAppAccount"));

    if (!storedAccount) {
        alert("Aucun compte trouvé.");
        return;
    }

    if (storedAccount.email === email && storedAccount.password === password) {
        showScreen(gameScreen);
        initGame();
    } else {
        alert("Email ou mot de passe incorrect.");
    }
});

/* =========================
   SNAKE GAME
========================= */

function initGame() {
    snake = [];
    food = null;
    direction = { x: 1, y: 0 };

    gameRunning = false;
    clearInterval(gameLoop);

    startButton.style.display = "block";
    gameOverMessage.classList.add("hidden");

    draw();
}

function setupNewGame() {
    snake = [{ x: 8, y: 16 }];
    direction = { x: 1, y: 0 };
    food = { x: 12, y: 20 };
}

function startGame() {
    clearInterval(gameLoop);

    setupNewGame();

    gameOverMessage.classList.add("hidden");
    startButton.style.display = "none";

    draw();

    gameRunning = true;
    gameLoop = setInterval(update, 120);
}

function restartGame() {
    gameOverMessage.classList.add("hidden");
    startGame();
}

function update() {
    if (!gameRunning) return;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    if (head.x < 0) head.x = tileCountX - 1;
    if (head.x >= tileCountX) head.x = 0;
    if (head.y < 0) head.y = tileCountY - 1;
    if (head.y >= tileCountY) head.y = 0;

    for (let part of snake) {
        if (head.x === part.x && head.y === part.y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    if (food && head.x === food.x && head.y === food.y) {
        placeFood();
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (food) {
        ctx.fillStyle = "#DAA520";
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    if (snake.length > 0) {
        ctx.fillStyle = "#B0E0E6";
        for (let part of snake) {
            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
        }
    }
}

function placeFood() {
    let newFood;
    let onSnake;

    do {
        newFood = {
            x: Math.floor(Math.random() * tileCountX),
            y: Math.floor(Math.random() * tileCountY)
        };

        onSnake = snake.some(part => part.x === newFood.x && part.y === newFood.y);
    } while (onSnake);

    food = newFood;
}

function endGame() {
    clearInterval(gameLoop);
    gameRunning = false;
    gameOverMessage.classList.remove("hidden");
}

document.addEventListener("keydown", (e) => {
    if (!gameRunning) return;

    if (e.key === "ArrowUp" && direction.y !== 1) {
        direction = { x: 0, y: -1 };
    } else if (e.key === "ArrowDown" && direction.y !== -1) {
        direction = { x: 0, y: 1 };
    } else if (e.key === "ArrowLeft" && direction.x !== 1) {
        direction = { x: -1, y: 0 };
    } else if (e.key === "ArrowRight" && direction.x !== -1) {
        direction = { x: 1, y: 0 };
    }
});

startButton.addEventListener("click", startGame);

/* =========================
   ANIMATED DOT BACKGROUND
========================= */

let bgCols = 0;
let bgRows = 0;
let dotSpacing = 28;
let dotRadius = 1.2;
let trails = [];

function resizeBackground() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;

    bgCols = Math.ceil(bgCanvas.width / dotSpacing);
    bgRows = Math.ceil(bgCanvas.height / dotSpacing);

    createTrails();
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDirection() {
    const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
    ];

    return directions[randomInt(0, directions.length - 1)];
}

function turnLeft(direction) {
    return { x: direction.y, y: -direction.x };
}

function turnRight(direction) {
    return { x: -direction.y, y: direction.x };
}

function createTrail() {
    return {
        headX: randomInt(0, bgCols - 1),
        headY: randomInt(0, bgRows - 1),
        direction: randomDirection(),
        length: randomInt(2, 4),
        progress: 0,
        speed: Math.random() * 0.035 + 0.02,
        active: false,
        wait: Math.random() * 120 + 20,
        opacity: Math.random() * 0.55 + 0.2,
        color: Math.random() > 0.5 ? "140, 99, 246" : "255, 138, 0",
        turnChance: Math.random() * 0.12 + 0.06
    };
}

function createTrails() {
    trails = [];
    for (let i = 0; i < 7; i++) {
        trails.push(createTrail());
    }
}

function updateTrails() {
    for (const trail of trails) {
        if (!trail.active) {
            trail.wait -= 1;

            if (trail.wait <= 0) {
                trail.active = true;
                trail.progress = 0;
                trail.length = randomInt(2, 4);
                trail.direction = randomDirection();
                trail.headX = randomInt(0, bgCols - 1);
                trail.headY = randomInt(0, bgRows - 1);
                trail.opacity = Math.random() * 0.55 + 0.25;
                trail.color = Math.random() > 0.5 ? "140, 99, 246" : "255, 138, 0";
                trail.turnChance = Math.random() * 0.12 + 0.06;
            }

            continue;
        }

        trail.progress += trail.speed;

        if (trail.progress >= 1) {
            trail.progress = 0;

            if (Math.random() < trail.turnChance) {
                trail.direction = Math.random() < 0.5
                    ? turnLeft(trail.direction)
                    : turnRight(trail.direction);
            }

            trail.headX += trail.direction.x;
            trail.headY += trail.direction.y;

            const outOfBounds =
                trail.headX < 0 ||
                trail.headX >= bgCols ||
                trail.headY < 0 ||
                trail.headY >= bgRows;

            const randomStop = Math.random() < 0.08;

            if (outOfBounds || randomStop) {
                trail.active = false;
                trail.wait = Math.random() * 180 + 30;
            }
        }
    }
}

function drawBackground() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    for (let y = 0; y < bgRows; y++) {
        for (let x = 0; x < bgCols; x++) {
            const px = x * dotSpacing + dotSpacing / 2;
            const py = y * dotSpacing + dotSpacing / 2;

            bgCtx.beginPath();
            bgCtx.arc(px, py, dotRadius, 0, Math.PI * 2);
            bgCtx.fillStyle = "rgba(255,255,255,0.12)";
            bgCtx.fill();
        }
    }

    for (const trail of trails) {
        if (!trail.active) continue;

        for (let i = 0; i < trail.length; i++) {
            const tx = trail.headX - trail.direction.x * i;
            const ty = trail.headY - trail.direction.y * i;

            if (tx < 0 || tx >= bgCols || ty < 0 || ty >= bgRows) continue;

            const px = tx * dotSpacing + dotSpacing / 2;
            const py = ty * dotSpacing + dotSpacing / 2;

            const alpha = trail.opacity * (1 - i / (trail.length + 0.5));
            const size = dotRadius + (trail.length - i) * 0.45;

            bgCtx.beginPath();
            bgCtx.arc(px, py, size, 0, Math.PI * 2);
            bgCtx.fillStyle = `rgba(${trail.color}, ${alpha})`;
            bgCtx.fill();
        }
    }
}

function animateBackground() {
    updateTrails();
    drawBackground();
    requestAnimationFrame(animateBackground);
}

/* =========================
   INIT
========================= */

applyLanguage("en");
resizeBackground();
animateBackground();

window.addEventListener("resize", resizeBackground);
