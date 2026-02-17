let state = {
    xp: parseInt(localStorage.getItem('pro_arena_xp')) || 0,
    combo: 0,
    mode: '',
    playerHP: 100,
    aiHP: 100,
    timer: 60,
    currentProblem: null,
    timerInterval: null,
    aiAttackInterval: null
};

// --- Advanced Shortcut Logic Data ---
const PROBLEMS = [
    { type: "mul11", gen: () => {
        const n = Math.floor(Math.random() * 85) + 12;
        return { q: `${n} × 11`, a: n * 11, hint: `Add digits: ${Math.floor(n/10)} | (${Math.floor(n/10)+n%10}) | ${n%10}` };
    }},
    { type: "sq5", gen: () => {
        const n = (Math.floor(Math.random() * 9) + 1) * 10 + 5;
        const f = Math.floor(n/10);
        return { q: `${n}²`, a: n * n, hint: `${f} × ${f+1} = ${f*(f+1)}... then attach 25.` };
    }},
    { type: "near100", gen: () => {
        const n = 100 - (Math.floor(Math.random() * 5) + 1);
        const m = Math.floor(Math.random() * 7) + 3;
        return { q: `${n} × ${m}`, a: n * m, hint: `Think (100 - ${100-n}) × ${m} = ${100*m} - ${(100-n)*m}` };
    }},
    { type: "add9", gen: () => {
        const n = Math.floor(Math.random() * 800) + 100;
        return { q: `${n} + 99`, a: n + 99, hint: `Add 100 then subtract 1: ${n+100} - 1` };
    }},
    { type: "div5", gen: () => {
        const n = (Math.floor(Math.random() * 40) + 5) * 2;
        return { q: `${n} ÷ 5`, a: n / 5, hint: `Double the number then divide by 10: (${n}×2)/10` };
    }},
    { type: "sub9", gen: () => {
        const n = Math.floor(Math.random() * 500) + 100;
        return { q: `${n} - 98`, a: n - 98, hint: `Subtract 100 then add 2: ${n-100} + 2` };
    }}
];

const libraryData = [
    { title: "Addition: The 'Round Up' Method", desc: "99 ba 98 jog korar somoy prothome 100 jog koro, tarpor extra tuku biyog koro.", ex: "456 + 99 → (456 + 100) - 1 = 555" },
    { title: "Subtraction: The 'Over-Subtract' Method", desc: "Boro shonkha biyog korte hole prothome 100 biyog koro, tarpor extra tuku jog koro.", ex: "245 - 98 → (245 - 100) + 2 = 147" },
    { title: "Multiplication: Double & Half Rule", desc: "Jodi ekta shonkha even hoy ar onno ta 5 diye shesh hoy, tobe ekta ke half ar onnotake double koro.", ex: "14 × 5 → 7 × 10 = 70" },
    { title: "Division by 5: The 'Double & Dot' Rule", desc: "Shonkha tike double koro ebong shesh theke ek ghor age decimal (dot) dao.", ex: "14 ÷ 5 → 14×2 = 28 → 2.8" },
    { title: "Squaring (Ends in 5)", desc: "Prothom digit ke tar porer digit diye gun kore pashe 25 boshaw.", ex: "65² → (6×7) and 25 = 4225" },
    { title: "Multiply by 11 (2-Digit)", desc: "Duitu digit jog kore majhkhan e boshaw.", ex: "45 × 11 → 4 (4+5) 5 = 495" }
];

// --- Core Engine ---

function updateUI() {
    const level = Math.floor(state.xp / 200);
    document.getElementById('rank-display').innerText = `Rank: ${['Novice', 'Sage', 'Math-King', 'God'][Math.min(level, 3)]}`;
    document.getElementById('xp-val').innerText = state.xp;
    document.getElementById('next-level-xp').innerText = (level + 1) * 200;
    document.getElementById('xp-fill').style.width = `${(state.xp % 200) / 2}%`;
    localStorage.setItem('pro_arena_xp', state.xp);
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
        }, 6000);
    }
    if(mode === 'speed') startTimer();
    nextQuestion();
}

function nextQuestion() {
    const p = PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
    state.currentProblem = p.gen();
    document.getElementById('question-text').innerText = state.currentProblem.q;
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').focus();
    document.getElementById('combo-meter').innerText = `COMBO: ${state.combo}`;
    document.getElementById('result-modal').classList.add('hidden');
}

function checkAnswer() {
    const ans = parseInt(document.getElementById('answer-input').value);
    const correct = (ans === state.currentProblem.a);

    if(correct) {
        state.combo++;
        state.xp += 25;
        if(state.mode === 'battle') state.aiHP -= 20;
        
        // Modal logic
        showFeedback(true, `Excellence! ${state.currentProblem.hint}`);
    } else {
        state.combo = 0;
        if(state.mode === 'battle') state.playerHP -= 20;
        triggerShake();
        showFeedback(false, `System Failure! Answer: ${state.currentProblem.a}. Strategy: ${state.currentProblem.hint}`);
    }
    updateHP();
    updateUI();
}

function showFeedback(isCorrect, text) {
    document.getElementById('result-title').innerText = isCorrect ? "DATA SECURED" : "CRITICAL ERROR";
    document.getElementById('result-title').style.color = isCorrect ? "var(--neon-green)" : "var(--neon-pink)";
    document.getElementById('explanation-box').innerText = text;
    document.getElementById('reward-xp').innerText = isCorrect ? "25" : "0";
    
    // Set continue button behavior
    document.getElementById('modal-continue-btn').onclick = nextQuestion;
    document.getElementById('result-modal').classList.remove('hidden');
}

function updateHP() {
    if(state.mode !== 'battle') return;
    document.getElementById('player-hp').style.width = state.playerHP + '%';
    document.getElementById('ai-hp').style.width = state.aiHP + '%';
    if(state.playerHP <= 0) endGame("AI NEURAL SYSTEM OVERWHELMED YOU");
    if(state.aiHP <= 0) endGame("AI SYSTEM PURGED. YOU WIN!");
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
    if(confirm("Exit current session? Progress will be lost.")) showMenu();
}

function triggerShake() {
    const c = document.getElementById('main-container');
    c.classList.add('shake');
    setTimeout(() => c.classList.remove('shake'), 300);
}

// Event Listeners
document.getElementById('submit-btn').onclick = checkAnswer;
document.getElementById('answer-input').onkeyup = (e) => e.key === 'Enter' && checkAnswer();

// Init
updateUI();
