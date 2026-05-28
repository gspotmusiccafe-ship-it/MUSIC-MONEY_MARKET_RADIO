/**
 * AITITRADE Bloomberg Multi-Portal Engine - V21.0 (Password Matrix Integrated)
 */

const QUEEN_BUTTA_VAULT = [
    { n: "SUPERFLY", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FSUPERFLY.mp3?alt=media&token=e260aa5d-a3c9-453e-8b80-a466a6328906" },
    { n: "ADDICTION", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FYOU'RE%20MY%20ADDICTION.mp3?alt=media&token=ff95dd55-65a0-44c7-b9f4-9cd7ae2ce12c" },
    { n: "TIMES UP", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FTIMES%20UP.mp3?alt=media&token=b582fd58-9511-447a-8986-b3dd9f720f2a" },
    { n: "LOVE MAKE OVER", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FLOVE%20MAKE%20OVER.mp3?alt=media&token=df587b6b-eed4-4f5b-b340-a5b5622efb31" },
    { n: "I'M NOT HER", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FI'M%20NOT%20HER.mp3?alt=media&token=e3ab1871-4af8-4e42-80e5-0e959a9647a1" },
    { n: "GANSTA CHICK", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FGANSTA%20CHICK.mp3?alt=media&token=2b1859c4-a43d-4cc3-b121-5e06897ea7af" },
    { n: "FRIDAY NIGHT", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FIT'S%20FRIDAY%20NIGHT.mp3?alt=media&token=21b85403-a6dd-49d6-9a26-6514ed90eaa1" },
    { n: "HEARTBREAK MOTEL", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FHEARTBREAK%20MOTEL%20REMIX.mp3?alt=media&token=081a4e22-abb5-4045-a463-0f768dc9fb20" },
    { n: "LET'S GO BACK", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FLET'S%20GO%20BACK.mp3?alt=media&token=744a2807-2f51-4f4b-bef2-8d79e3e56be6" },
    { n: "I DESERVE", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FI%20DESERVE.mp3?alt=media&token=0bed5d76-783b-4ea4-9b12-9085d96bbf9c" },
    { n: "GHETTO GIRL", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FTHAT%20GIRL%20FROM%20THE%20GHETTO.mp3?alt=media&token=a9f526a4-2567-4225-a8c2-dbac509f03de" },
    { n: "MIDNIGHT SMOKE", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FMIDNIGHT%20SMOKE.mp3?alt=media&token=8ba90c94-61cf-4fce-84bc-6c8a0c6a0105" },
    { n: "BETTER THAN GOOD", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FBETTER%20THAN%20GOOD%20(1).mp3?alt=media&token=5b6a259d-7c57-4f1e-9c2d-121f9d3ee15a" }
];

const GANSTA_SMOOTH_VAULT = [
    { n: "A GANGSTA'S LIFE", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/GANSTA%20SMOOTH%2FA%20Gangsta's%20Life.mp3?alt=media&token=e7f31106-ec8e-4dee-bb5e-b29a75677d29" },
    { n: "CRUISIN IN MY 4 DOOR", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/GANSTA%20SMOOTH%2FCruisin%20In%20My%204%20Door.mp3?alt=media&token=81988b80-9dbd-4f4e-a216-e6034e4ee2b7" },
    { n: "DIAMOND IN THE BACK", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/GANSTA%20SMOOTH%2FDiamond%20In%20The%20Back.mp3?alt=media&token=9a89f42e-f639-467a-a55c-ee636f7d83fa" },
    { n: "GET IT HOW I LIVE IT", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/GANSTA%20SMOOTH%2FGet%20It%20How%20I%20Live%20It.mp3?alt=media&token=d2b2335d-057b-48a2-ad74-eea9ff2466dd" },
    { n: "NAWFSIDE BOSS", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/GANSTA%20SMOOTH%2FNawfside%20Boss.mp3?alt=media&token=95153419-d27d-42bb-ad45-b7ea26da1029" },
    { n: "PARLAY GANGSTA", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/GANSTA%20SMOOTH%2FPARLAY%20GANGSTA.mp3?alt=media&token=a7465a9e-b2c0-4ced-a91b-8e0a565e0ed6" },
    { n: "PURPLE CITY", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/GANSTA%20SMOOTH%2FPurple%20City.mp3?alt=media&token=67f6fb69-0616-46c3-b8d2-d7f95009d393" },
    { n: "RIDE AND CHILL", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/GANSTA%20SMOOTH%2FRide%20and%20Chill.mp3?alt=media&token=45967fab-d5b7-42c5-b0ce-f9191ca1410e" },
    { n: "THE GHETTO", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/GANSTA%20SMOOTH%2FThe%20Ghetto.mp3?alt=media&token=a45e5ca6-83af-4eb6-80a2-d1273b480c85" },
    { n: "WHAT YOU GON DO", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/GANSTA%20SMOOTH%2FWhat%20You%20Gon%20Do.mp3?alt=media&token=fa39af84-5508-4e97-a9fd-6fe3dad541d5" },
    { n: "YOU DON'T KNOW", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/GANSTA%20SMOOTH%2FYou%20Don't%20Know.mp3?alt=media&token=3c10ef1c-d872-4f08-b801-bdf89789ad6a" },
    { n: "MS. MARY JANE", src: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/GANSTA%20SMOOTH%2FMs.%20Mary%20Jane.mp3?alt=media&token=9bb1cd28-5cfb-4587-8207-aedb89010d9d" }
];

const config = {
    0: { name: "QUEEN BUTTA", art: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FQUEEN%20BUTTA%20PNG.jpeg?alt=media&token=57a0801b-1e48-41f6-9f93-b72964881982", buyIn: 10.00, sellOut: 80.00, maxGross: 130.00, vault: QUEEN_BUTTA_VAULT },
    1: { name: "GANSTA SMOOTH", art: "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/GANSTA%20SMOOTH%2FGANSTA%20LYFE%20IMAGE.jpeg?alt=media&token=bd8fadb8-8133-4177-8ca5-4d72a70cd081", buyIn: 20.00, sellOut: 160.00, maxGross: 260.00, vault: GANSTA_SMOOTH_VAULT }
};

let state = {
    currentPortal: 0,
    player: new Audio(),
    activeTrackIndex: null,
    currentMarketPrice: 10.00,
    totalRegisteredBuyers: 0,
    engineStarted: false
};
state.player.preload = "auto";

function populateTrackMatrixUI() {
    const container = document.getElementById('terminal-track-matrix-container');
    if (!container) return;
    let html = "";
    const currentVault = config[state.currentPortal].vault;
    currentVault.forEach((track, idx) => {
        html += `
            <div class="flex justify-between items-center border-b border-emerald-500/10 py-2 px-1 hover:bg-emerald-500/5 transition-all duration-150">
                <span class="font-mono text-emerald-400/80">${idx + 1}. ${track.n}</span>
                <button class="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded hover:bg-emerald-500 hover:text-black transition-all cursor-pointer" id="play-btn-${idx}" onclick="playT(${idx})"> PLAY </button>
            </div>`;
    });
    container.innerHTML = html;
}

window.switchPortal = function(portalId) {
    if (!config[portalId]) return;
    document.getElementById('p-0').className = "portal-btn border border-white/5 bg-white/5 p-2 text-center rounded-lg hover:bg-white/10 transition-all group cursor-pointer";
    document.getElementById('p-1').className = "portal-btn border border-white/5 bg-white/5 p-2 text-center rounded-lg hover:bg-white/10 transition-all group cursor-pointer";
    document.getElementById(`p-${portalId}`).className = "portal-btn active border p-2 text-center rounded-lg text-emerald-400 font-bold font-mono";
    state.currentPortal = portalId;
    const currentConf = config[portalId];
    document.getElementById('album-cover-img').src = currentConf.art;
    document.getElementById('display-active-album-name').innerText = currentConf.name;
    document.getElementById('asset-label-header').innerText = `${currentConf.name} ASSET TRACKER`;
    document.getElementById('buy-label-header').innerText = `INVEST IN ${currentConf.name}: $${currentConf.buyIn}`;
    const buyButton = document.getElementById('btn-song-buy');
    if (buyButton) buyButton.innerText = `💰 BUY ASSET NOW ($${currentConf.buyIn})`;
    state.currentMarketPrice = currentConf.buyIn;
    state.activeTrackIndex = null;
    populateTrackMatrixUI();
    if (state.engineStarted) { playT(0); }
};

window.playT = function(i) {
    const currentVault = config[state.currentPortal].vault;
    const targetBtn = document.getElementById(`play-btn-${i}`);
    if (state.activeTrackIndex === i) {
        if (!state.player.paused) { state.player.pause(); if (targetBtn) targetBtn.innerText = "PLAY"; }
        else { state.player.play().catch(() => {}); if (targetBtn) targetBtn.innerText = "PAUSE"; }
        return;
    }
    currentVault.forEach((_, idx) => { const btn = document.getElementById(`play-btn-${idx}`); if (btn) btn.innerText = "PLAY"; });
    state.activeTrackIndex = i;
    state.player.src = currentVault[i].src;
    state.player.play()
        .then(() => {
            if (targetBtn) targetBtn.innerText = "PAUSE";
            document.getElementById('display-active-album-name').innerText = `${config[state.currentPortal].name} // ${currentVault[i].n}`;
            logRealtimeBuyerTransaction();
        })
        .catch(err => console.log("Audio lockout holding context."));
};

state.player.onended = () => {
    const currentVault = config[state.currentPortal].vault;
    let nextIndex = (state.activeTrackIndex + 1) % currentVault.length;
    window.playT(nextIndex);
};

function executeMarketOscillator() {
    const mainOsc = document.getElementById('main-osc');
    const priceArrow = document.getElementById('price-arrow');
    if (!mainOsc) return;
    const currentConf = config[state.currentPortal];
    const driftDir = Math.random() > 0.47 ? 1 : -1;
    const priceShift = (Math.random() * (currentConf.buyIn * 0.8)) + 1.10;
    if (driftDir === 1) { state.currentMarketPrice = Math.min(currentConf.maxGross, state.currentMarketPrice + priceShift); }
    else { state.currentMarketPrice = Math.max(currentConf.buyIn, state.currentMarketPrice - priceShift); }
    if (state.currentMarketPrice >= currentConf.sellOut && state.currentMarketPrice < (currentConf.maxGross * 0.85)) { mainOsc.style.color = "#fbbf24"; }
    else if (state.currentMarketPrice >= (currentConf.maxGross * 0.85)) { mainOsc.style.color = "#34d399"; }
    else { mainOsc.style.color = "#10b981"; }
    mainOsc.innerText = `$${state.currentMarketPrice.toFixed(2)}`;
    if (priceArrow) {
        priceArrow.innerText = `KINETIC SHIFT // ${driftDir === 1 ? "▲ +" : "▼ -"}${priceShift.toFixed(2)}`;
        priceArrow.className = `text-[9px] font-mono uppercase tracking-widest mt-1 font-bold ${driftDir === 1 ? 'text-emerald-400' : 'text-red-500'}`;
    }
}

// SECURE REGISTRATION ENGINE GATEWAY WITH PASSWORD CHECK
window.startEngine = function() {
    if (state.engineStarted) return;
    
    // 1. Verify access password entry
    const password = document.getElementById('reseller-password')?.value || "";
    const errorDisplay = document.getElementById('password-error');
    
    if (password !== "AITITRADE2026") {
        if (errorDisplay) errorDisplay.classList.remove('hidden');
        return;
    }
    if (errorDisplay) errorDisplay.classList.add('hidden');

    // 2. Extract input text values
    const name = document.getElementById('reseller-name')?.value || "ANONYMOUS TRADER";
    const email = document.getElementById('reseller-email')?.value || "NO EMAIL PROVIDED";
    const cashapp = document.getElementById('reseller-cashapp')?.value || "NO CASH APP PROVIDED";

    // 3. Connect API URL ledger payload
    const LEDGER_API_URL = "https://script.google.com/macros/s/AKfycbw855ZFuquA_x3WjEwbySOnTlRavUuhcOtZeQFYNcJbWw36-hw6uejIj4iJDqbqe7uu/exec";
    
    fetch(`${LEDGER_API_URL}?action=register&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&cashapp=${encodeURIComponent(cashapp)}`, { mode: 'no-cors' })
        .catch(err => console.log("Logging exception handled: ", err));

    // 4. Prime the audio track pipelines
    const currentVault = config[state.currentPortal].vault;
    state.player.src = currentVault[0].src;
    state.player.load();

    // 5. Tear down greeting veil to render Bloomberg grid chassis
    const overlay = document.getElementById('prospectus-overlay');
    if (overlay) { overlay.style.setProperty('display', 'none', 'important'); }
    state.engineStarted = true;

    populateTrackMatrixUI();
    setInterval(executeMarketOscillator, 1100);
    window.playT(0);
};

function logRealtimeBuyerTransaction() {
    state.totalRegisteredBuyers++;
    const nodeTarget = document.getElementById('router-target');
    const nodeCount = document.getElementById('router-count');
    const matrixVis = document.getElementById('matrix-visualizer');
    const currentCount = state.totalRegisteredBuyers % 5;
    let strategyLabel = state.totalRegisteredBuyers <= 5 ? "BUY MARKET DIRECT" : "BUY RESELLER DIRECT";
    if (nodeTarget) nodeTarget.innerText = `BUYER #${String(state.totalRegisteredBuyers).padStart(2, '0')} EXECUTED`;
    if (nodeCount) nodeCount.innerText = `${currentCount} / 5 MATRIX POSITION`;
    if (matrixVis) matrixVis.innerText = `CURRENT SYSTEM ROUTING PROTOCOL: [${strategyLabel}]`;
}

document.addEventListener("DOMContentLoaded", () => {
    populateTrackMatrixUI();
});
