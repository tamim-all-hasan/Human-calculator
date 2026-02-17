// Game Logic State
let state = {
    xp: parseInt(localStorage.getItem('xp_arena')) || 0,
    combo: 0,
    multiplier: 1,
    mode: '',
    playerHP: 100,
    aiHP: 100,
    currentProblem: null,
    timer: 60,
    aiTimer: null
};

const PROBLEMS = [
    {   // Multiplication by 11
        type: 'five',
        gen: () => {
            const n = Math.floor(Math.random() * 80) + 11;
            return { q: `${n} × 11`, a: n * 11, hint: `Split ${n}: ${Math.floor(n/10)} | (${Math.floor(n/10) + n%10}) | ${n%10}` };
        }
    },
    {   // Squares ending in 5
        type: 'five',
        gen: () => {
            const n = (Math.floor(Math.random() * 9) + 1) * 10 + 5;
            const firstPart = Math.floor(n/10);
            return { q: `${n}²`, a: n * n, hint: `${firstPart} × ${firstPart+1} then attach 25. (${firstPart*(firstPart+1)})25` };
        }
    },
    {   // Near 100
        type: 'near',
        gen: () => {
            const n = 99 - Math.floor(Math.random() * 5);
            const m = Math.floor(Math.random() * 9) + 2;
            return { q: `${n} × ${m}`, a: n * m, hint: `(100 - ${100-n}) × ${m} = ${100*m} - ${(100-n)*m}` };
        }
    },
    {   // Times 9
        type: 'nine',
        gen: () => {
            const n = Math.floor(Math.random() * 50) + 12;
            return { q: `${n} × 9`, a: n * 9, hint: `${n}0 - ${n} = ${n*9}` };
        }
    }
];

const RANKS = ["Novice", "Scholar", "Mathlete", "Calculus Ninja", "Quantum Mind", "DEITY"];

// Initialization
function updateStats() {
    const level = Math.floor(state.xp / 200);
    const nextLevelXP = (level + 1) * 200;
    const rankIndex = Math.min(level, RANKS.length - 1);
    
    document.getElementById('xp-val').innerText = state.xp;
    document.getElementById('next-level-xp').innerText = nextLevelXP;
    document.getElementById('rank-display').innerText = `Rank: ${RANKS[rankIndex]}`;
    document.getElementById('xp-fill').style.width = `${(state.xp % 200) / 2}%`;
    
    localStorage.setItem('xp_arena', state.xp);
}

function startGame(mode) {
    state.mode = mode;
    state.combo = 0;
    state.multiplier = 1;
    state.playerHP = 100;
    state.aiHP = 100;
    
    document.getElementById('game-menu').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    if(mode === 'battle') {
        document.getElementById('battle-stats').classList.remove('hidden');
        startAIAttack();
    }
    if(mode === 'speed') startTimer();
    
    nextQuestion();
}

function nextQuestion() {
    const pType = PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
    state.currentProblem = pType.gen();
    state.currentProblem.category = pType.type;
    
    const qText = document.getElementById('question-text');
    qText.innerText = state.currentProblem.q;
    qText.classList.remove('shake');
    
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').focus();
    
    if(state.mode === 'training') {
        document.getElementById('method-selector').classList.remove('hidden');
    }
}

function checkAnswer() {
    const val = parseInt(document.getElementById('answer-input').value);
    const isCorrect = (val === state.currentProblem.a);

    if(isCorrect) {
        processCorrect();
    } else {
        processWrong();
    }
    updateStats();
}

function processCorrect() {
    state.combo++;
    state.multiplier = state.combo > 5 ? 2 : 1;
    
    if(state.multiplier > 1) {
        document.getElementById('multiplier-badge').classList.remove('hidden');
        document.getElementById('question-text').classList.add('multiplier-glow');
    }

    let xpGain = 20 * state.multiplier;
    state.xp += xpGain;
    
    if(state.mode === 'battle') {
        state.aiHP -= 15;
        updateHP();
    }

    if(state.mode === 'training') {
        showModal("SUCCESS", state.currentProblem.hint, xpGain);
    } else {
        nextQuestion();
    }
    
    document.getElementById('combo-meter').innerText = `COMBO: ${state.combo}`;
}

function processWrong() {
    state.combo = 0;
    state.multiplier = 1;
    document.getElementById('multiplier-badge').classList.add('hidden');
    document.getElementById('question-text').classList.remove('multiplier-glow');
    document.getElementById('main-container').classList.add('shake');
    setTimeout(() => document.getElementById('main-container').classList.remove('shake'), 300);

    if(state.mode === 'battle') {
        state.playerHP -= 20;
        updateHP();
    }
    
    showModal("FAILED", `Correct: ${state.currentProblem.a}. Shortcut: ${state.currentProblem.hint}`, 0);
}

function updateHP() {
    document.getElementById('player-hp').style.width = state.playerHP + '%';
    document.getElementById('ai-hp').style.width = state.aiHP + '%';
    
    if(state.playerHP <= 0) endGame("AI NEURAL OVERLOADED YOU.");
    if(state.aiHP <= 0) endGame("AI SHUTDOWN. YOU WIN!");
}

function startAIAttack() {
    // AI attacks every 4 to 7 seconds
    state.aiTimer = setInterval(() => {
        state.playerHP -= 5;
        updateHP();
        document.getElementById('main-container').classList.add('shake');
        setTimeout(() => document.getElementById('main-container').classList.remove('shake'), 200);
    }, 6000);
}

function startTimer() {
    state.timer = 60;
    const tDisplay = document.getElementById('timer-display');
    tDisplay.classList.remove('hidden');
    
    const interval = setInterval(() => {
        state.timer--;
        tDisplay.innerText = `00:${state.timer < 10 ? '0' + state.timer : state.timer}`;
        if(state.timer <= 0 || state.mode !== 'speed') {
            clearInterval(interval);
            if(state.timer <= 0) endGame("TIME EXPIRED");
        }
    }, 1000);
}

function showModal(title, explain, xp) {
    document.getElementById('result-title').innerText = title;
    document.getElementById('explanation-box').innerText = explain;
    document.getElementById('reward-xp').innerText = xp;
    document.getElementById('result-modal').classList.remove('hidden');
}

function endGame(msg) {
    clearInterval(state.aiTimer);
    showModal("MISSION END", msg, "FINAL SCORE: " + state.combo);
}

function showMenu() {
    state.mode = '';
    clearInterval(state.aiTimer);
    document.getElementById('result-modal').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('game-menu').classList.remove('hidden');
    document.getElementById('battle-stats').classList.add('hidden');
}

// Event Listeners
document.getElementById('submit-btn').onclick = checkAnswer;
document.getElementById('answer-input').onkeypress = (e) => { if(e.key === 'Enter') checkAnswer(); };

// Init
updateStats();
