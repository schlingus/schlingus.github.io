document.getElementById('playBtn').onclick = function() {
    document.querySelector('.title-screen').style.display = 'none';
    showControlsOverlay();
};

document.getElementById('exitBtn').onclick = function() {
    window.close();
};

function showControlsOverlay() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'controls-overlay';
    overlay.innerHTML = `
        <div class="controls-box">
            <h2>Controls</h2>
            <ul>
                <li><b>Arrow Keys / WASD</b>: Move</li>
                <li><b>Space</b>: Action / Interact</li>
                <li><b>Esc</b>: Pause / Menu</li>
            </ul>
            <button class="game-btn continue-btn">Click to Continue</button>
        </div>
    `;
    document.body.appendChild(overlay);
    document.querySelector('.continue-btn').onclick = function() {
        document.querySelector('.controls-overlay').remove();
        // Do NOT show the map here, just start the day intro
        startDayIntro(1);
    };
}

function startDayIntro(dayNum) {
    // Hide map during day overlay
    let container = document.querySelector('.game-canvas-container');
    if (container) container.style.display = 'none';
    // Show Day overlay
    const dayOverlay = document.createElement('div');
    dayOverlay.className = 'day-overlay';
    dayOverlay.textContent = `Day ${dayNum}`;
    document.body.appendChild(dayOverlay);
    setTimeout(() => {
        dayOverlay.remove();
        playDayOneDialog();
    }, 1800);
}

function playDayOneDialog() {
    showDialog(
        'schlergus',
        "hello, i am schlergus. i have a favor to ask of you. i want you to kill an enemy of mine. his name is bungile. i want to to find him and kill him.",
        () => {
            showDialog(
                'schlingus',
                'okay, i will do it',
                fadeToBlack
            );
        }
    );
}

function showDialog(character, text, onDone) {
    // Hide map and disable movement during dialog
    let container = document.querySelector('.game-canvas-container');
    if (container) container.style.display = 'none';
    window._schlergus_disableMovement = true;
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    const box = document.createElement('div');
    box.className = 'dialog-box';
    const sprite = document.createElement('div');
    sprite.className = 'dialog-sprite ' + (character === 'schlergus' ? 'schlergus-sprite' : 'schlingus-sprite');
    // Set sprite image from assets
    if (character === 'schlergus') {
        sprite.style.backgroundImage = "url('assets/schlergus.png')";
    } else {
        sprite.style.backgroundImage = "url('assets/schlingus.png')";
    }
    const dialogText = document.createElement('div');
    dialogText.className = 'dialog-text';
    // Add skip button
    const skipBtn = document.createElement('button');
    skipBtn.className = 'dialog-skip-btn';
    skipBtn.textContent = 'Skip';
    skipBtn.onclick = function(e) {
        e.stopPropagation();
        // Instantly finish dialog
        i = text.length;
        dialogText.textContent = text;
        setTimeout(() => {
            overlay.remove();
            window._schlergus_disableMovement = false;
            if (onDone) {
                if (typeof onDone === 'function' && onDone.name === 'fadeToBlack') {
                    onDone();
                } else {
                    let container = document.querySelector('.game-canvas-container');
                    if (container) container.style.display = 'flex';
                    onDone();
                }
            }
        }, 100);
    };
    box.appendChild(sprite);
    box.appendChild(dialogText);
    box.appendChild(skipBtn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    // Typewriter effect
    let i = 0;
    function type() {
        dialogText.textContent = text.slice(0, i);
        if (i < text.length) {
            i++;
            setTimeout(type, 22);
        } else {
            setTimeout(() => {
                overlay.remove();
                window._schlergus_disableMovement = false;
                if (onDone) {
                    // Only show map after the last dialog in the chain
                    if (typeof onDone === 'function' && onDone.name === 'fadeToBlack') {
                        // Don't show map yet, fadeToBlack will handle it
                        onDone();
                    } else {
                        let container = document.querySelector('.game-canvas-container');
                        if (container) container.style.display = 'flex';
                        onDone();
                    }
                }
            }, 1100);
        }
    }
    type();
}

function fadeToBlack() {
    let fade = document.querySelector('.fade-black');
    if (!fade) {
        fade = document.createElement('div');
        fade.className = 'fade-black';
        document.body.appendChild(fade);
    }
    setTimeout(() => {
        fade.classList.add('active');
        setTimeout(() => {
            fade.classList.remove('active');
            // Show map after fade
            let container = document.querySelector('.game-canvas-container');
            if (container) container.style.display = 'flex';
            startHouseScene();
        }, 1400);
    }, 100);
}

// --- MAP & CANVAS SETUP ---
// Ensure canvas container and canvas exist at page load
(function setupGameCanvas() {
    let container = document.querySelector('.game-canvas-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'game-canvas-container';
        document.body.appendChild(container);
    }
    let canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'gameCanvas';
        canvas.width = 640;
        canvas.height = 400;
        container.appendChild(canvas);
    }
    // Only show the map when the game is running, not on the title screen or during overlays
    container.style.display = 'none';
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.zIndex = '2'; // Lower z-index so overlays appear above
    container.style.pointerEvents = 'all';
    container.style.background = 'none';
})();

// --- GAME STATE ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const houseMap = [
    '############',
    '#....#.....#',
    '###..#..#..#',
    '#..K.#..#..#',
    '#.####..#..#',
    '#......###.#',
    '#.######...#',
    '#..P....#B.#',
    '############',
];
let player = { x: 4, y: 7, img: new Image(), hasKnife: false };
player.img.src = 'assets/schlingus.png';
let bungile = { x: 9, y: 7, img: new Image() };
bungile.img.src = 'assets/bungile.png';
let knife = { x: 4, y: 3, collected: false };
let bungileOutcome = null; // 'killed' or 'spared'

// --- MOVEMENT ---
let movementEnabled = true;
window.onkeydown = e => {
    if (!movementEnabled) return;
    const key = e.key.toLowerCase();
    let nx = player.x, ny = player.y;
    let moved = false;
    if (key === 'w' || key === 'arrowup') {
        if (canMove(nx, ny-1)) { ny--; moved = true; }
    } else if (key === 's' || key === 'arrowdown') {
        if (canMove(nx, ny+1)) { ny++; moved = true; }
    } else if (key === 'a' || key === 'arrowleft') {
        if (canMove(nx-1, ny)) { nx--; moved = true; }
    } else if (key === 'd' || key === 'arrowright') {
        if (canMove(nx+1, ny)) { nx++; moved = true; }
    }
    if (moved) {
        // Prevent moving onto Bungile without knife
        if (nx === bungile.x && ny === bungile.y) {
            if (player.hasKnife) {
                player.x = nx; player.y = ny; // Move player onto Bungile's tile
                showBattleScene();
                return;
            } else {
                return;
            }
        }
        player.x = nx; player.y = ny;
        // Pick up knife
        if (!knife.collected && player.x === knife.x && player.y === knife.y) {
            knife.collected = true;
            player.hasKnife = true;
        }
    }
};

function canMove(x, y) {
    return houseMap[y][x] !== '#';
}

function drawMap() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const tile = 48;
    for (let y=0; y<houseMap.length; y++) {
        for (let x=0; x<houseMap[y].length; x++) {
            if (houseMap[y][x] === '#') {
                ctx.fillStyle = '#1a0d13';
                ctx.fillRect(x*tile, y*tile, tile, tile);
                ctx.strokeStyle = '#a10000';
                ctx.lineWidth = 2;
                ctx.strokeRect(x*tile, y*tile, tile, tile);
            } else {
                ctx.fillStyle = '#ede2d6';
                ctx.fillRect(x*tile, y*tile, tile, tile);
            }
        }
    }
    // Draw Knife if not collected
    if (!knife.collected) {
        ctx.save();
        ctx.translate(knife.x*tile+tile/2, knife.y*tile+tile/2);
        ctx.rotate(-Math.PI/6);
        ctx.fillStyle = '#eee';
        ctx.fillRect(-4, -18, 8, 28);
        ctx.fillStyle = '#a10000';
        ctx.fillRect(-4, 8, 8, 8);
        ctx.restore();
    }
    // Draw Bungile with border
    if (bungile.x >= 0 && bungile.y >= 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(bungile.x*tile+tile/2, bungile.y*tile+tile/2, tile/2-4, 0, 2*Math.PI);
        ctx.strokeStyle = '#ff1744';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(bungile.img, bungile.x*tile+4, bungile.y*tile+4, tile-8, tile-8);
        ctx.restore();
    }
    // Draw Player with border
    ctx.save();
    ctx.beginPath();
    ctx.arc(player.x*tile+tile/2, player.y*tile+tile/2, tile/2-4, 0, 2*Math.PI);
    ctx.strokeStyle = '#ffe082';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(player.img, player.x*tile+4, player.y*tile+4, tile-8, tile-8);
    ctx.restore();
}

function gameLoop() {
    drawMap();
    requestAnimationFrame(gameLoop);
}
player.img.onload = bungile.img.onload = () => gameLoop();

function fadeToBlack() {
    let fade = document.querySelector('.fade-black');
    if (!fade) {
        fade = document.createElement('div');
        fade.className = 'fade-black';
        document.body.appendChild(fade);
    }
    setTimeout(() => {
        fade.classList.add('active');
        setTimeout(() => {
            fade.classList.remove('active');
            // Show map after fade
            let container = document.querySelector('.game-canvas-container');
            if (container) container.style.display = 'flex';
            startHouseScene();
        }, 1400);
    }, 100);
}

function startHouseScene() {
    // Remove overlays if any
    document.querySelectorAll('.day-overlay, .dialog-overlay, .controls-overlay, .fight-overlay').forEach(e => e.remove());
    // Only reset player, bungile, knife for new day if this is the first time (Day 1)
    if (bungileOutcome === null && window.mistrakeOutcome === undefined) {
        player.x = 4; player.y = 7; player.hasKnife = false;
        bungile.x = 9; bungile.y = 7;
        knife.x = 4; knife.y = 3; knife.collected = false;
    }
    // Make sure the map container is always visible and interactive
    let container = document.querySelector('.game-canvas-container');
    if (container) {
        container.style.display = 'flex';
        container.style.position = 'fixed';
        container.style.left = '0';
        container.style.top = '0';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.zIndex = '2'; // Lower z-index so overlays appear above
        container.style.pointerEvents = 'all';
        container.style.background = 'none';
    }
    // Enable movement for the map
    movementEnabled = true;
}

function showBattleScene() {
    // Show overlay above map (do not hide map)
    movementEnabled = false;
    document.querySelectorAll('.fight-overlay').forEach(e => e.remove());
    const overlay = document.createElement('div');
    overlay.className = 'fight-overlay undertale-fight';
    overlay.innerHTML = `
        <div class="fight-bg"></div>
        <div class="fight-crt"></div>
        <div class="fight-fog"></div>
        <div class="fight-candle"></div>
        <div class="fight-content">
            <div class="fight-sprite schlingus"></div>
            <div class="fight-vs">VS</div>
            <div class="fight-sprite bungile"></div>
        </div>
        <div class="fight-options">
            <button class="fight-btn kill">Kill</button>
            <button class="fight-btn spare">Spare</button>
        </div>
        <div class="fight-blood-group"></div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.fight-sprite.schlingus').style.backgroundImage = "url('assets/schlingus.png')";
    overlay.querySelector('.fight-sprite.bungile').style.backgroundImage = "url('assets/bungile.png')";
    const killBtn = overlay.querySelector('.fight-btn.kill');
    const spareBtn = overlay.querySelector('.fight-btn.spare');
    const bloodGroup = overlay.querySelector('.fight-blood-group');
    // Kill button logic
    killBtn.onclick = function() {
        // Disable both buttons
        killBtn.disabled = true;
        spareBtn.disabled = true;
        // Play killing animation: lots of blood splatters
        for (let i = 0; i < 7; i++) {
            const blood = document.createElement('div');
            blood.className = 'fight-blood splatter';
            // Randomize position and size
            const x = 40 + Math.random() * 40; // percent
            const y = 45 + Math.random() * 20;
            const s = 0.7 + Math.random() * 1.2;
            blood.style.left = x + '%';
            blood.style.top = y + '%';
            blood.style.width = (120 + Math.random()*80) + 'px';
            blood.style.height = (40 + Math.random()*60) + 'px';
            blood.style.transform = `translate(-50%, -50%) scale(${s})`;
            bloodGroup.appendChild(blood);
        }
        overlay.querySelector('.fight-sprite.bungile').classList.add('dead');
        setTimeout(() => {
            fadeToBlackAfterBattle('killed');
        }, 1200);
    };
    // Spare button logic
    spareBtn.onclick = function() {
        killBtn.disabled = true;
        spareBtn.disabled = true;
        fadeToBlackAfterBattle('spared');
    };
}

function fadeToBlackAfterBattle(outcome) {
    bungileOutcome = outcome;
    // Remove battle overlay after fade
    let fade = document.createElement('div');
    fade.className = 'fade-black';
    document.body.appendChild(fade);
    setTimeout(() => {
        fade.classList.add('active');
        setTimeout(() => {
            document.querySelectorAll('.fight-overlay').forEach(e => e.remove());
            fade.remove();
            // Hide the map after the battle scene is over
            let container = document.querySelector('.game-canvas-container');
            if (container) container.style.display = 'none';
            // Remove Bungile from map if killed
            if (outcome === 'killed') {
                bungile.x = -1; bungile.y = -1;
            }
            // Show post-battle dialog
            if (outcome === 'killed') {
                playKillDialog();
            } else {
                playSpareDialog();
            }
        }, 900);
    }, 50);
}

function playKillDialog() {
    // Ensure map is hidden before dialog
    let container = document.querySelector('.game-canvas-container');
    if (container) container.style.display = 'none';
    showDialog('schlergus', 'did you do it?', () => {
        showDialog('schlingus', 'yes of course.', () => {
            showDialog('schlergus', 'okay then, see you tomorrow.', () => {
                fadeToBlank();
            });
        });
    });
}

function playSpareDialog() {
    // Ensure map is hidden before dialog
    let container = document.querySelector('.game-canvas-container');
    if (container) container.style.display = 'none';
    showDialog('schlergus', 'how did it go?', () => {
        showDialog('schlingus', 'great.', () => {
            showDialog('schlergus', 'did you kill him?', () => {
                showDialog('schlingus', 'oh uh um yes of course!', () => {
                    fadeToBlank();
                });
            });
        });
    });
}

function fadeToBlank() {
    let fade = document.createElement('div');
    fade.className = 'fade-black';
    document.body.appendChild(fade);
    setTimeout(() => {
        fade.classList.add('active');
        setTimeout(() => {
            fade.remove();
            // Show Day 2 overlay and then start Day 2 minigame (not ending)
            showDay2OverlayAndMinigame();
        }, 1400);
    }, 100);
}

function showDay2OverlayAndMinigame() {
    // Hide overlays
    document.querySelectorAll('.day-overlay, .dialog-overlay, .fight-overlay, .mistrake-minigame').forEach(e => e.remove());
    // Show Day 2 overlay
    const dayOverlay = document.createElement('div');
    dayOverlay.className = 'day-overlay day2-fancy';
    dayOverlay.innerHTML = '<span>Day 2</span>';
    document.body.appendChild(dayOverlay);
    setTimeout(() => {
        dayOverlay.remove();
        // Start the Mistrake minigame (or whatever Day 2 content)
        showMistrakeMinigame();
    }, 2000);
}

// --- MISTRAKE MINIGAME ---
// Show minigame overlay with timing bar to drop chair on Mistrake
function showMistrakeMinigame() {
    // Remove any existing overlays
    document.querySelectorAll('.mistrake-minigame, .fade-black').forEach(e => e.remove());
    const overlay = document.createElement('div');
    overlay.className = 'mistrake-minigame';
    overlay.innerHTML = `
        <div class="mistrake-bg"></div>
        <div class="mistrake-content">
            <div class="mistrake-instructions">Drop the chair on Mistrake!<br><span style='font-size:0.9em'>(Press SPACE or click the button when the bar is in the red zone, or press Spare to let him live)</span></div>
            <div class="timing-bar-container">
                <div class="timing-bar-bg"></div>
                <div class="timing-bar"></div>
                <div class="timing-bar-red"></div>
            </div>
            <div style="display:flex; gap:16px; justify-content:center; margin-top:10px;">
                <button class="timing-drop-btn">Drop Chair</button>
                <button class="timing-spare-btn">Spare</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    const bar = overlay.querySelector('.timing-bar');
    const red = overlay.querySelector('.timing-bar-red');
    const btn = overlay.querySelector('.timing-drop-btn');
    const spareBtn = overlay.querySelector('.timing-spare-btn');
    // Style bar
    const barContainer = overlay.querySelector('.timing-bar-container');
    barContainer.style.position = 'relative';
    barContainer.style.width = '320px';
    barContainer.style.height = '32px';
    barContainer.style.margin = '32px auto 16px auto';
    barContainer.style.background = 'rgba(30,20,10,0.7)';
    barContainer.style.border = '2px solid #a10000';
    barContainer.style.borderRadius = '12px';
    overlay.querySelector('.timing-bar-bg').style.position = 'absolute';
    overlay.querySelector('.timing-bar-bg').style.left = '0';
    overlay.querySelector('.timing-bar-bg').style.top = '0';
    overlay.querySelector('.timing-bar-bg').style.width = '100%';
    overlay.querySelector('.timing-bar-bg').style.height = '100%';
    overlay.querySelector('.timing-bar-bg').style.background = '#222';
    overlay.querySelector('.timing-bar-bg').style.borderRadius = '12px';
    red.style.position = 'absolute';
    red.style.left = '60%';
    red.style.top = '0';
    red.style.width = '20%';
    red.style.height = '100%';
    red.style.background = '#a10000';
    red.style.opacity = '0.7';
    red.style.borderRadius = '12px';
    bar.style.position = 'absolute';
    bar.style.left = '0';
    bar.style.top = '0';
    bar.style.width = '32px';
    bar.style.height = '100%';
    bar.style.background = '#ffe082';
    bar.style.borderRadius = '8px';
    // Animate bar
    let pos = 0;
    let dir = 1;
    let running = true;
    function animateBar() {
        if (!running) return;
        pos += dir * 4;
        if (pos > 288) { pos = 288; dir = -1; }
        if (pos < 0) { pos = 0; dir = 1; }
        bar.style.left = pos + 'px';
        requestAnimationFrame(animateBar);
    }
    animateBar();
    // Drop logic
    function drop() {
        if (!running) return;
        running = false;
        btn.disabled = true;
        spareBtn.disabled = true;
        // Check if bar is in red zone (60%-80%)
        if (pos >= 192 && pos <= 256) {
            // Success: kill Mistrake
            dropChairOnMistrake(overlay, true);
        } else {
            // Miss: spare Mistrake
            dropChairOnMistrake(overlay, false);
        }
    }
    btn.onclick = drop;
    spareBtn.onclick = function() {
        if (!running) return;
        running = false;
        btn.disabled = true;
        spareBtn.disabled = true;
        dropChairOnMistrake(overlay, false);
    };
    window.addEventListener('keydown', function handler(e) {
        if (!running) return;
        if (e.code === 'Space') {
            drop();
            window.removeEventListener('keydown', handler);
        }
    });
}

function dropChairOnMistrake(mini, isKill) {
    // Remove click handlers
    mini.onclick = null;
    mini.querySelector('.timing-spare-btn').disabled = true;
    if (isKill) {
        window.mistrakeOutcome = 'killed';
        const chair = document.createElement('div');
        chair.className = 'falling-chair';
        chair.innerHTML = '🪑';
        mini.appendChild(chair);
        chair.style.left = '50%';
        chair.style.top = '12%';
        setTimeout(() => {
            chair.style.top = '78%';
            chair.style.transform = 'translate(-50%, 0) scale(1.2)';
            setTimeout(() => {
                for (let i = 0; i < 10; i++) {
                    const blood = document.createElement('div');
                    blood.className = 'mistrake-blood';
                    blood.style.left = (48 + Math.random()*4) + '%';
                    blood.style.top = (78 + Math.random()*2) + '%';
                    blood.style.width = (30 + Math.random()*40) + 'px';
                    blood.style.height = (10 + Math.random()*20) + 'px';
                    blood.style.transform = `rotate(${Math.random()*360}deg)`;
                    mini.appendChild(blood);
                }
                setTimeout(() => {
                    mini.remove();
                    playMistrakeKillDialog();
                }, 1200);
            }, 400);
        }, 100);
    } else {
        window.mistrakeOutcome = 'spared';
        setTimeout(() => {
            mini.remove();
            playMistrakeSpareDialog();
        }, 700);
    }
}

function playMistrakeKillDialog() {
    showDialog('schlergus', 'you killed mistrake', () => {
        fadeToBlackToDay3();
    });
}
function playMistrakeSpareDialog() {
    showDialog('schlergus', 'you spared mistrake', () => {
        fadeToBlackToDay3();
    });
}
function fadeToBlackToDay3() {
    let fade = document.createElement('div');
    fade.className = 'fade-black';
    document.body.appendChild(fade);
    setTimeout(() => {
        fade.classList.add('active');
        setTimeout(() => {
            fade.remove();
            showDay3OverlayAndEnding();
        }, 1400);
    }, 100);
}

function showDay3OverlayAndEnding() {
    // Hide all overlays
    document.querySelectorAll('.day-overlay, .dialog-overlay, .controls-overlay, .fight-overlay, .mistrake-minigame').forEach(e => e.remove());
    // Show Day 3 overlay
    const dayOverlay = document.createElement('div');
    dayOverlay.className = 'day-overlay day3-ending';
    dayOverlay.innerHTML = '<span>Day 3</span>';
    document.body.appendChild(dayOverlay);
    setTimeout(() => {
        dayOverlay.remove();
        // Play the correct ending dialog sequence based on outcomes
        handleEnding();
    }, 2000);
}

// --- HANDLING ENDINGS ---
// New function to handle different endings based on player choices
function handleEnding() {
    // Determine outcomes
    // bungileOutcome: 'killed' or 'spared'
    // mistrakeOutcome: 'killed' or 'spared'
    if (bungileOutcome === 'spared' && window.mistrakeOutcome === 'spared') {
        // Merciful ending
        playMercifulEnding();
    } else if (bungileOutcome === 'killed' && window.mistrakeOutcome === 'killed') {
        // Bad ending
        playBadEnding();
    } else {
        // Good ending
        playGoodEnding();
    }
}

function playMercifulEnding() {
    showDialog('schlergus', 'i know your secret', () => {
        showDialog('schlingus', 'huh?', () => {
            showDialog('schlergus', 'i saw bungile dsaeftoday, you let him live', () => {
                showDialog('schlingus', 'yeah, im notf a murderer', () => {
                    showDialog('schlergus', 'and you didnt afewafrun out of things to drop on mistrake', () => {
                        showDialog('schlingus', 'so?', () => {
                            showDialog('schlergus', "well now ive gottafeafef kill you", () => {
                                coverScreenInBlood(() => {
                                    showEndingScreen('merciful ending', 'you tried sparing your friends, but it got you killed instead', true);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function playBadEnding() {
    showDialog('schlergus', 'great job, you killed all of my enemies, except for one. you mus-', () => {
        showDialog('schlingus', 'haha', () => {
            showDialog('schlergus', 'hey whyfafead you stab me, what did i do to you', () => {
                showDialog('schlergus', "you will never finedadfaefdd inf ggsgrds now, i know that was your entire goal", () => {
                    fadeToEndingScreen('bad ending', "you killed your friends just to efsefds");
                });
            });
        });
    });
}

function playGoodEnding() {
    showDialog('schlingus', 'what now', () => {
        showDialog('schlergus', 'nothing', () => {
            showDialog('schlingus', 'then, telgragl me whe-', () => {
                showDialog('schlergus', 'rgrsgsin thrsgblggss                                                       m', () => {
                    showDialog('schlingus', 'ok', () => {
                        fadeToEndingScreen('good ending', "you know where infernus' mom is, but you had to kill one of your friends");
                    });
                });
            });
        });
    });
}
