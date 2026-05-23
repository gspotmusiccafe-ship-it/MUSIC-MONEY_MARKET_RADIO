/**
 * AITITRADE Terminal Controller - V6.1 (Event Delegate Build)
 * Logic: Uses Event Delegation to bypass click-blocking.
 */

window.QUEEN_BUTTA_VAULT = [
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

const state = { player: new Audio(), ctx: null, activeIdx: null };

function playTrack(btn) {
    if (!state.ctx) {
        state.ctx = new (window.AudioContext || window.webkitAudioContext)();
        const source = state.ctx.createMediaElementSource(state.player);
        const bass = state.ctx.createBiquadFilter();
        bass.type = "peaking"; bass.frequency.value = 80; bass.gain.value = 10;
        const treble = state.ctx.createBiquadFilter();
        treble.type = "highshelf"; treble.frequency.value = 6500; treble.gain.value = 5;
        source.connect(bass).connect(treble).connect(state.ctx.destination);
    }
    state.ctx.resume();

    if (state.activeIdx === btn.dataset.idx && !state.player.paused) {
        state.player.pause();
        btn.innerText = "PLAY";
    } else {
        state.activeIdx = btn.dataset.idx;
        state.player.src = btn.dataset.src;
        state.player.play();
        document.querySelectorAll('.terminal-play-btn').forEach(b => b.innerText = "PLAY");
        btn.innerText = "PAUSE";
    }
}

const container = document.getElementById('terminal-track-matrix-container');
if (container) {
    container.innerHTML = window.QUEEN_BUTTA_VAULT.map((t, i) => `
        <div class="flex justify-between items-center border-b border-emerald-500/10 py-1.5 px-1">
            <span class="text-xs font-mono text-emerald-400">${i+1}. ${t.n}</span>
            <button class="terminal-play-btn text-emerald-400 border border-emerald-400/30 px-2 rounded text-[9px] font-bold" 
                    data-src="${t.src}" data-idx="${i}">PLAY</button>
        </div>
    `).join('');

    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('terminal-play-btn')) playTrack(e.target);
    });
}

setInterval(() => {
    const osc = document.getElementById('main-osc');
    if (osc) osc.innerText = "$" + (10 + Math.random() * 5).toFixed(2);
}, 850);
