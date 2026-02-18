let state = {
    xp: parseInt(localStorage.getItem('math_arena_pro_xp')) || 0,
    combo: 0,
    mode: '',
    playerHP: 100,
    aiHP: 100,
    timer: 60,
    currentProblem: null,
    timerInterval: null,
    aiAttackInterval: null
};

// Advanced Shortcut Library Logic
const PROBLEMS = [
    { type: "mul11", gen: () => {
        const n = Math.floor(Math.random() * 85) + 12;
        return { q: `${n} × 11`, a: n * 11, hint: `Put the sum of ${Math.floor(n/10)} and ${n%10} in the middle: ${Math.floor(n/10)}|${Math.floor(n/10)+n%10}|${n%10}` };
    }},
    { type: "sq5", gen: () => {
        const n = (Math.floor(Math.random() * 9) + 1) * 10 + 5;
        const f = Math.floor(n/10);
        return { q: `${n}²`, a: n * n, hint: `${f} × ${f+1} = ${f*(f+1)}... then attach 25.` };
    }},
    { type: "div5", gen: () => {
        const n = (Math.floor(Math.random() * 45) + 5) * 2;
        return { q: `${n} ÷ 5`, a: n / 5, hint: `Double the number (${n*2}) then move decimal point: ${n*2/10}` };
    }},
    { type: "sub99", gen: () => {
        const n = Math.floor(Math.random() * 500) + 150;
        return { q: `${n} - 99`, a: n - 99, hint: `Subtract 100 and add 1: (${n}-100) + 1` };
    }},
    { type: "near100", gen: () => {
        const n = 100 - (Math.floor(Math.random() * 4) + 1);
        const m = Math.floor(Math.random() * 6) + 3;
        return { q: `${n} × ${m}`, a: n * m, hint: `Think (100-${100-n}) × ${m} = ${100*m} - ${(100-n)*m}` };
    }},
    { type: "add98", gen: () => {
        const n = Math.floor(Math.random() * 400) + 100;
        return { q: `${n} + 98`, a: n + 98, hint: `Add 100 and subtract 2: (${n}+100) - 2` };
    }}
];

const libraryData = [
    { title: "Addition: Rounding", desc: "98 ba 99 jog korte hole 100 jog kore extra tuku biyog koro.", ex: "145 + 98 → 245 - 2 = 243" },
    { title: "Subtraction: Rounding", desc: "99 biyog korte hole 100 biyog kore 1 jog koro.", ex: "350 - 99 → 250 + 1 = 251" },
    { title: "Division by 5", desc: "Shonkha tike double kore 10 diye vag (ek ghor age decimal) koro.", ex: "42 ÷ 5 → 84 ÷ 10 = 8.4" },
    { title: "Multiplication by 11", desc: "Duiti digit-er jogfol majhkhan-e boshaw.", ex: "53 × 11 → 5 (5+3) 3 = 583" },
    { title: "Square Numbers (Ends in 5)", desc: "Prothom digit × (Prothom digit + 1) ebong sheshe 25.", ex: "45² → (4×5) and 25 = 2025" },
    { title: "Near 100 Multiplication", desc: "Treat 97 as (100 - 3) and distribute.", ex: "97 × 4 → 400 - 12 = 388" }
];

// --- Core Logic ---

function updateUI() {
    const level = Math.floor(state.xp / 200);
    const ranks = ['Novice', 'Sage', 'Math-King', 'God'];
    document.getElementById('rank-display').innerText = `Rank: ${ranks[Math.min(level, 3)]}`;
    document.getElementById('xp-val').innerText = state.xp;
    document.getElementById('next-level-xp').innerText = (level + 1) * 200;
    document.getElementById('xp-fill').style.width = `${Math.min((state.xp % 200) / 2, 100)}%`;
    localStorage.setItem('math_arena_pro_xp', state.xp);
}

function showLibrary() {
    hideAllScreens();
    document.getElementById('library-screen').classList.remove('hidden');
    const container = document.getElementById('library-content');
    container.innerHTML = libraryData.map(d => `
        <div class="library-card">
            <h4>${d.title}</h4>
            <p>${d.desc}</p>
            <div class="example-box">Example: ${d.ex}</div>
        </div>
    `).join('');
}

function startGame(mode) {
    state.mode = mode;
    state.combo = 0;
    state.playerHP = 100;
    state.aiHP = 100;
    hideAllScreens();
    document.getElementById('game-screen').classList.remove('hidden');
    
    if(mode === 'battle') {
        document.getElementById('battle-stats').classList.remove('hidden');
        state.aiAttackInterval = setInterval(() => {
            state.playerHP -= 10;
            updateHP();
            triggerShake();
        }, 7000);
    }
    if(mode === 'speed') startTimer();
    nextQuestion();
}

function nextQuestion() {
    const p = PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
    state.currentProblem = p.gen();
    document.getElementById('question-text').innerText = state.currentProblem.q;
    const input = document.getElementById('answer-input');
    input.value = '';
    input.focus();
    document.getElementById('combo-meter').innerText = `COMBO: ${state.combo}`;
    document.getElementById('result-modal').classList.add('hidden');
}

function checkAnswer() {
    const inputVal = document.getElementById('answer-input').value;
    if(!inputVal) return;
    
    const ans = parseFloat(inputVal);
    const correct = (ans === state.currentProblem.a);

    if(correct) {
        state.combo++;
        state.xp += 25;
        if(state.mode === 'battle') state.aiHP -= 20;
        showFeedback(true, `Excellence! ${state.currentProblem.hint}`);
    } else {
        state.combo = 0;
        if(state.mode === 'battle') state.playerHP -= 20;
        triggerShake();
        showFeedback(false, `System Error! Correct: ${state.currentProblem.a}. Strategy: ${state.currentProblem.hint}`);
    }
    updateHP();
    updateUI();
}

function showFeedback(isCorrect, text) {
    document.getElementById('result-title').innerText = isCorrect ? "SUCCESS" : "FAILED";
    document.getElementById('result-title').style.color = isCorrect ? "var(--neon-green)" : "var(--neon-pink)";
    document.getElementById('explanation-box').innerText = text;
    document.getElementById('reward-xp').innerText = isCorrect ? "25" : "0";
    document.getElementById('modal-continue-btn').onclick = nextQuestion;
    document.getElementById('result-modal').classList.remove('hidden');
}

function updateHP() {
    if(state.mode !== 'battle') return;
    document.getElementById('player-hp').style.width = Math.max(state.playerHP, 0) + '%';
    document.getElementById('ai-hp').style.width = Math.max(state.aiHP, 0) + '%';
    if(state.playerHP <= 0) endGame("AI DEFEATED YOU");
    if(state.aiHP <= 0) endGame("AI NEURAL PURGED!");
}

function startTimer() {
    state.timer = 60;
    document.getElementById('timer-display').classList.remove('hidden');
    state.timerInterval = setInterval(() => {
        state.timer--;
        document.getElementById('timer-display').innerText = `00:${state.timer < 10 ? '0'+state.timer : state.timer}`;
        if(state.timer <= 0) endGame("TIME DEPLETED");
    }, 1000);
}

function endGame(msg) {
    clearInterval(state.timerInterval);
    clearInterval(state.aiAttackInterval);
    showFeedback(false, msg);
    document.getElementById('modal-continue-btn').onclick = showMenu;
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById('battle-stats').classList.add('hidden');
    document.getElementById('timer-display').classList.add('hidden');
    clearInterval(state.timerInterval);
    clearInterval(state.aiAttackInterval);
}

function showMenu() {
    hideAllScreens();
    document.getElementById('result-modal').classList.add('hidden');
    document.getElementById('game-menu').classList.remove('hidden');
}

function confirmExit() {
    if(confirm("Quit game?")) showMenu();
}

function triggerShake() {
    const c = document.getElementById('main-container');
    c.classList.add('shake');
    setTimeout(() => c.classList.remove('shake'), 300);
}

document.getElementById('submit-btn').onclick = checkAnswer;
document.getElementById('answer-input').onkeyup = (e) => e.key === 'Enter' && checkAnswer();

updateUI();
