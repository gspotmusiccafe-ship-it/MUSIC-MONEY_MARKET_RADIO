/**
 * AITITRADE Bloomberg Core Engine - V19.0 (Unified Real-Time Sync)
 */
let state = {
    player: new Audio(),
    activeTrackIndex: null,
    currentMarketPrice: 10.00,
    totalRegisteredBuyers: 0,
    engineStarted: false
};
state.player.preload = "auto";

// 1. DYNAMIC DATA LEDGER GENERATOR
function populateTrackMatrixUI() {
    const container = document.getElementById('terminal-track-matrix-container');
    if (!container) return;
    
    let html = "";
    window.QUEEN_BUTTA_VAULT.forEach((track, idx) => {
        html += `
            <div class="flex justify-between items-center border-b border-emerald-500/10 py-2 px-1 hover:bg-emerald-500/5 transition-all duration-150">
                <span class="font-mono text-emerald-400/80">${idx + 1}. ${track.n}</span>
                <button class="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded hover:bg-emerald-500 hover:text-black transition-all cursor-pointer" id="play-btn-${idx}" onclick="playT(${idx})">
                    PLAY
                </button>
            </div>`;
    });
    container.innerHTML = html;
}

// 2. AUDIO HANDSHAKE WITH REAL-TIME BUFFER TRIGGER
function playT(i) {
    const targetBtn = document.getElementById(`play-btn-${i}`);
    
    if (state.activeTrackIndex === i) {
        if (!state.player.paused) {
            state.player.pause();
            if (targetBtn) targetBtn.innerText = "PLAY";
        } else {
            state.player.play().catch(() => {});
            if (targetBtn) targetBtn.innerText = "PAUSE";
        }
        return;
    }

    // Reset button labels across the matrix frame
    window.QUEEN_BUTTA_VAULT.forEach((_, idx) => {
        const btn = document.getElementById(`play-btn-${idx}`);
        if (btn) btn.innerText = "PLAY";
    });

    state.activeTrackIndex = i;
    state.player.src = window.QUEEN_BUTTA_VAULT[i].src;
    
    state.player.play()
        .then(() => {
            if (targetBtn) targetBtn.innerText = "PAUSE";
            const currentTitle = document.getElementById('display-active-album-name');
            if (currentTitle) currentTitle.innerText = `NOW STREAMING // ${window.QUEEN_BUTTA_VAULT[i].n}`;
            
            // Fire the transaction tracker on direct engagement
            logRealtimeBuyerTransaction();
        })
        .catch(err => console.log("Audio block context waiting on hardware touch."));
}

// Global player continuous playback routing
state.player.onended = () => {
    let nextIndex = (state.activeTrackIndex + 1) % window.QUEEN_BUTTA_VAULT.length;
    playT(nextIndex);
};

// 3. HARDCODED KINETIC OSCILLATOR LOOP ($10 BASE - $80 NET - $130 CEILING)
function executeMarketOscillator() {
    const mainOsc = document.getElementById('main-osc');
    const priceArrow = document.getElementById('price-arrow');
    if (!mainOsc) return;

    const driftDir = Math.random() > 0.47 ? 1 : -1;
    const priceShift = (Math.random() * 8.20) + 1.10;

    if (driftDir === 1) {
        state.currentMarketPrice = Math.min(130.00, state.currentMarketPrice + priceShift);
    } else {
        state.currentMarketPrice = Math.max(10.00, state.currentMarketPrice - priceShift);
    }

    // Bloomberg Theme Color Warning Flags
    if (state.currentMarketPrice >= 80.00 && state.currentMarketPrice < 115.00) {
        mainOsc.style.color = "#fbbf24"; // Gold Target Zone Warning
    } else if (state.currentMarketPrice >= 115.00) {
        mainOsc.style.color = "#34d399"; // Gross Saturation Alert
    } else {
        mainOsc.style.color = "#10b981"; // Clean Terminal Green
    }

    mainOsc.innerText = `$${state.currentMarketPrice.toFixed(2)}`;
    
    if (priceArrow) {
        priceArrow.innerText = `KINETIC SHIFT // ${driftDir === 1 ? "▲ +" : "▼ -"}${priceShift.toFixed(2)}`;
        priceArrow.className = `text-[9px] font-mono uppercase tracking-widest mt-1 font-bold ${driftDir === 1 ? 'text-emerald-400' : 'text-red-500'}`;
    }
}

// 4. TRANSACTION LABELER MATRIX
function logRealtimeBuyerTransaction() {
    state.totalRegisteredBuyers++;
    
    const nodeTarget = document.getElementById('router-target');
    const nodeCount = document.getElementById('router-count');
    const matrixVis = document.getElementById('matrix-visualizer');
    
    const currentCount = state.totalRegisteredBuyers % 5;
    let strategyLabel = state.totalRegisteredBuyers <= 5 ? "BUY MARKET DIRECT" : "BUY RESELLER DIRECT";

    // Direct stream logging straight into your Bloomberg list fields
    if (nodeTarget) nodeTarget.innerText = `BUYER #${String(state.totalRegisteredBuyers).padStart(2, '0')} EXECUTED`;
    if (nodeCount) nodeCount.innerText = `${currentCount} / 5 MATRIX POSITION`;
    if (matrixVis) matrixVis.innerText = `CURRENT SYSTEM ROUTING PROTOCOL: [${strategyLabel}]`;
}

// 5. EXTERNAL INITIALIZATION COUPLING LINK
window.initTerminalAudioBridge = function() {
    state.engineStarted = true;
    populateTrackMatrixUI();
    setInterval(executeMarketOscillator, 1100);
    playT(0); // Auto-spin Track #1 upon confirmed entry click
};

// Initialize visual structure on background canvas boot
document.addEventListener("DOMContentLoaded", () => {
    populateTrackMatrixUI();
});
