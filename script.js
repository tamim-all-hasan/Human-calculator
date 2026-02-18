let state={
xp:parseInt(localStorage.getItem("xp"))||0,
combo:0,
mode:"",
playerHP:100,
aiHP:100,
timer:60,
score:0,
currentProblem:null,
timerInterval:null,
aiAttackInterval:null
};

const PROBLEMS=[
{gen:()=>{let n=Math.floor(Math.random()*80)+20;return{q:`${n} × 11`,a:n*11}}},
{gen:()=>{let n=(Math.floor(Math.random()*9)+1)*10+5;return{q:`${n}²`,a:n*n}}},
{gen:()=>{let n=(Math.floor(Math.random()*45)+5)*2;return{q:`${n} ÷ 5`,a:n/5}}},
{gen:()=>{let n=Math.floor(Math.random()*500)+100;return{q:`${n}-99`,a:n-99}}},
{gen:()=>{let n=Math.floor(Math.random()*400)+100;return{q:`${n}+98`,a:n+98}}}
];

function updateUI(){
let level=Math.floor(state.xp/200);
let ranks=["Novice","Sage","Math-King","God"];
document.getElementById("rank-display").innerText=`Rank: ${ranks[Math.min(level,3)]}`;
document.getElementById("xp-val").innerText=state.xp;
document.getElementById("next-level-xp").innerText=(level+1)*200;
document.getElementById("xp-fill").style.width=`${(state.xp%200)/2}%`;
localStorage.setItem("xp",state.xp);
}

function getMultiplier(){
if(state.combo>=10)return 3;
if(state.combo>=5)return 2;
return 1;
}

function startGame(mode){
state.mode=mode;
state.combo=0;
state.playerHP=100;
state.aiHP=100;
state.score=0;
hideAllScreens();
document.getElementById("game-screen").classList.remove("hidden");

if(mode==="battle"){
document.getElementById("battle-stats").classList.remove("hidden");
state.aiAttackInterval=setInterval(()=>{
let damage=5+Math.floor(Math.random()*15);
state.playerHP-=damage;
updateHP();
triggerShake();
},5000);
}

if(mode==="speed")startTimer();
nextQuestion();
}

function nextQuestion(){
let pool=state.xp<300?PROBLEMS.slice(0,3):PROBLEMS;
let p=pool[Math.floor(Math.random()*pool.length)];
state.currentProblem=p.gen();
document.getElementById("question-text").innerText=state.currentProblem.q;
document.getElementById("answer-input").value="";
document.getElementById("combo-meter").innerText=`COMBO: ${state.combo}`;
document.getElementById("result-modal").classList.add("hidden");
setTimeout(()=>document.getElementById("answer-input").focus(),100);
}

function checkAnswer(){
let val=document.getElementById("answer-input").value;
if(!val)return;
let correct=parseFloat(val)===state.currentProblem.a;

if(correct){
state.combo++;
let xpGain=25*getMultiplier();
state.xp+=xpGain;
if(state.mode==="battle")state.aiHP-=20;
if(state.mode==="speed")state.score++;
showFeedback(true,`Correct! +${xpGain} XP`);
}else{
state.combo=0;
if(state.mode==="battle")state.playerHP-=20;
triggerShake();
showFeedback(false,`Wrong! Correct: ${state.currentProblem.a}`);
}
updateHP();
updateUI();
}

function showFeedback(ok,text){
document.getElementById("result-title").innerText=ok?"SUCCESS":"FAILED";
document.getElementById("explanation-box").innerText=text;
document.getElementById("reward-xp").innerText=ok?25*getMultiplier():0;
document.getElementById("modal-continue-btn").onclick=nextQuestion;
document.getElementById("result-modal").classList.remove("hidden");
}

function updateHP(){
if(state.mode!=="battle")return;
document.getElementById("player-hp").style.width=Math.max(state.playerHP,0)+"%";
document.getElementById("ai-hp").style.width=Math.max(state.aiHP,0)+"%";
if(state.playerHP<=0)endGame("AI WON");
if(state.aiHP<=0)endGame("YOU DEFEATED AI");
}

function startTimer(){
state.timer=60;
document.getElementById("timer-display").classList.remove("hidden");
state.timerInterval=setInterval(()=>{
state.timer--;
document.getElementById("timer-display").innerText=`00:${state.timer<10?"0"+state.timer:state.timer}`;
if(state.timer<=0)endGame(`TIME UP | SCORE: ${state.score}`);
},1000);
}

function endGame(msg){
clearInterval(state.timerInterval);
clearInterval(state.aiAttackInterval);
showFeedback(false,msg);
document.getElementById("modal-continue-btn").onclick=showMenu;
}

function hideAllScreens(){
document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
document.getElementById("battle-stats").classList.add("hidden");
document.getElementById("timer-display").classList.add("hidden");
clearInterval(state.timerInterval);
clearInterval(state.aiAttackInterval);
}

function showMenu(){
hideAllScreens();
document.getElementById("result-modal").classList.add("hidden");
document.getElementById("game-menu").classList.remove("hidden");
}

function confirmExit(){
if(confirm("Quit game?"))showMenu();
}

function triggerShake(){
let c=document.getElementById("main-container");
c.classList.add("shake");
setTimeout(()=>c.classList.remove("shake"),300);
}

document.getElementById("submit-btn").onclick=checkAnswer;
document.getElementById("answer-input").onkeyup=e=>e.key==="Enter"&&checkAnswer();

updateUI();
