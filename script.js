let state = {
    xp: parseInt(localStorage.getItem('math_arena_xp')) || 0,
    mode: '',
    currentProblem: null,
    timer: 0,
    timerInterval: null,
    // Test Stats
    correct: 0,
    wrong: 0,
    skipped: 0,
    totalToAsk: 0,
    askedCount: 0
};

const PROBLEMS = [
    { type: "mul11", gen: (n) => ({ q: `${n} × 11`, a: n * 11, h: "Split digits & add" }) },
    { type: "sq5", gen: (n) => { let f = Math.floor(n/10); return { q: `${n}²`, a: n * n, h: `${f}×${f+1} then 25` } } },
    { type: "div5", gen: (n) => ({ q: `${n} ÷ 5`, a: n / 5, h: "Double then dot" }) },
    { type: "near100", gen: (n) => ({ q: `98 × ${n}`, a: 98 * n, h: "98 = 100-2" }) }
];

function updateXP() {
    document.getElementById('xp-fill').style.width = (state.xp % 200 / 2) + '%';
    document.getElementById('rank-display').innerText = `Rank: ${state.xp > 1000 ? 'Sage' : 'Novice'}`;
    localStorage.setItem('math_arena_xp', state.xp);
}

function openConfig() {
    hideAll();
    document.getElementById('config-screen').classList.remove('hidden');
}

function startGame(mode) {
    state.mode = mode;
    state.correct = 0; state.wrong = 0; state.skipped = 0; state.askedCount = 0;
    
    if(mode === 'rapid') {
        state.totalToAsk = parseInt(document.getElementById('test-qty').value);
        state.timer = parseInt(document.getElementById('test-duration').value) * 60;
        document.getElementById('mcq-mode-ui').classList.remove('hidden');
        document.getElementById('input-mode-ui').classList.add('hidden');
        startTimer();
    } else {
        state.totalToAsk = 999; // Infinite for training
        document.getElementById('mcq-mode-ui').classList.add('hidden');
        document.getElementById('input-mode-ui').classList.remove('hidden');
    }

    hideAll();
    document.getElementById('game-screen').classList.remove('hidden');
    nextQuestion();
}

function nextQuestion() {
    if(state.askedCount >= state.totalToAsk) return finishTest();
    
    state.askedCount++;
    document.getElementById('q-counter').innerText = `Q: ${state.askedCount}/${state.mode==='rapid'?state.totalToAsk:'∞'}`;
    
    // Generate Random Problem
    const pBase = PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
    let n = Math.floor(Math.random() * 50) + 12;
    if(pBase.type === "sq5") n = (Math.floor(Math.random()*9)+1)*10+5;
    
    state.currentProblem = pBase.gen(n);
    document.getElementById('question-text').innerText = state.currentProblem.q;

    if(state.mode === 'rapid') {
        generateMCQOptions(state.currentProblem.a);
    } else {
        document.getElementById('answer-input').value = '';
        document.getElementById('answer-input').focus();
    }
}

function generateMCQOptions(correct) {
    const btns = document.querySelectorAll('.mcq-btn');
    let options = [correct];
    while(options.length < 4) {
        let fake = correct + (Math.floor(Math.random()*20) - 10);
        if(!options.includes(fake) && fake > 0) options.push(fake);
    }
    options.sort(() => Math.random() - 0.5);
    btns.forEach((btn, i) => btn.innerText = options[i]);
}

function checkMCQ(btn) {
    const val = parseInt(btn.innerText);
    if(val === state.currentProblem.a) {
        state.correct++;
        state.xp += 10;
        nextQuestion();
    } else {
        state.wrong++;
        nextQuestion();
    }
    updateXP();
}

// Training Mode Submit
document.getElementById('submit-btn').onclick = () => {
    const val = parseInt(document.getElementById('answer-input').value);
    if(val === state.currentProblem.a) {
        state.correct++; state.xp += 15;
        showModal("CORRECT", state.currentProblem.h);
    } else {
        state.wrong++;
        showModal("WRONG", `Correct: ${state.currentProblem.a}. ${state.currentProblem.h}`);
    }
    updateXP();
};

function skipQuestion() {
    state.skipped++;
    nextQuestion();
}

function startTimer() {
    clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
        state.timer--;
        let m = Math.floor(state.timer/60);
        let s = state.timer%60;
        document.getElementById('timer-display').innerText = `${m}:${s<10?'0'+s:s}`;
        if(state.timer <= 0) finishTest();
    }, 1000);
}

function finishTest() {
    clearInterval(state.timerInterval);
    const total = state.correct + state.wrong + state.skipped;
    const accuracy = Math.round((state.correct / (state.askedCount || 1)) * 100);
    
    document.getElementById('stat-correct').innerText = state.correct;
    document.getElementById('stat-wrong').innerText = state.wrong;
    document.getElementById('stat-skipped').innerText = state.skipped;
    document.getElementById('final-progress-fill').style.width = accuracy + '%';
    
    showModal("TEST COMPLETE", `Accuracy: ${accuracy}%`);
    document.getElementById('modal-continue-btn').onclick = showMenu;
}

function showModal(title, text) {
    document.getElementById('result-title').innerText = title;
    document.getElementById('explanation-box').innerText = text;
    document.getElementById('result-modal').classList.remove('hidden');
    document.getElementById('modal-continue-btn').onclick = nextQuestion;
}

function hideAll() {
    document.querySelectorAll('.screen, .modal').forEach(s => s.classList.add('hidden'));
}

function showMenu() {
    hideAll(); clearInterval(state.timerInterval);
    document.getElementById('game-menu').classList.remove('hidden');
}

function showLibrary() {
    hideAll();
    document.getElementById('library-screen').classList.remove('hidden');
    document.getElementById('library-content').innerHTML = "Study the techniques in Training Mode!";
}

updateXP();
