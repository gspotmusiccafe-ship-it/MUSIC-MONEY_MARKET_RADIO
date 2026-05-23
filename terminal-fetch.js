/**
 * AITITRADE Terminal Data Line Controller - V4.3 (Bose Acoustic Edition)
 * Integrates Web Audio API Equalizer nodes to boost low-end bass punch and treble depth.
 * Retains strict transaction download gates, pure song labels, and 850ms market velocity.
 */

const TRADING_FLOOR_CONFIG = {
  gatewayUrl: "https://script.google.com/macros/s/AKfycbzRex97vYqKqhi53zVfw8tOay1Av_sIX9tzm-hzn6H5ALl-oId0lb_oSMdY1dgTufqY/exec",
  defaultTier: 1,
  refreshRateMs: 12000 
};

let activeMarketState = {
  tier: 1,
  currentMode: "POOL",
  matrixCount: 0,
  basePrice: 10.00,
  oscillatorInterval: null,
  globalPlayer: null, 
  currentlyPlayingIdx: null,
  isPaymentCleared: false,
  
  // Web Audio Context Mixing Slots
  audioCtx: null,
  sourceNode: null,
  bassFilter: null,
  trebleFilter: null
};

/**
 * Initializes the hidden Bose-style Master Mixing Deck pipeline
 */
function initAcousticMixingDeck(playerElement) {
  if (activeMarketState.audioCtx) return; // Prevent duplicate audio pipelines

  try {
    // Create browser audio workspace context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    activeMarketState.audioCtx = new AudioContext();

    // Route your raw player output into our mix engine
    activeMarketState.sourceNode = activeMarketState.audioCtx.createMediaElementSource(playerElement);

    // Node 1: Heavy Bass Equalizer (Peaking Filter at 80Hz for deep sub-thump)
    activeMarketState.bassFilter = activeMarketState.audioCtx.createBiquadFilter();
    activeMarketState.bassFilter.type = "peaking";
    activeMarketState.bassFilter.frequency.value = 80; 
    activeMarketState.bassFilter.Q.value = 1.2;
    activeMarketState.bassFilter.gain.value = 9.0; // Boost bass output by +9dB

    // Node 2: Premium Treble Contour (High-Shelf Filter at 6500Hz for high-end crispness)
    activeMarketState.trebleFilter = activeMarketState.audioCtx.createBiquadFilter();
    activeMarketState.trebleFilter.type = "highshelf";
    activeMarketState.trebleFilter.frequency.value = 6500;
    activeMarketState.trebleFilter.gain.value = 4.5; // Smooth out high-end vocals by +4.5dB

    // String the audio deck nodes together: Player -> Bass -> Treble -> Master Speakers
    activeMarketState.sourceNode.connect(activeMarketState.bassFilter);
    activeMarketState.bassFilter.connect(activeMarketState.trebleFilter);
    activeMarketState.trebleFilter.connect(activeMarketState.audioCtx.destination);
  } catch (err) {
    console.warn("Acoustic mix deck initialization deferred until human click interaction.");
  }
}

function getAudioEngine() {
  if (!activeMarketState.globalPlayer) {
    activeMarketState.globalPlayer = new Audio();
    activeMarketState.globalPlayer.volume = 0.90;
    activeMarketState.globalPlayer.crossOrigin = "anonymous"; // Needed for Firebase Web Audio processing
  }
  return activeMarketState.globalPlayer;
}

window.executeTerminalPlayback = function(element) {
  const player = getAudioEngine();
  const srcUrl = element.getAttribute('data-src');
  const idx = parseInt(element.getAttribute('data-idx'), 10);
  const playButtons = document.querySelectorAll('.terminal-play-btn');
  
  // Activate audio routing context on first play click gesture
  initAcousticMixingDeck(player);
  if (activeMarketState.audioCtx && activeMarketState.audioCtx.state === 'suspended') {
    activeMarketState.audioCtx.resume();
  }

  if (activeMarketState.currentlyPlayingIdx === idx) {
    if (!player.paused) {
      player.pause();
      element.innerText = "PLAY";
      element.className = "terminal-play-btn text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded text-[9px] font-bold hover:bg-emerald-400/20 tracking-wider transition-all cursor-pointer shrink-0 font-mono";
    } else {
      player.play();
      element.innerText = "PAUSE";
      element.className = "terminal-play-btn text-black bg-emerald-400 border border-emerald-400 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider transition-all cursor-pointer shrink-0 font-mono";
    }
    return;
  }

  playButtons.forEach(btn => {
    btn.innerText = "PLAY";
    btn.className = "terminal-play-btn text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded text-[9px] font-bold hover:bg-emerald-400/20 tracking-wider transition-all cursor-pointer shrink-0 font-mono";
  });

  activeMarketState.currentlyPlayingIdx = idx;
  player.src = srcUrl;
  player.load();
  
  player.play()
    .then(() => {
      element.innerText = "PAUSE";
      element.className = "terminal-play-btn text-black bg-emerald-400 border border-emerald-400 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider transition-all cursor-pointer shrink-0 font-mono";
    })
    .catch(err => {
      console.warn("Autoplay layer handled. Routing direct stream frame.");
      window.open(srcUrl, '_blank');
    });
};

async function fetchLiveLedgerState(tier = activeMarketState.tier) {
  try {
    const requestUrl = `${TRADING_FLOOR_CONFIG.gatewayUrl}?tier=${tier}&cache-bypass=${Date.now()}`;
    const response = await fetch(requestUrl, {
      method: 'GET',
      mode: 'cors',
      headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' }
    });

    if (!response.ok) throw new Error(`HTTP_GATEWAY_FAIL: ${response.status}`);
    const data = await response.json();

    if (data.status === "SUCCESS") {
      updateLiveTradingFloor(data);
    }
  } catch (error) {
    updateLiveTradingFloor({
      portal_tier: tier,
      current_loop_position: 1,
      payment_rules: { cost_in: tier === 2 ? 20 : 10, payout_target: tier === 2 ? 160 : 80 },
      album_assets: { title: tier === 2 ? "GANSTA LYFE" : "QUEEN BUTTA" },
      active_seller_id: "THE_MUSIC_MARKET_DIRECT"
    });
  }
}

function updateLiveTradingFloor(data) {
  activeMarketState.tier = data.portal_tier;
  activeMarketState.matrixCount = data.current_loop_position;
  activeMarketState.basePrice = data.portal_tier === 1 ? 10.00 : data.payment_rules.cost_in;
  
  // FIXED LOCK RULE: Controlled via spreadsheet transaction log clearances
  activeMarketState.isPaymentCleared = (data.clearance_override === "GRANTED" || data.is_production_paid === true); 

  const targetElement = document.getElementById('router-target');
  const countElement = document.getElementById('router-count');
  const statusElement = document.getElementById('price-arrow');
  const albumLabel = document.getElementById('nav-album-t1');
  const buyInButton = document.getElementById('btn-song-buy');
  
  if (albumLabel && data.portal_tier === 1) {
    albumLabel.innerText = "QUEEN BUTTA";
  }

  if (buyInButton) {
    buyInButton.innerText = `💰 BUY ASSET NOW ($${activeMarketState.basePrice})`;
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
    if (targetElement) {
      targetElement.innerText = "MARKET POOL (SEEDING)";
      targetElement.className = "text-emerald-400 font-bold font-mono";
    }
    if (countElement) {
      countElement.innerText = `${data.current_loop_position} / 5 SALES`;
      countElement.className = "text-emerald-400 font-bold font-mono";
    }
    if (statusElement) {
      statusElement.innerText = "STATUS // POOL SEEDING ACTIVE";
      statusElement.className = "text-[9px] font-mono text-emerald-400 uppercase tracking-widest mt-1 font-bold";
    }
  } else {
    activeMarketState.currentMode = "SELLER";
    if (targetElement) {
      targetElement.innerText = `${data.active_seller_id}`;
      targetElement.className = "text-yellow-500 font-bold font-mono";
    }
    if (countElement) {
      countElement.innerText = `${data.current_loop_position - 5} / 8 SALES TEAM`;
      countElement.className = "text-yellow-500 font-bold font-mono";
    }
    if (statusElement) {
      statusElement.innerText = "STATUS // DIRECT RESELL NETTING";
      statusElement.className = "text-[9px] font-mono text-yellow-500 uppercase tracking-widest mt-1 font-bold";
    }
  }

  initializeMarketOscillator(activeMarketState.basePrice);
  evaluateDownloadPrivileges();
  renderTrackAssetGrid(data.portal_tier);
}

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

function evaluateDownloadPrivileges() {
  const downloadBtn = document.getElementById('btn-free-download');
  if (!downloadBtn) return;

  if (activeMarketState.isPaymentCleared) {
    downloadBtn.disabled = false;
    downloadBtn.className = "border border-emerald-500 bg-emerald-500/25 py-2.5 px-2 text-center rounded-xl font-mono text-[11px] text-white hover:bg-emerald-500/40 transition-all uppercase tracking-wider relative overflow-hidden cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.1)]";
    downloadBtn.innerHTML = `<span class="absolute top-1 right-1 text-[7px] bg-emerald-500/40 text-emerald-400 px-1 rounded font-bold">UNLOCKED</span> 📥 DOWNLOAD ALBUM`;
    
    downloadBtn.onclick = function() {
      window.open("https://payhip.com/b/cONHP", "_blank");
    };
  } else {
    downloadBtn.disabled = true;
    downloadBtn.className = "border border-white/5 bg-white/5 py-2.5 px-2 text-center rounded-xl font-mono text-[11px] text-white/20 cursor-not-allowed transition-all uppercase tracking-wider relative overflow-hidden";
    downloadBtn.innerHTML = `<span class="absolute top-1 right-1 text-[7px] bg-red-500/20 text-red-400 px-1 rounded font-bold">GATED</span> 📥 DOWNLOAD ALBUM`;
    downloadBtn.onclick = null;
  }
}

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
    const trackLabel = track.n;
    const isPlaying = activeMarketState.currentlyPlayingIdx === idx && activeMarketState.globalPlayer && !activeMarketState.globalPlayer.paused;

    htmlContent += `
      <div class="flex justify-between items-center border-b border-emerald-500/10 py-1.5 transition-all hover:bg-emerald-500/5 px-1">
        <span class="truncate pr-2 text-emerald-400/90 font-mono font-medium">${idx + 1}. ${trackLabel}</span>
        <button class="terminal-play-btn text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded text-[9px] font-bold hover:bg-emerald-400/25 tracking-wider transition-all cursor-pointer shrink-0 font-mono" 
                data-src="${track.src}" data-idx="${idx}" onclick="window.executeTerminalPlayback(this)">
          ${isPlaying ? "PAUSE" : "PLAY"}
        </button>
      </div>
    `;
  });

  assetContainer.innerHTML = htmlContent;
}

function hijackPortalControls() {
  window.switchPortal = function(idx) {
    document.querySelectorAll('.portal-btn').forEach(btn => btn.classList.remove('active'));
    
    if (idx === 'market') {
      const marketViewBtn = document.getElementById('btn-market-view');
      if (marketViewBtn) marketViewBtn.classList.add('active');
      fetchLiveLedgerState(1); 
      return;
    }

    const buttonTarget = document.getElementById(`p-${idx}`);
    if (buttonTarget && buttonTarget.disabled) return;
    if (buttonTarget) buttonTarget.classList.add('active');

    const requestedTier = idx + 1;
    fetchLiveLedgerState(requestedTier);
  };

  const marketViewBtn = document.getElementById('btn-market-view');
  if (marketViewBtn) {
    marketViewBtn.setAttribute('onclick', "switchPortal('market')");
  }

  fetchLiveLedgerState(1);
  setInterval(() => {
    const marketViewBtn = document.getElementById('btn-market-view');
    if (marketViewBtn && marketViewBtn.classList.contains('active')) {
      fetchLiveLedgerState(1);
    } else {
      fetchLiveLedgerState(activeMarketState.tier);
    }
  }, TRADING_FLOOR_CONFIG.refreshRateMs);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hijackPortalControls);
} else {
  hijackPortalControls();
}
