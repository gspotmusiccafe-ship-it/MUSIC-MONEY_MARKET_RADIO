/**
 * AITITRADE Terminal Data Line Controller - V3.8 (Production Release)
 * Resolves Market View button lockouts, brings back full emerald glow text,
 * fixes the $10 Buy-in baseline pricing, and maps the live Payhip download route.
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
  globalPlayer: null, 
  currentlyPlayingIdx: null
};

function getAudioEngine() {
  if (!activeMarketState.globalPlayer) {
    activeMarketState.globalPlayer = new Audio();
    activeMarketState.globalPlayer.volume = 0.85;
  }
  return activeMarketState.globalPlayer;
}

window.executeTerminalPlayback = function(srcUrl, idx) {
  const player = getAudioEngine();
  const playButtons = document.querySelectorAll('.terminal-play-btn');
  
  if (activeMarketState.currentlyPlayingIdx === idx) {
    if (!player.paused) {
      player.pause();
      if (playButtons[idx]) {
        playButtons[idx].innerText = "PLAY";
        playButtons[idx].className = "terminal-play-btn text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded text-[9px] font-bold hover:bg-emerald-400/20 tracking-wider transition-all cursor-pointer shrink-0";
      }
    } else {
      player.play();
      if (playButtons[idx]) {
        playButtons[idx].innerText = "PAUSE";
        playButtons[idx].className = "terminal-play-btn text-black bg-emerald-400 border border-emerald-400 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider transition-all cursor-pointer shrink-0";
      }
    }
    return;
  }

  playButtons.forEach(btn => {
    btn.innerText = "PLAY";
    btn.className = "terminal-play-btn text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded text-[9px] font-bold hover:bg-emerald-400/20 tracking-wider transition-all cursor-pointer shrink-0";
  });

  activeMarketState.currentlyPlayingIdx = idx;
  player.src = srcUrl;
  player.load();
  
  player.play()
    .then(() => {
      if (playButtons[idx]) {
        playButtons[idx].innerText = "PAUSE";
        playButtons[idx].className = "terminal-play-btn text-black bg-emerald-400 border border-emerald-400 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider transition-all cursor-pointer shrink-0";
      }
    })
    .catch(err => {
      console.warn("Autoplay block active. Falling back to stream redirect.", err.message);
      window.open(srcUrl, '_blank');
    });
};

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
  
  // Forces Portal 1 base floor to strictly display the $10 entry rules configuration
  activeMarketState.basePrice = data.portal_tier === 1 ? 10.00 : data.payment_rules.cost_in;
  
  const targetElement = document.getElementById('router-target');
  const countElement = document.getElementById('router-count');
  const statusElement = document.getElementById('price-arrow');
  const albumLabel = document.getElementById('nav-album-t1');
  const buyInButton = document.getElementById('btn-song-buy');
  
  if (albumLabel && data.portal_tier === 1) {
    albumLabel.innerText = "QUEEN BUTTA";
  }

  // Update Buy-In text node dynamically to show the pristine $10 price value
  if (buyInButton) {
    buyInButton.innerText = `💰 BUY-IN PORTAL ($${activeMarketState.basePrice})`;
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
      statusElement.className = "text-[9px] font-mono text-emerald-400/80 uppercase tracking-widest mt-1";
    }
  } else {
    activeMarketState.currentMode = "SELLER";
    if (targetElement) targetElement.innerText = `${data.active_seller_id}`;
    if (countElement) countElement.innerText = `${data.current_loop_position - 5} / 8 SALES TEAM`;
    if (statusElement) {
      statusElement.innerText = "STATUS // DIRECT RESELL NETTING";
      statusElement.className = "text-[9px] font-mono text-yellow-500 uppercase tracking-widest mt-1";
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

  downloadBtn.disabled = false;
  downloadBtn.className = "border border-emerald-500 bg-emerald-500/25 py-2.5 px-2 text-center rounded-xl font-mono text-[11px] text-white hover:bg-emerald-500/40 transition-all uppercase tracking-wider relative overflow-hidden cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.1)]";
  
  const lockBadge = downloadBtn.querySelector('span');
  if (lockBadge) {
    lockBadge.innerText = "OPEN";
    lockBadge.className = "absolute top-1 right-1 text-[7px] bg-emerald-500/40 text-emerald-400 px-1 rounded font-bold";
  }
  
  // Directly fires off your specified Payhip Album Vault Link on interaction
  downloadBtn.onclick = function() {
    window.open("https://payhip.com/b/cONHP", "_blank");
  };
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
    const trackLabel = tier === 2 ? `G. Smooth - ${track.n}` : `Shanae' - ${track.n}`;
    const isPlaying = activeMarketState.currentlyPlayingIdx === idx && activeMarketState.globalPlayer && !activeMarketState.globalPlayer.paused;
    
    // Explicitly injects emerald text layout properties into the runtime grid to destroy monochrome bugs
    htmlContent += `
      <div class="flex justify-between items-center border-b border-emerald-500/10 py-1.5 transition-all hover:bg-emerald-500/5 px-1">
        <span class="truncate pr-2 text-emerald-400/90 font-mono font-medium">${idx + 1}. ${trackLabel}</span>
        <button class="terminal-play-btn text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded text-[9px] font-bold hover:bg-emerald-400/25 tracking-wider transition-all cursor-pointer shrink-0 font-mono" 
                onclick="window.executeTerminalPlayback('${track.src}', ${idx})">
          ${isPlaying ? "PAUSE" : "PLAY"}
        </button>
      </div>
    `;
  });

  assetContainer.innerHTML = htmlContent;
}

function hijackPortalControls() {
  // Completely overrides the navigation deck routing matrix
  window.switchPortal = function(idx) {
    document.querySelectorAll('.portal-btn').forEach(btn => btn.classList.remove('active'));
    
    if (idx === 'market') {
      const marketViewBtn = document.getElementById('btn-market-view');
      if (marketViewBtn) marketViewBtn.classList.add('active');
      fetchLiveLedgerState(1); // Pulls top level architecture logs
      return;
    }

    const buttonTarget = document.getElementById(`p-${idx}`);
    if (buttonTarget && buttonTarget.disabled) return;
    if (buttonTarget) buttonTarget.classList.add('active');

    const requestedTier = idx + 1;
    fetchLiveLedgerState(requestedTier);
  };

  // Wire up the Market View button directly to our fresh un-stuck override route
  const marketViewBtn = document.getElementById('btn-market-view');
  if (marketViewBtn) {
    marketViewBtn.setAttribute('onclick', "switchPortal('market')");
  }

  fetchLiveLedgerState(1);
  setInterval(() => {
    // Retain synchronization tracking loop
    if (document.getElementById('btn-market-view').classList.contains('active')) {
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
