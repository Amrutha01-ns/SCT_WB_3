let mode = '';
let scores = [0, 0];
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let currentPlayer = "X";

function selectMode(m) {
    mode = m;
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('name-screen').classList.remove('hidden');
    if(mode === 'pvp') document.getElementById('p2-input').classList.remove('hidden');
}

function startGame() {
    const p1 = document.getElementById('p1-input').value || "Player 1";
    const p2 = mode === 'pvc' ? "Computer" : (document.getElementById('p2-input').value || "Player 2");
    
    document.getElementById('name-display-1').innerText = p1;
    document.getElementById('name-display-2').innerText = p2;
    document.getElementById('name-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
}

function handleCellClick(e) {
    const i = e.target.getAttribute('data-index');
    if (gameState[i] !== "" || !gameActive) return;

    makeMove(i, currentPlayer);
    
    if (gameActive && mode === 'pvc') {
        gameActive = false;
        setTimeout(computerMove, 600);
    } else if (gameActive) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
}

function makeMove(index, symbol) {
    gameState[index] = symbol;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.innerText = symbol;
    cell.style.color = symbol === "X" ? "#1a2a6c" : "#b21f1f";
    checkWin(symbol);
}

function computerMove() {
    let empty = gameState.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    if (empty.length > 0) {
        let move = empty[Math.floor(Math.random() * empty.length)];
        makeMove(move, "O");
    }
    gameActive = true;
}

function checkWin(symbol) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let won = wins.some(c => c.every(i => gameState[i] === symbol));
    
    if (won) {
        let idx = symbol === "X" ? 0 : 1;
        scores[idx]++;
        document.getElementById(`score-${idx+1}`).innerText = scores[idx];
        gameActive = false;
        
        if (scores[idx] === 2) {
            showWinner(idx === 0 ? document.getElementById('name-display-1').innerText : document.getElementById('name-display-2').innerText);
        } else {
            setTimeout(() => resetMatch(false), 1000);
        }
    } else if (!gameState.includes("")) {
        setTimeout(() => resetMatch(false), 1000);
    }
}

function showWinner(name) {
    document.getElementById('winner-text').innerText = name + " Has Won!";
    document.getElementById('winner-screen').classList.remove('hidden');
}

function resetMatch(full) {
    gameState = ["", "", "", "", "", "", "", "", ""];
    document.querySelectorAll('.cell').forEach(c => c.innerText = "");
    gameActive = true;
    currentPlayer = "X";
    if (full) {
        scores = [0,0];
        document.getElementById('score-1').innerText = "0";
        document.getElementById('score-2').innerText = "0";
        document.getElementById('winner-screen').classList.add('hidden');
    }
}

function backToMenu() { location.reload(); }

document.querySelectorAll('.cell').forEach(c => c.addEventListener('click', handleCellClick));