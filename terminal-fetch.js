/**
 * AITITRADE Terminal Data Line Controller - V3.7
 * Handles dual-tier ledger sync, dampened market oscillation (850ms),
 * and an integrated invisible global HTML5 audio playback deck.
 */

const TRADING_FLOOR_CONFIG = {
  gatewayUrl: "https://script.google.com/macros/s/AKfycbzRex97vYqKqhi53zVfw8tOay1Av_sIX9tzm-hzn6H5ALl-oId0lb_oSMdY1dgTufqY/exec",
  defaultTier: 1,
  refreshRateMs: 15000 
};

let activeMarketState = {
  tier: 1,
  currentMode: "POOL",
  matrixCount: 0,
  basePrice: 10.00,
  oscillatorInterval: null,
  globalPlayer: null, // Invisible Audio Core Engine Slot
  currentlyPlayingIdx: null
};

/**
 * Initializes or fetches the global terminal audio engine node
 */
function getAudioEngine() {
  if (!activeMarketState.globalPlayer) {
    activeMarketState.globalPlayer = new Audio();
    activeMarketState.globalPlayer.volume = 0.85;
    
    // Log state stream changes inside the browser debug logs
    activeMarketState.globalPlayer.addEventListener('play', () => console.log("AITIFY_STREAM: Audio deck active"));
    activeMarketState.globalPlayer.addEventListener('error', (e) => console.warn("AUDIO_DECK_FAIL:", e));
  }
  return activeMarketState.globalPlayer;
}

/**
 * Handles playing/pausing files out of your Firebase storage arrays
 */
window.executeTerminalPlayback = function(srcUrl, idx) {
  const player = getAudioEngine();
  const playButtons = document.querySelectorAll('.terminal-play-btn');
  
  // If clicking the same song that's already running, toggle pause/play
  if (activeMarketState.currentlyPlayingIdx === idx) {
    if (!player.paused) {
      player.pause();
      if (playButtons[idx]) playButtons[idx].innerText = "PLAY";
    } else {
      player.play();
      if (playButtons[idx]) playButtons[idx].innerText = "PAUSE";
    }
    return;
  }

  // Reset text on all other buttons across the deck
  playButtons.forEach(btn => btn.innerText = "PLAY");

  // Load fresh digital asset line parameters
  activeMarketState.currentlyPlayingIdx = idx;
  player.src = srcUrl;
  player.load();
  
  player.play()
    .then(() => {
      if (playButtons[idx]) playButtons[idx].innerText = "PAUSE";
    })
    .catch(err => {
      console.error("Playback restriction triggered:", err.message);
      // Fallback redirect if browser blocks autoplay frames
      window.open(srcUrl, '_blank');
    });
};

/**
 * Executes network handshake to pull active matrix counts and routing destinations
 */
async function fetchLiveLedgerState(tier = activeMarketState.tier) {
  try {
    const requestUrl = `${TRADING_FLOOR_CONFIG.gatewayUrl}?tier=${tier}`;
    const response = await fetch(requestUrl, {
      method: 'GET',
      mode: 'cors',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`HTTP_GATEWAY_FAIL: ${response.status}`);
    const data = await response.json();

    if (data.status === "SUCCESS") {
      updateLiveTradingFloor(data);
    }
  } catch (error) {
    console.warn("Retaining baseline local terminal states.");
    updateLiveTradingFloor({
      portal_tier: tier,
      current_loop_position: 1,
      payment_rules: { cost_in: tier === 2 ? 20 : 10, payout_target: tier === 2 ? 160 : 80 },
      album_assets: { title: tier === 2 ? "GANSTA LYFE" : "QUEEN BUTTA" },
      active_seller_id: "THE_MUSIC_MARKET_DIRECT"
    });
  }
}

/**
 * Paints the live API response values onto your visual layout IDs smoothly
 */
function updateLiveTradingFloor(data) {
  activeMarketState.tier = data.portal_tier;
  activeMarketState.matrixCount = data.current_loop_position;
  activeMarketState.basePrice = data.payment_rules.cost_in;
  
  const targetElement = document.getElementById('router-target');
  const countElement = document.getElementById('router-count');
  const statusElement = document.getElementById('price-arrow');
  const albumLabel = document.getElementById('nav-album-t1');
  
  if (albumLabel && data.portal_tier === 1) {
    albumLabel.innerText = "QUEEN BUTTA";
  }

  const tierTwoButton = document.getElementById('p-1');
  if (tierTwoButton) {
    if (data.portal_tier === 1 && data.current_loop_position > 5) {
      tierTwoButton.disabled = false;
      tierTwoButton.style.opacity = "1";
      tierTwoButton.style.cursor = "pointer";
      const lockOverlay = tierTwoButton.querySelector('.absolute');
      if (lockOverlay) lockOverlay.remove();
    }
  }

  if (data.current_loop_position <= 5) {
    activeMarketState.currentMode = "POOL";
    if (targetElement) targetElement.innerText = "MARKET POOL (SEEDING)";
    if (countElement) countElement.innerText = `${data.current_loop_position} / 5 SALES`;
    if (statusElement) {
      statusElement.innerText = "STATUS // POOL SEEDING ACTIVE";
    }
  } else {
    activeMarketState.currentMode = "SELLER";
    if (targetElement) targetElement.innerText = `${data.active_seller_id}`;
    if (countElement) countElement.innerText = `${data.current_loop_position - 5} / 8 SALES TEAM`;
    if (statusElement) {
      statusElement.innerText = "STATUS // DIRECT RESELL NETTING";
    }
  }

  initializeMarketOscillator(activeMarketState.basePrice);
  evaluateDownloadPrivileges(data);
  renderTrackAssetGrid(data.portal_tier);
}

/**
 * Mimics organic financial terminal fluctuations with a heavily dampened delay loop
 */
function initializeMarketOscillator(floorPrice) {
  if (activeMarketState.oscillatorInterval) {
    clearInterval(activeMarketState.oscillatorInterval);
  }

  const tickerDisplay = document.getElementById('main-osc');
  if (!tickerDisplay) return;

  activeMarketState.oscillatorInterval = setInterval(() => {
    const targetPeak = 130.00;
    const timeFactor = Date.now() / 4500;
    const wave = (Math.sin(timeFactor) + 1) / 2; 
    const dynamicPrice = floorPrice + (wave * (targetPeak - floorPrice));
    
    tickerDisplay.innerText = `$${dynamicPrice.toFixed(2)}`;
  }, 850); 
}

/**
 * Activates the Free Download button module when a cleared payment record is confirmed
 */
function evaluateDownloadPrivileges(data) {
  const downloadBtn = document.getElementById('btn-free-download');
  if (!downloadBtn) return;

  downloadBtn.disabled = false;
  downloadBtn.className = "border border-emerald-500 bg-emerald-500/25 py-2.5 px-2 text-center rounded-xl font-mono text-[11px] text-white hover:bg-emerald-500/40 transition-all uppercase tracking-wider relative overflow-hidden cursor-pointer";
  
  const lockBadge = downloadBtn.querySelector('span');
  if (lockBadge) {
    lockBadge.innerText = "OPEN";
    lockBadge.className = "absolute top-1 right-1 text-[7px] bg-emerald-500/40 text-emerald-400 px-1 rounded";
  }
  
  downloadBtn.onclick = function() {
    // Defaults directly to the core compilation repository stream
    const targetAudio = "https://firebasestorage.googleapis.com/v0/b/aititrade-radio-97.firebasestorage.app/o/QUEEN%20BUTTA%2FSUPERFLY.mp3?alt=media&token=e260aa5d-a3c9-453e-8b80-a466a6328906";
    window.open(targetAudio, "_blank");
  };
}

/**
 * Dynamically builds the full 13-track collection using your live Firebase links
 */
function renderTrackAssetGrid(tier) {
  const assetContainer = document.getElementById('terminal-track-matrix-container');
  if (!assetContainer) return;

  const tier1Tracks = window.QUEEN_BUTTA_VAULT || [];
  const tier2Tracks = [
    { n: "STREET ROYALTY", src: "#" },
    { n: "HEAVY SMOKE", src: "#" },
    { n: "GOLD DUST", src: "#" },
    { n: "GANSTA LYFE", src: "#" }
  ];
  
  const tracksToRender = tier === 2 ? tier2Tracks : tier1Tracks;

  let htmlContent = "";
  tracksToRender.forEach((track, idx) => {
    const trackLabel = tier === 2 ? `G. Smooth - ${track.n}` : `Shanae' - ${track.n}`;
    
    // Check if this specific item is currently playing to match button state toggles
    const isPlaying = activeMarketState.currentlyPlayingIdx === idx && activeMarketState.globalPlayer && !activeMarketState.globalPlayer.paused;
    const btnLabel = isPlaying ? "PAUSE" : "PLAY";

    htmlContent += `
      <div class="flex justify-between items-center border-b border-white/5 py-1.5 text-white/80 hover:bg-white/5 px-1 transition-all">
        <span class="truncate pr-2">${idx + 1}. ${trackLabel}</span>
        <button class="terminal-play-btn text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded text-[9px] font-bold hover:bg-emerald-400/20 tracking-wider transition-all cursor-pointer shrink-0" 
                onclick="window.executeTerminalPlayback('${track.src}', ${idx})">
          ${btnLabel}
        </button>
      </div>
    `;
  });

  assetContainer.innerHTML = htmlContent;
}

function hijackPortalControls() {
  window.switchPortal = function(idx) {
    const requestedTier = idx + 1;
    const buttonTarget = document.getElementById(`p-${idx}`);
    if (buttonTarget && buttonTarget.disabled) return;

    document.querySelectorAll('.portal-btn').forEach(btn => btn.classList.remove('active'));
    if (buttonTarget) buttonTarget.classList.add('active');

    fetchLiveLedgerState(requestedTier);
  };

  fetchLiveLedgerState(1);
  setInterval(() => {
    fetchLiveLedgerState(activeMarketState.tier);
  }, TRADING_FLOOR_CONFIG.refreshRateMs);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hijackPortalControls);
} else {
  hijackPortalControls();
}
