/**
 * AITITRADE Terminal Controller - V18.0 (Registration & Audio Gateway)
 */
window.QUEEN_BUTTA_VAULT = [
    {n:"SUPERFLY",src:"https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FSUPERFLY.mp3?alt=media&token=e260aa5d-a3c9-453e-8b80-a466a6328906"},
    {n:"ADDICTION",src:"https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FYOU'RE%20MY%20ADDICTION.mp3?alt=media&token=ff95dd55-65a0-44c7-b9f4-9cd7ae2ce12c"},
    {n:"TIMES UP",src:"https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FTIMES%20UP.mp3?alt=media&token=b582fd58-9511-447a-8986-b3dd9f720f2a"},
    {n:"LOVE MAKE OVER",src:"https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FLOVE%20MAKE%20OVER.mp3?alt=media&token=df587b6b-eed4-4f5b-b340-a5b5622efb31"},
    {n:"I'M NOT HER",src:"https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FI'M%20NOT%20HER.mp3?alt=media&token=e3ab1871-4af8-4e42-80e5-0e959a9647a1"},
    {n:"GANSTA CHICK",src:"https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FGANSTA%20CHICK.mp3?alt=media&token=2b1859c4-a43d-4cc3-b121-5e06897ea7af"},
    {n:"FRIDAY NIGHT",src:"https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FIT'S%20FRIDAY%20NIGHT.mp3?alt=media&token=21b85403-a6dd-49d6-9a26-6514ed90eaa1"},
    {n:"HEARTBREAK MOTEL",src:"https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FHEARTBREAK%20MOTEL%20REMIX.mp3?alt=media&token=081a4e22-abb5-4045-a463-0f768dc9fb20"},
    {n:"LET'S GO BACK",src:"https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FLET'S%20GO%20BACK.mp3?alt=media&token=744a2807-2f51-4f4b-bef2-8d79e3e56be6"},
    {n:"I DESERVE",src:"https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FI%20DESERVE.mp3?alt=media&token=0bed5d76-783b-4ea4-9b12-9085d96bbf9c"},
    {n:"GHETTO GIRL",src:"https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FTHAT%20GIRL%20FROM%20THE%20GHETTO.mp3?alt=media&token=a9f526a4-2567-4225-a8c2-dbac509f03de"},
    {n:"MIDNIGHT SMOKE",src:"https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FMIDNIGHT%20SMOKE.mp3?alt=media&token=8ba90c94-61cf-4fce-84bc-6c8a0c6a0105"},
    {n:"BETTER THAN GOOD",src:"https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FBETTER%20THAN%20GOOD%20(1).mp3?alt=media&token=5b6a259d-7c57-4f1e-9c2d-121f9d3ee15a"}
];

const state = {
    player: document.getElementById('player') || new Audio(),
    activeTrackIndex: 0,
    currentMarketPrice: 10.00,
    totalRegisteredBuyers: 0,
    engineStarted: false
};
state.player.preload = "auto";

// 1. ENGINE GATEWAY FUNCTION - UNLOCKS SCREEN AND INITIALIZES AUDIO
function startEngine() {
    if (state.engineStarted) return;
    
    // Capture user fields for tracking reference
    const name = document.getElementById('reseller-name')?.value || "ANONYMOUS TRADER";
    const email = document.getElementById('reseller-email')?.value || "NO EMAIL PROVIDED";
    const cashapp = document.getElementById('reseller-cashapp')?.value || "NO CASH APP PROVIDED";
    
    console.log(`NEW REGISTERED RESELLER: ${name} // ${email} // ${cashapp}`);

    // Prime the audio player to bypass mobile hardware restrictions
    state.player.src = window.QUEEN_BUTTA_VAULT[0].src;
    state.player.load();

    // Drop Welcome Shield and Reveal Live Floor Grid
    document.getElementById('prospectus-overlay').style.display = 'none';
    document.getElementById('main-ui').style.display = 'grid';
    
    state.engineStarted = true;

    // Start Loops
    buildMarketLedgerPlaylist();
    setInterval(marketOscillatorLoop, 1100);
    
    // Automatically boot up song #1 on entry click gesture handshake
    syncTrack(0);
}

// 2. PLAYLIST BUILDER
function buildMarketLedgerPlaylist() {
    const listTarget = document.getElementById('list-target');
    if (!listTarget) return;
    
    listTarget.innerHTML = "";
    window.QUEEN_BUTTA_VAULT.forEach((track, idx) => {
        listTarget.innerHTML += `
            <div class="p-2 border-b border-zinc-800 flex justify-between items-center group cursor-pointer hover:bg-emerald-500/5" onclick="syncTrack(${idx})">
                <span class="text-zinc-400 group-hover:text-white">${idx + 1}. ${track.n}</span>
                <span id="list-btn-${idx}" class="text-emerald-500 font-bold tracking-wider">[PLAY]</span>
            </div>`;
    });
}

// 3. SYNCHRONIZE TRACK CHANGES WITH REAL-TIME ACTIONS
function syncTrack(i) {
    state.activeTrackIndex = i;
    const track = window.QUEEN_BUTTA_VAULT[i];
    
    document.getElementById('radio-track').innerText = track.n;
    state.player.src = track.src;

    // Reset list button text displays
    window.QUEEN_BUTTA_VAULT.forEach((_, idx) => {
        const btn = document.getElementById(`list-btn-${idx}`);
        if (btn) btn.innerText = "[PLAY]";
    });

    state.player.play()
        .then(() => {
            document.getElementById('p-btn').innerText = "⏸";
            const currentBtn = document.getElementById(`list-btn-${i}`);
            if (currentBtn) currentBtn.innerText = "[PLAYING]";
            
            // Log buyer transaction to terminal feed on click interaction
            registerRealtimeBuyerTransaction();
        })
        .catch(err => {
            console.log("Audio pipeline pending validation: ", err);
            document.getElementById('p-btn').innerText = "▶";
        });
}

// 4. PLAYER CONTROL UTILITIES
function toggleAudio() {
    if (state.player.paused) {
        state.player.play();
        document.getElementById('p-btn').innerText = "⏸";
    } else {
        state.player.pause();
        document.getElementById('p-btn').innerText = "▶";
    }
}
function nextTrack() {
    let next = (state.activeTrackIndex + 1) % window.QUEEN_BUTTA_VAULT.length;
    syncTrack(next);
}
function prevTrack() {
    let prev = (state.activeTrackIndex - 1 + window.QUEEN_BUTTA_VAULT.length) % window.QUEEN_BUTTA_VAULT.length;
    syncTrack(prev);
}

// Wire standard audio loop triggers
state.player.onended = () => { nextTrack(); };

// 5. HARDCODED MARKET OSCILLATOR ENGINE ($10 BASE - $80 NET - $130 CEILING)
function marketOscillatorLoop() {
    const displayOsc = document.getElementById('main-osc');
    const displayArrow = document.getElementById('price-arrow');
    if (!displayOsc) return;

    const upDir = Math.random() > 0.47 ? 1 : -1;
    const shiftVal = (Math.random() * 7.80) + 1.10;

    if (upDir === 1) {
        state.currentMarketPrice = Math.min(130.00, state.currentMarketPrice + shiftVal);
    } else {
        state.currentMarketPrice = Math.max(10.00, state.currentMarketPrice - shiftVal);
    }

    // Dynamic warning color indicators
    if (state.currentMarketPrice >= 80.00 && state.currentMarketPrice < 115.00) {
        displayOsc.style.color = "#ffcc00"; // Gold Warning Zone
    } else if (state.currentMarketPrice >= 115.00) {
        displayOsc.style.color = "#00ff00"; // Gross Threshold Max
    } else {
        displayOsc.style.color = "#fff";
    }

    displayOsc.innerText = `$${state.currentMarketPrice.toFixed(2)}`;
    
    if (displayArrow) {
        displayArrow.innerText = `${upDir === 1 ? "▲ +" : "▼ -"}${shiftVal.toFixed(2)}`;
        displayArrow.style.color = upDir === 1 ? "#00ff00" : "#ff3333";
    }

    // Kinetic Candle Generator
    const layer = document.getElementById('candle-layer');
    if (layer) {
        const candle = document.createElement('div');
        candle.className = "candle";
        candle.style.height = (shiftVal * 15 + 10) + "px";
        candle.style.background = upDir === 1 ? "#0f0" : "#f00";
        candle.innerHTML = `<div class='wick' style='background:${upDir === 1 ? "#0f0" : "#f00"}'></div>`;
        layer.appendChild(candle);
        if (layer.children.length > 24) layer.removeChild(layer.firstChild);
    }
}

// 6. REAL-TIME LABELED DATA BUFFER LOGS
function registerRealtimeBuyerTransaction() {
    state.totalRegisteredBuyers++;
    const logBuffer = document.getElementById('terminal-log-buffer');
    if (!logBuffer) return;

    const stamp = new Date().toLocaleTimeString();
    const generatedUnits = (Math.random() * 3.5000 + 1.0000).toFixed(4);
    
    // Enforcing label parameters based on registered buyer index count
    let label = state.totalRegisteredBuyers <= 5 ? "BUY MARKET DIRECT" : "BUY RESELLER DIRECT";

    const entry = document.createElement('div');
    entry.className = "flow-entry font-mono text-[10px] border-b border-zinc-900 py-1";
    entry.style.color = "#00ff00";
    entry.innerHTML = `<span>[${stamp}] BUYER #${String(state.totalRegisteredBuyers).padStart(2, '0')} EXECUTED</span> <span>${generatedUnits} SHARES @ $${state.currentMarketPrice.toFixed(2)} [${label}]</span>`;
    
    logBuffer.prepend(entry);
    if (logBuffer.children.length > 8) logBuffer.removeChild(logBuffer.lastChild);
}

// Global script handle mapping
window.startEngine = startEngine;
window.toggleAudio = toggleAudio;
window.nextTrack = nextTrack;
window.prevTrack = prevTrack;
