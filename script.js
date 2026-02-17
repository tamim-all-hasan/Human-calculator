let state = {
    xp: parseInt(localStorage.getItem('arena_xp')) || 0,
    combo: 0,
    mode: '',
    playerHP: 100,
    aiHP: 100,
    timer: 60,
    currentProblem: null,
    timerInterval: null,
    aiAttackInterval: null
};

const PROBLEMS = [
    {
        name: "11 Trick",
        gen: () => {
            const n = Math.floor(Math.random() * 80) + 11;
            return { q: `${n} × 11`, a: n * 11, hint: `Split ${n}: ${Math.floor(n/10)} | (${Math.floor(n/10) + n%10}) | ${n%10}` };
        }
    },
    {
        name: "Square 5",
        gen: () => {
            const n = (Math.floor(Math.random() * 9) + 1) * 10 + 5;
            const first = Math.floor(n/10);
            return { q: `${n}²`, a: n * n, hint: `${first} × ${first+1} = ${first*(first+1)}, then add 25 at the end.` };
        }
    },
    {
        name: "Near 100",
        gen: () => {
            const n = 99 - Math.floor(Math.random() * 4);
            const m = Math.floor(Math.random() * 8) + 2;
            return { q: `${n} × ${m}`, a: n * m, hint: `(100 - ${100-n}) × ${m} = ${100*m} - ${(100-n)*m}` };
        }
    },
    {
        name: "x9 Rule",
        gen: () => {
            const n = Math.floor(Math.random() * 40) + 11;
            return { q: `${n} × 9`, a: n * 9, hint: `${n} × 10 - ${n} = ${n*10 - n}` };
        }
    }
];

const RANKS = ["Novice", "Scholar", "Mathlete", "Ninja", "Overlord"];

const libraryData = [
    { title: "Multiplication by 11", desc: "Split the digits and put their sum in the middle.", ex: "35 × 11 = 3 (3+5) 5 = 385" },
    { title: "Squaring Ends in 5", desc: "Multiply the first digit by (itself + 1) and add 25.", ex: "25² = (2×3) 25 = 625" },
    { title: "The ×9 Shortcut", desc: "Multiply by 10 and subtract the original number.", ex: "12 × 9 = 120 - 12 = 108" },
    { title: "Near 100 Strategy", desc: "Treat 98 as (100-2) or 97 as (100-3).", ex: "98 × 6 = 600 - 12 = 588" }
];

function updateUI() {
    const level = Math.floor(state.xp / 200);
    const rank = RANKS[Math.min(level, RANKS.length - 1)];
    document.getElementById('rank-display').innerText = `Rank: ${rank}`;
    document.getElementById('xp-val').innerText = state.xp;
    document.getElementById('next-level-xp').innerText = (level + 1) * 200;
    document.getElementById('xp-fill').style.width = `${(state.xp % 200) / 2}%`;
    localStorage.setItem('arena_xp', state.xp);
}

function showLibrary() {
    document.getElementById('game-menu').classList.add('hidden');
    document.getElementById('library-screen').classList.remove('hidden');
    const libBody = document.getElementById('library-content');
    libBody.innerHTML = libraryData.map(item => `
        <div class="library-card">
            <h4>${item.title}</h4>
            <p>${item.desc}</p>
            <div class="example-box">Example: ${item.ex}</div>
        </div>
    `).join('');
}

function startGame(mode) {
    state.mode = mode;
    state.combo = 0;
    state.playerHP = 100;
    state.aiHP = 100;
    document.getElementById('game-menu').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    if(mode === 'battle') {
        document.getElementById('battle-stats').classList.remove('hidden');
        state.aiAttackInterval = setInterval(() => {
            state.playerHP -= 8;
            updateHP();
            triggerShake();
        }, 5000);
    }
    if(mode === 'speed') startTimer();
    nextQuestion();
}

function startTimer() {
    state.timer = 60;
    document.getElementById('timer-display').classList.remove('hidden');
    state.timerInterval = setInterval(() => {
        state.timer--;
        document.getElementById('timer-display').innerText = `00:${state.timer < 10 ? '0'+state.timer : state.timer}`;
        if(state.timer <= 0) endGame("TIME'S UP!");
    }, 1000);
}

function nextQuestion() {
    const p = PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
    state.currentProblem = p.gen();
    document.getElementById('question-text').innerText = state.currentProblem.q;
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').focus();
    document.getElementById('combo-meter').innerText = `COMBO: ${state.combo}`;
}

function checkAnswer() {
    const val = parseInt(document.getElementById('answer-input').value);
    if(val === state.currentProblem.a) {
        state.combo++;
        state.xp += 20;
        if(state.mode === 'battle') state.aiHP -= 20;
        if(state.mode === 'training') {
            showResult("CORRECT", state.currentProblem.hint, 20);
        } else {
            nextQuestion();
        }
    } else {
        state.combo = 0;
        if(state.mode === 'battle') state.playerHP -= 15;
        triggerShake();
        showResult("WRONG", `Correct was ${state.currentProblem.a}. Shortcut: ${state.currentProblem.hint}`, 0);
    }
    updateHP();
    updateUI();
}

function updateHP() {
    if(state.mode !== 'battle') return;
    document.getElementById('player-hp').style.width = state.playerHP + '%';
    document.getElementById('ai-hp').style.width = state.aiHP + '%';
    if(state.playerHP <= 0) endGame("AI DEFEATED YOU");
    if(state.aiHP <= 0) endGame("AI DESTROYED!");
}

function triggerShake() {
    const container = document.getElementById('main-container');
    container.classList.add('shake');
    setTimeout(() => container.classList.remove('shake'), 300);
}

function showResult(title, explain, xp) {
    document.getElementById('result-title').innerText = title;
    document.getElementById('explanation-box').innerText = explain;
    document.getElementById('reward-xp').innerText = xp;
    document.getElementById('result-modal').classList.remove('hidden');
}

function endGame(msg) {
    clearInterval(state.timerInterval);
    clearInterval(state.aiAttackInterval);
    showResult("GAME OVER", msg, state.combo * 10);
}

function showMenu() {
    clearInterval(state.timerInterval);
    clearInterval(state.aiAttackInterval);
    document.querySelectorAll('.screen, .modal, #battle-stats, #timer-display').forEach(el => el.classList.add('hidden'));
    document.getElementById('game-menu').classList.remove('hidden');
}

document.getElementById('submit-btn').onclick = checkAnswer;
document.getElementById('answer-input').onkeyup = (e) => e.key === 'Enter' && checkAnswer();

updateUI();
