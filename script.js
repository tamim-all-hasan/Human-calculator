let correctAnswer;
let difficulty = 1;
let timer;
let timeLeft = 100;
let challengeMode = false;

function setDifficulty(level){
    difficulty = level;
    alert("Difficulty Set!");
}

function generateQuestion(){
    let max = difficulty === 1 ? 20 : difficulty === 2 ? 50 : 100;

    let num1 = Math.floor(Math.random() * max);
    let num2 = Math.floor(Math.random() * max);

    let operators = ["+","-","*"];
    let operator = operators[Math.floor(Math.random()*operators.length)];

    if(operator === "+") correctAnswer = num1 + num2;
    if(operator === "-") correctAnswer = num1 - num2;
    if(operator === "*") correctAnswer = num1 * num2;

    document.getElementById("question").innerText = `${num1} ${operator} ${num2}`;
}

function startTraining(){
    challengeMode = false;
    document.getElementById("gameSection").classList.remove("hidden");
    document.getElementById("progressContainer").classList.add("hidden");
    generateQuestion();
}

function startChallenge(){
    challengeMode = true;
    document.getElementById("gameSection").classList.remove("hidden");
    document.getElementById("progressContainer").classList.remove("hidden");
    timeLeft = 100;
    generateQuestion();
    startTimer();
}

function startTimer(){
    timer = setInterval(()=>{
        timeLeft--;
        document.getElementById("progressBar").style.width = timeLeft + "%";
        if(timeLeft <= 0){
            clearInterval(timer);
            document.getElementById("feedback").innerText = "⏳ Time Over!";
        }
    },100);
}

function checkAnswer(){
    let userAnswer = Number(document.getElementById("answer").value);
    let feedback = document.getElementById("feedback");

    if(userAnswer === correctAnswer){
        feedback.innerHTML = "<span class='green'>Correct 🔥</span>";
        document.getElementById("answer").value = "";
        generateQuestion();
    } else {
        feedback.innerHTML = "<span class='orange'>Wrong ❌</span><br>Rule: Practice base arithmetic focus.";
    }
}

function exitGame(){
    document.getElementById("gameSection").classList.add("hidden");
    clearInterval(timer);
    document.getElementById("feedback").innerText = "";
}

function toggleVault(){
    document.getElementById("vault").classList.toggle("hidden");
}
