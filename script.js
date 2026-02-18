let state={
xp:parseInt(localStorage.getItem("xp"))||0,
combo:0,
mode:"",
timer:60,
score:0,
currentProblem:null,
timerInterval:null
};

const PROBLEMS=[
{
type:"mul11",
rule:"Multiplication by 11 → Add digits and place in middle.",
gen:()=>{
let n=Math.floor(Math.random()*80)+20;
return{q:`${n} × 11`,a:n*11};
}
},
{
type:"sq5",
rule:"Square ending in 5 → First digit × (first digit+1) and attach 25.",
gen:()=>{
let n=(Math.floor(Math.random()*9)+1)*10+5;
return{q:`${n}²`,a:n*n};
}
},
{
type:"div5",
rule:"Divide by 5 → Double it and divide by 10.",
gen:()=>{
let n=(Math.floor(Math.random()*45)+5)*2;
return{q:`${n} ÷ 5`,a:n/5};
}
},
{
type:"sub99",
rule:"Subtract 99 → Subtract 100 then add 1.",
gen:()=>{
let n=Math.floor(Math.random()*500)+100;
return{q:`${n} - 99`,a:n-99};
}
},
{
type:"add98",
rule:"Add 98 → Add 100 then subtract 2.",
gen:()=>{
let n=Math.floor(Math.random()*400)+100;
return{q:`${n} + 98`,a:n+98};
}
}
];

const libraryData=[
{title:"Multiply by 11",desc:"Add digits and place in middle.",ex:"53 × 11 → 583"},
{title:"Square ending in 5",desc:"First digit × next digit then add 25.",ex:"45² → 2025"},
{title:"Divide by 5",desc:"Double and divide by 10.",ex:"42 ÷ 5 → 8.4"},
{title:"Subtract 99",desc:"Subtract 100 then add 1.",ex:"350 - 99 → 251"},
{title:"Add 98",desc:"Add 100 then subtract 2.",ex:"145 + 98 → 243"}
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

function showLibrary(){
hideAllScreens();
document.getElementById("library-screen").classList.remove("hidden");

let container=document.getElementById("library-content");
container.innerHTML=libraryData.map(d=>`
<div class="library-card">
<h4>${d.title}</h4>
<p>${d.desc}</p>
<div class="example-box">${d.ex}</div>
</div>
`).join("");
}

function startGame(mode){
state.mode=mode;
state.combo=0;
state.score=0;
hideAllScreens();
document.getElementById("game-screen").classList.remove("hidden");

if(mode==="speed")startTimer();

nextQuestion();
}

function nextQuestion(){
let p=PROBLEMS[Math.floor(Math.random()*PROBLEMS.length)];
state.currentProblem=p;
let generated=p.gen();
state.currentProblem.answer=generated.a;
state.currentProblem.question=generated.q;

document.getElementById("question-text").innerText=generated.q;
document.getElementById("answer-input").value="";
document.getElementById("combo-meter").innerText=`COMBO: ${state.combo}`;
document.getElementById("result-modal").classList.add("hidden");
}

function checkAnswer(){
let val=document.getElementById("answer-input").value;
if(!val)return;

let correct=parseFloat(val)===state.currentProblem.answer;

if(correct){
state.combo++;
state.xp+=25;
if(state.mode==="speed")state.score++;
showFeedback(true,"Correct!");
}else{
state.combo=0;

if(state.mode==="training"){
showFeedback(false,
`Wrong!\nCorrect: ${state.currentProblem.answer}\n\nRule:\n${state.currentProblem.rule}`
);
}else{
showFeedback(false,`Wrong! Correct: ${state.currentProblem.answer}`);
}
}

updateUI();
}

function showFeedback(ok,text){
document.getElementById("result-title").innerText=ok?"SUCCESS":"FAILED";
document.getElementById("explanation-box").innerText=text;
document.getElementById("reward-xp").innerText=ok?25:0;
document.getElementById("modal-continue-btn").onclick=nextQuestion;
document.getElementById("result-modal").classList.remove("hidden");
}

function startTimer(){
state.timer=60;
document.getElementById("timer-display").classList.remove("hidden");
state.timerInterval=setInterval(()=>{
state.timer--;
document.getElementById("timer-display").innerText=`00:${state.timer<10?"0"+state.timer:state.timer}`;
if(state.timer<=0){
clearInterval(state.timerInterval);
showFeedback(false,`TIME UP | SCORE: ${state.score}`);
document.getElementById("modal-continue-btn").onclick=showMenu;
}
},1000);
}

function hideAllScreens(){
document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
document.getElementById("timer-display").classList.add("hidden");
clearInterval(state.timerInterval);
}

function showMenu(){
hideAllScreens();
document.getElementById("result-modal").classList.add("hidden");
document.getElementById("game-menu").classList.remove("hidden");
}

document.getElementById("submit-btn").onclick=checkAnswer;
document.getElementById("answer-input").onkeyup=e=>e.key==="Enter"&&checkAnswer;

updateUI();
