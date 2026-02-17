:root {
    --bg: #050505;
    --card: #111115;
    --neon-blue: #00f2ff;
    --neon-purple: #9d00ff;
    --neon-pink: #ff007b;
    --neon-green: #39ff14;
    --text: #ffffff;
}

body {
    background-color: var(--bg);
    color: var(--text);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.container {
    width: 400px;
    background: var(--card);
    border: 1px solid #333;
    padding: 25px;
    border-radius: 12px;
    position: relative;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

/* Stats & XP */
.stats-top { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: bold; color: var(--neon-blue); }
.xp-container { height: 6px; background: #222; margin: 8px 0; border-radius: 10px; overflow: hidden; }
.xp-fill { width: 0%; height: 100%; background: var(--neon-blue); box-shadow: 0 0 10px var(--neon-blue); transition: width 0.4s ease; }
.xp-info { font-size: 0.7rem; text-align: right; color: #888; }

/* Menu Cards */
.mode-selector { display: flex; flex-direction: column; gap: 12px; margin-top: 20px; }
.mode-card {
    background: #1a1a20;
    border: 1px solid #333;
    padding: 12px 15px;
    text-align: left;
    cursor: pointer;
    border-radius: 8px;
    transition: 0.2s;
}
.mode-card:hover { border-color: var(--neon-blue); background: #22222b; }
.mode-card h3 { margin: 0; color: var(--neon-blue); font-size: 0.9rem; }
.mode-card p { margin: 4px 0 0; color: #888; font-size: 0.75rem; }
.library-btn { border-color: var(--neon-purple); }
.library-btn h3 { color: var(--neon-purple); }

/* Game Elements */
.glow-text { text-align: center; color: var(--neon-blue); text-shadow: 0 0 10px var(--neon-blue); margin: 0; }
.game-hud { display: flex; justify-content: space-between; margin: 15px 0; font-size: 0.9rem; font-weight: bold; }
#question-text { font-size: 2.5rem; text-align: center; margin: 20px 0; letter-spacing: 2px; }

/* Input */
.input-group { display: flex; gap: 10px; }
#answer-input {
    flex: 1;
    background: #000;
    border: 1px solid #444;
    color: var(--neon-green);
    font-size: 1.5rem;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
}
#submit-btn {
    background: var(--neon-blue);
    border: none;
    padding: 0 20px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
}

/* HP Bars */
#battle-stats { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.hp-bar { width: 100px; height: 8px; background: #222; border-radius: 4px; overflow: hidden; }
.hp-fill { width: 100%; height: 100%; background: var(--neon-green); transition: 0.3s; }
.enemy .hp-fill { background: var(--neon-pink); }

/* Library */
.library-grid { max-height: 350px; overflow-y: auto; margin: 15px 0; padding-right: 5px; }
.library-card { background: #1a1a20; padding: 12px; border-radius: 5px; margin-bottom: 10px; border-left: 3px solid var(--neon-blue); }
.library-card h4 { margin: 0 0 5px; color: var(--neon-blue); font-size: 0.9rem; }
.library-card p { font-size: 0.75rem; color: #bbb; margin: 0; }
.example-box { background: #000; color: var(--neon-green); padding: 5px; font-size: 0.8rem; margin-top: 8px; border-radius: 3px; }

/* Modal */
.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-content { background: var(--card); border: 1px solid var(--neon-blue); padding: 30px; text-align: center; width: 80%; border-radius: 10px; }
#explanation-box { font-size: 0.85rem; color: #ccc; margin: 15px 0; line-height: 1.4; }
.highlight { color: var(--neon-blue); font-size: 1.2rem; }
.menu-btn, .restart-btn { background: none; border: 1px solid var(--neon-blue); color: var(--neon-blue); padding: 10px 20px; cursor: pointer; border-radius: 5px; margin-top: 10px; width: 100%; }

.hidden { display: none !important; }
.shake { animation: shake 0.3s; }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
