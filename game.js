// Game Configuration and State
let selectedSize = 3;
let selectedMode = "pvp";

let boardSize = 3;
let winLength = 3;
let gameMode = "pvp"; // "pvp" or "ai"

let board = [];
let currentPlayer = "X";
let gameOver = false;
let isAiThinking = false;
let scores = { X: 0, O: 0, draw: 0 };

// DOM Elements
const homeView = document.getElementById("homeView");
const gameView = document.getElementById("gameView");
const startGameBtn = document.getElementById("startGameBtn");
const backToHomeBtn = document.getElementById("backToHomeBtn");

const activeMatchBadge = document.getElementById("activeMatchBadge");
const gameTitle = document.getElementById("gameTitle");
const gameRuleDescription = document.getElementById("gameRuleDescription");

const labelPlayerX = document.getElementById("labelPlayerX");
const labelPlayerO = document.getElementById("labelPlayerO");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreDraw = document.getElementById("scoreDraw");

const currentPlayerDisplay = document.getElementById("currentPlayer");
const gameStatus = document.getElementById("gameStatus");
const gameBoard = document.getElementById("gameBoard");

const restartBtn = document.getElementById("restartBtn");
const resetBtn = document.getElementById("resetBtn");

// 1. Home Screen Option Selection
function setupOptionButtons() {
    const optionButtons = document.querySelectorAll(".option-btn");
    optionButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const type = btn.dataset.type;
            const value = btn.dataset.value;

            // Remove active class from other buttons in the same group
            document.querySelectorAll(`.option-btn[data-type="${type}"]`).forEach(b => {
                b.classList.remove("active");
            });
            btn.classList.add("active");

            if (type === "size") {
                selectedSize = parseInt(value, 10);
            } else if (type === "mode") {
                selectedMode = value;
            }
        });
    });
}

// 2. Start Match
function startMatch() {
    boardSize = selectedSize;
    winLength = (boardSize === 3) ? 3 : 4;
    gameMode = selectedMode;

    // Update screen headings & labels
    const modeName = (gameMode === "ai") ? "VS COMPUTER" : "PLAYER VS PLAYER";
    gameTitle.textContent = `${boardSize}×${boardSize} TIC TAC TOE`;
    gameRuleDescription.textContent = `Connect ${winLength} symbols to win`;
    activeMatchBadge.textContent = `${boardSize}×${boardSize} • ${modeName}`;

    labelPlayerX.textContent = (gameMode === "ai") ? "You (X)" : "Player X";
    labelPlayerO.textContent = (gameMode === "ai") ? "Computer (O)" : "Player O";

    // Switch views
    homeView.style.display = "none";
    gameView.style.display = "block";

    resetScores();
}

// 3. Return to Menu
function returnToMenu() {
    gameView.style.display = "none";
    homeView.style.display = "block";
    isAiThinking = false;
}

// 4. Board Creation
function createEmptyBoard() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(""));
}

function createBoard() {
    gameBoard.innerHTML = "";
    gameBoard.className = `board grid-${boardSize}`;

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement("button");
            cell.className = "cell";
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", handleCellClick);
            gameBoard.appendChild(cell);
        }
    }
}

// 5. Handle Player Move
function handleCellClick(e) {
    if (gameOver || isAiThinking) return;

    const cell = e.currentTarget;
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    // If cell already occupied, ignore
    if (board[row][col] !== "") return;

    makeMove(row, col, currentPlayer, cell);

    // Check Win
    const winningCells = findWinningCells(row, col, currentPlayer);
    if (winningCells.length > 0) {
        handleWin(winningCells);
        return;
    }

    // Check Draw
    if (isBoardFull()) {
        handleDraw();
        return;
    }

    // Switch player
    switchPlayer();

    // Trigger AI move if in AI mode
    if (gameMode === "ai" && currentPlayer === "O" && !gameOver) {
        triggerAiMove();
    }
}

function makeMove(row, col, player, cell) {
    board[row][col] = player;
    cell.textContent = player;
}

// 6. Win Detection
function findWinningCells(row, col, player) {
    const directions = [
        [0, 1],   // Horizontal
        [1, 0],   // Vertical
        [1, 1],   // Diagonal \
        [1, -1]   // Anti-diagonal /
    ];

    for (const [dr, dc] of directions) {
        const line = [[row, col]];

        // Forward direction
        let r = row + dr, c = col + dc;
        while (isInside(r, c) && board[r][c] === player) {
            line.push([r, c]);
            r += dr;
            c += dc;
        }

        // Backward direction
        r = row - dr; c = col - dc;
        while (isInside(r, c) && board[r][c] === player) {
            line.unshift([r, c]);
            r -= dr;
            c -= dc;
        }

        if (line.length >= winLength) {
            return line;
        }
    }

    return [];
}

function isInside(r, c) {
    return r >= 0 && r < boardSize && c >= 0 && c < boardSize;
}

function isBoardFull() {
    return board.every(row => row.every(cell => cell !== ""));
}

// 7. Win, Draw, Switch Turn
function handleWin(winningCells) {
    gameOver = true;
    scores[currentPlayer]++;

    const cells = document.querySelectorAll(".cell");
    winningCells.forEach(([r, c]) => {
        cells[r * boardSize + c].classList.add("winner");
    });

    const winnerName = (gameMode === "ai" && currentPlayer === "X") ? "YOU WIN!" :
                       (gameMode === "ai" && currentPlayer === "O") ? "COMPUTER WINS!" :
                       `PLAYER ${currentPlayer} WINS!`;

    gameStatus.textContent = winnerName;
    updateScoreboard();
}

function handleDraw() {
    gameOver = true;
    scores.draw++;
    gameStatus.textContent = "GAME DRAW!";
    updateScoreboard();
}

function switchPlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    currentPlayerDisplay.textContent = currentPlayer;

    if (gameMode === "ai") {
        gameStatus.textContent = (currentPlayer === "X") ? "Your Turn (X)" : "Computer is thinking...";
    } else {
        gameStatus.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function updateScoreboard() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    scoreDraw.textContent = scores.draw;
}

function restartGame() {
    createEmptyBoard();
    currentPlayer = "X";
    gameOver = false;
    isAiThinking = false;

    currentPlayerDisplay.textContent = "X";
    gameStatus.textContent = (gameMode === "ai") ? "Your Turn (X)" : "Player X's Turn";

    createBoard();
}

function resetScores() {
    scores = { X: 0, O: 0, draw: 0 };
    updateScoreboard();
    restartGame();
}

// 8. AI Move (Computer)
function triggerAiMove() {
    isAiThinking = true;

    setTimeout(() => {
        if (gameOver) return;

        const bestMove = getBestAiMove();
        if (bestMove) {
            const [row, col] = bestMove;
            const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                makeMove(row, col, "O", cell);

                const win = findWinningCells(row, col, "O");
                if (win.length > 0) {
                    handleWin(win);
                    return;
                }

                if (isBoardFull()) {
                    handleDraw();
                    return;
                }

                switchPlayer();
            }
        }
        isAiThinking = false;
    }, 350);
}

function getBestAiMove() {
    const emptyCells = [];
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] === "") emptyCells.push([r, c]);
        }
    }
    if (emptyCells.length === 0) return null;

    // 1. Can AI ("O") win immediately?
    for (const [r, c] of emptyCells) {
        board[r][c] = "O";
        const win = findWinningCells(r, c, "O");
        board[r][c] = "";
        if (win.length > 0) return [r, c];
    }

    // 2. Can Player ("X") win immediately? Block them!
    for (const [r, c] of emptyCells) {
        board[r][c] = "X";
        const win = findWinningCells(r, c, "X");
        board[r][c] = "";
        if (win.length > 0) return [r, c];
    }

    // 3. Prefer center
    const center = Math.floor(boardSize / 2);
    if (board[center][center] === "") return [center, center];

    // 4. Random available cell
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// 9. Initial Event Listeners
setupOptionButtons();
startGameBtn.addEventListener("click", startMatch);
backToHomeBtn.addEventListener("click", returnToMenu);
restartBtn.addEventListener("click", restartGame);
resetBtn.addEventListener("click", resetScores);
