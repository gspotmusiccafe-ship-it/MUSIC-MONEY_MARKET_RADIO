/**
 * AITITRADE Terminal Data Line Controller - V3.2
 * Fail-safe layout injector with automated ticker oscillation.
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
  oscillatorInterval: null
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
    console.warn("Ledger connection offline. Retaining active state loop.", error.message);
  }
}

/**
 * Ensures the target text outputs exist on the screen layout, or injects them safely
 */
function verifyAndInjectTerminalNodes() {
  let displayBox = document.getElementById('terminal-data-display-node');
  
  if (!displayBox) {
    // Find your main layout panel to embed the data readouts cleanly
    const mainPanel = document.querySelector('.grid.grid-cols-3') || document.body.firstChild;
    if (!mainPanel) return;
    
    displayBox = document.createElement('div');
    displayBox.id = 'terminal-data-display-node';
    displayBox.className = "w-full my-4 p-3 bg-black/60 border border-emerald-500/20 rounded font-mono text-xs space-y-1 text-left";
    displayBox.innerHTML = `
      <div class="text-emerald-400/60 font-bold tracking-wider mb-1">⚡ SYSTEM CORE MONITOR:</div>
      <div class="flex justify-between"><span class="text-white/40">GATEWAY INDEX:</span> <span id="router-target" class="text-emerald-400">CONNECTING...</span></div>
      <div class="flex justify-between"><span class="text-white/40">LOOP QUEUE:</span> <span id="router-count" class="text-emerald-400">-- / --</span></div>
      <div class="flex justify-between"><span class="text-white/40">PRICE STREAM:</span> <span id="main-osc" class="text-emerald-400 font-bold">$10.00</span></div>
      <div id="price-arrow" class="text-[10px] text-emerald-400/50 pt-1 border-t border-white/5 mt-1">STATUS // SYNCING NETWORK</div>
      <div id="matrix-visualizer" class="hidden"></div>
    `;
    
    // Inject directly below your top button rows
    mainPanel.parentNode.insertBefore(displayBox, mainPanel.nextSibling);
  }
}

/**
 * Paints the live API response values onto your visual layout IDs
 */
function updateLiveTradingFloor(data) {
  // Run safety injection routine
  verifyAndInjectTerminalNodes();

  activeMarketState.tier = data.portal_tier;
  activeMarketState.matrixCount = data.current_loop_position;
  activeMarketState.basePrice = data.payment_rules.cost_in;
  
  const targetElement = document.getElementById('router-target');
  const countElement = document.getElementById('router-count');
  const statusElement = document.getElementById('price-arrow');
  const visualizer = document.getElementById('matrix-visualizer');
  
  // Synchronize dynamic album button labels at the top deck
  if (data.portal_tier === 1) {
    const t1Label = document.getElementById('nav-album-t1');
    if (t1Label) t1Label.innerText = data.album_assets.title.toUpperCase();
  }

  // EVALUATE LOCK OUT MATRIX UNLOCK RULES
  const tierTwoButton = document.getElementById('p-1');
  if (tierTwoButton) {
    if (data.portal_tier === 1 && data.current_loop_position > 5) {
      tierTwoButton.disabled = false;
      tierTwoButton.className = "portal-btn border border-emerald-500/20 bg-black/40 p-2 text-center rounded hover:bg-emerald-500/10 transition-all group";
      const lockOverlay = tierTwoButton.querySelector('.absolute');
      if (lockOverlay) lockOverlay.remove();
    }
  }

  // Handle Binary Matrix Destination Output Formatting
  if (data.current_loop_position <= 5) {
    activeMarketState.currentMode = "POOL";
    if (targetElement) targetElement.innerText = "MARKET POOL (SEEDING)";
    if (countElement) countElement.innerText = `${data.current_loop_position} / 5 SALES`;
    if (statusElement) {
      statusElement.innerText = "STATUS // POOL SEEDING ACTIVE";
      statusElement.className = "text-[10px] text-emerald-400 font-mono";
    }
    if (visualizer) {
      visualizer.innerText = `[YOU] ➔ METRICS (${data.current_loop_position}/5)`;
    }
  } else {
    activeMarketState.currentMode = "SELLER";
    if (targetElement) targetElement.innerText = `${data.active_seller_id}`;
    if (countElement) countElement.innerText = `${data.current_loop_position - 5} / 8 SALES TEAM`;
    if (statusElement) {
      statusElement.innerText = "STATUS // DIRECT RESELL NETTING";
      statusElement.className = "text-[10px] text-yellow-500 font-mono";
    }
  }

  // Kick off market fluctuation simulator matching current portal buy-in floor
  initializeMarketOscillator(activeMarketState.basePrice);

  // Verify settlement data array to see if active client has valid clearances
  evaluateDownloadPrivileges(data);
  renderTrackAssetGrid(data.portal_tier, data.album_assets.title);
}

/**
 * Mimics true financial market movement by fluctuating pricing tickers up to a $130 cap
 */
function initializeMarketOscillator(floorPrice) {
  if (activeMarketState.oscillatorInterval) {
    clearInterval(activeMarketState.oscillatorInterval);
  }

  const tickerDisplay = document.getElementById('main-osc');
  if (!tickerDisplay) return;

  activeMarketState.oscillatorInterval = setInterval(() => {
    const targetPeak = 130.00;
    const timeFactor = Date.now() / 1800;
    const wave = (Math.sin(timeFactor) + 1) / 2; 
    const dynamicPrice = floorPrice + (wave * (targetPeak - floorPrice));
    
    tickerDisplay.innerText = `$${dynamicPrice.toFixed(2)}`;
  }, 150); 
}

/**
 * Activates the Free Download button module when a cleared payment record is confirmed
 */
function evaluateDownloadPrivileges(data) {
  const downloadBtn = document.getElementById('btn-free-download');
  if (!downloadBtn) return;

  if (data.status === "SUCCESS") {
    downloadBtn.disabled = false;
    downloadBtn.className = "border border-emerald-500 bg-emerald-500/20 p-3 text-center rounded font-mono text-xs text-white hover:bg-emerald-500/40 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer";
    
    const lockBadge = downloadBtn.querySelector('.absolute');
    if (lockBadge) {
      lockBadge.innerText = "VERIFIED";
      lockBadge.className = "absolute top-1 right-1 text-[8px] bg-emerald-500/30 text-emerald-400 px-1 rounded";
    }
    
    downloadBtn.onclick = function() {
      window.open(data.album_assets.audio_stream !== "NOT_SET" ? data.album_assets.audio_stream : "#", "_blank");
    };
  }
}

/**
 * Dynamically builds the album asset ledger items on the screen layout
 */
function renderTrackAssetGrid(tier, albumTitle) {
  let assetContainer = document.getElementById('terminal-track-matrix-container');
  
  if (!assetContainer) {
    const mainLayoutNode = document.getElementById('terminal-data-display-node');
    if (!mainLayoutNode) return;
    
    assetContainer = document.createElement('div');
    assetContainer.id = 'terminal-track-matrix-container';
    assetContainer.className = "w-full mt-2 p-3 bg-black/40 border border-white/5 rounded font-mono text-xs text-left";
    mainLayoutNode.parentNode.insertBefore(assetContainer, mainLayoutNode.nextSibling);
  }

  const tier1Tracks = ["G. Soul - Intro Vibe", "Blue Flame - Kinetic Velocity", "Ms. Butta - Velvet Smooth", "Shanae' - Silent Cries"];
  const tier2Tracks = ["G. Smooth - Street Royalty", "Blue Flame - Heavy Smoke", "Ms. Butta - Gold Dust", "Shanae' - Gansta Lyfe"];
  const tracksToRender = tier === 2 ? tier2Tracks : tier1Tracks;

  let htmlContent = `
    <div class="flex justify-between items-center mb-2 text-[10px] text-white/40">
      <span>ALBUM: ${albumTitle.toUpperCase() || "ALBUM STREAM"}</span>
      <span class="text-emerald-400">SINGLES: $1.00</span>
    </div>
    <div class="space-y-1">
  `;

  tracksToRender.forEach((track, idx) => {
    htmlContent += `
      <div class="flex justify-between items-center border-b border-white/5 py-1 text-white/80">
        <span>${idx + 1}. ${track}</span>
        <span class="text-emerald-400/40 text-[10px]">[READY]</span>
      </div>
    `;
  });

  htmlContent += `</div>`;
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
