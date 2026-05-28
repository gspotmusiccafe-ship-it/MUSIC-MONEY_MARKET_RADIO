/** * AITITRADE Terminal Controller - V17.0 (Real-Time Tracking & Audio Sync)
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

// Core Hardware State Variables
const state = {
    player: new Audio(),
    activeTrackIndex: null,
    currentMarketPrice: 10.00,
    totalRegisteredBuyers: 0
};
state.player.preload = "auto";

// 1. RE-ESTABLISH HTML CLICK HANDSHAKE FOR PHONE PLAY/PAUSE BUTTONS
function playT(i) {
    const targetBtn = document.querySelector(`[data-i="${i}"]`);
    
    // If user is toggling the song that's already running
    if (state.activeTrackIndex === i) {
        if (!state.player.paused) {
            state.player.pause();
            if (targetBtn) targetBtn.innerText = "PLAY";
        } else {
            state.player.play().catch(e => console.log("Stream pending physical tap context."));
            if (targetBtn) targetBtn.innerText = "PAUSE";
        }
        return;
    }

    // Reset layout elements
    document.querySelectorAll('.terminal-play-btn').forEach(b => b.innerText = "PLAY");

    // Route assets cleanly down the pipeline
    state.activeTrackIndex = i;
    state.player.src = window.QUEEN_BUTTA_VAULT[i].src;
    
    state.player.play()
        .then(() => {
            if (targetBtn) targetBtn.innerText = "PAUSE";
            // Increment the ledger tracking sequence as soon as a user clicks to listen/engage
            registerRealtimeBuyerTransaction();
        })
        .catch(err => {
            console.log("Audio stream blocked by mobile hardware flag: ", err);
        });
}

// Global Automated Continuation Circuit
state.player.onended = () => {
    let nextIndex = (state.activeTrackIndex + 1) % window.QUEEN_BUTTA_VAULT.length;
    playT(nextIndex);
};

// 2. HARDCODED KINETIC OSCILLATOR LOGIC ($10 - $80 NET - $130 GROSS MAX)
setInterval(() => {
    const displayOsc = document.getElementById('main-osc');
    if (!displayOsc) return;

    const driftDirection = Math.random() > 0.48 ? 1 : -1;
    // Volatility calculation mechanics
    const swingVariance = (Math.random() * 8.50) + 1.20;

    if (driftDirection === 1) {
        // Upper bound handles gross trading valuation ceiling up to $130
        state.currentMarketPrice = Math.min(130.00, state.currentMarketPrice + swingVariance);
    } else {
        // Lower bound safely locks value to the initial base buy-in floor of $10
        state.currentMarketPrice = Math.max(10.00, state.currentMarketPrice - swingVariance);
    }

    // Dynamic Net Range Highlight Indicator ($80 evaluation zone flag)
    if (state.currentMarketPrice >= 80.00 && state.currentMarketPrice < 110.00) {
        displayOsc.style.color = "#ffcc00"; // Gold highlights warning net processing
    } else if (state.currentMarketPrice >= 110.00) {
        displayOsc.style.color = "#00ff00"; // Bright neon green denotes gross saturation
    } else {
        displayOsc.style.color = ""; // Standard system matrix color rule
    }

    displayOsc.innerText = `$${state.currentMarketPrice.toFixed(2)}`;
}, 950);

// 3. REAL-TIME BUYER SEEDING DATA FEED TRACKER
function registerRealtimeBuyerTransaction() {
    state.totalRegisteredBuyers++;
    
    const bufferStream = document.getElementById('terminal-log-buffer');
    if (!bufferStream) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const mockUnits = (Math.random() * 4.0000 + 1.0000).toFixed(4);
    
    // Format entry strings to slide into layout rows
    let allocationMode = state.totalRegisteredBuyers <= 5 ? "POOL SEED DISTRIBUTION" : "DIRECT SELLER NETTING TEAM";
    
    const ledgerEntryHTML = `
        <div class="text-[10px] font-mono border-b border-emerald-500/5 py-1 flex justify-between uppercase" style="color: #00ff00;">
            <span>[${timestamp}] BUYER #${String(state.totalRegisteredBuyers).padStart(2, '0')} EXECUTED</span>
            <span>${mockUnits} SHARES @ $${state.currentMarketPrice.toFixed(2)} [${allocationMode}]</span>
        </div>
    `;
    
    bufferStream.innerHTML = ledgerEntryHTML + bufferStream.innerHTML;
}

// Setup template placeholders right away at deployment boot execution
const structuralContainer = document.getElementById('terminal-track-matrix-container');
if (structuralContainer) {
    let outputHTML = '';
    window.QUEEN_BUTTA_VAULT.forEach((track, idx) => {
        outputHTML += `
            <div class="flex justify-between items-center border-b border-emerald-500/10 py-1.5 px-1">
                <span class="text-xs font-mono text-emerald-400">${idx + 1}. ${track.n}</span>
                <button class="terminal-play-btn text-emerald-400 border border-emerald-400/30 px-2 rounded text-[9px] font-bold cursor-pointer" data-i="${idx}" onclick="playT(${idx})">PLAY</button>
            </div>`;
    });
    structuralContainer.innerHTML = outputHTML;
}
