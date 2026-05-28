/** * AITITRADE Terminal Controller - V16.0 (Mobile Audio Fix)
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

// Single global native audio layer
const nativePlayer = new Audio();
nativePlayer.preload = "auto";
let currentTrackIndex = null;

// Track list container template builder
const cont = document.getElementById('terminal-track-matrix-container');
if (cont) {
    let html = '';
    window.QUEEN_BUTTA_VAULT.forEach((track, i) => {
        html += `
            <div class="flex justify-between items-center border-b border-emerald-500/10 py-1.5 px-1">
                <span class="text-xs font-mono text-emerald-400">${i + 1}. ${track.n}</span>
                <button class="terminal-play-btn text-emerald-400 border border-emerald-400/30 px-2 rounded text-[9px] font-bold cursor-pointer" data-i="${i}">PLAY</button>
            </div>`;
    });
    cont.innerHTML = html;

    // Direct Physical User Tap Route
    cont.addEventListener('click', e => {
        if (e.target.classList.contains('terminal-play-btn')) {
            const selectedIndex = parseInt(e.target.dataset.i);
            executePlayback(selectedIndex);
        }
    });
}

function executePlayback(i) {
    const totalButtons = document.querySelectorAll('.terminal-play-btn');
    const targetButton = document.querySelector(`[data-i="${i}"]`);

    // If tapping the exact same song that's already loaded
    if (currentTrackIndex === i) {
        if (!nativePlayer.paused) {
            nativePlayer.pause();
            if (targetButton) targetButton.innerText = "PLAY";
        } else {
            nativePlayer.play().catch(err => console.log("Playback engine stalled: ", err));
            if (targetButton) targetButton.innerText = "PAUSE";
        }
        return;
    }

    // Reset all other button strings back to default state
    totalButtons.forEach(b => b.innerText = "PLAY");

    // Load new song source track directly down the hardware pipeline
    currentTrackIndex = i;
    nativePlayer.src = window.QUEEN_BUTTA_VAULT[i].src;
    
    // Explicit play invocation tied immediately to the tap click block
    nativePlayer.play()
        .then(() => {
            if (targetButton) targetButton.innerText = "PAUSE";
        })
        .catch(err => {
            alert("Tap the track directly to enable audio pipeline.");
            console.log("Hardware flag blocking auto-stream: ", err);
        });
}

// Global automated track continuous looping logic 
nativePlayer.onended = () => {
    let nextIndex = (currentTrackIndex + 1) % window.QUEEN_BUTTA_VAULT.length;
    executePlayback(nextIndex);
};

// Continuous Market Value Feed Calculations Loop
setInterval(() => {
    const o = document.getElementById('main-osc');
    if (o) o.innerText = "$" + (10 + Math.random() * 5).toFixed(2);
}, 850);
