/**
 * AITITRADE Terminal Data Line Controller - V3.3
 * Integrated matrix tracking, conditional tier locks, custom glassmorphic layout injector,
 * and high-frequency market price oscillation up to $130.
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
    console.warn("Ledger connection temporary bypass active.", error.message);
  }
}

/**
 * Forces injection of a styled terminal data panel directly into the view hierarchy
 */
function buildBloombergDataModule() {
  let displayBox = document.getElementById('terminal-data-display-node');
  
  if (!displayBox) {
    // Locate the primary buttons container to slide the telemetry grid immediately below it
    const anchor = document.getElementById('p-0')?.parentElement || document.body.firstChild;
    if (!anchor) return;
    
    displayBox = document.createElement('div');
    displayBox.id = 'terminal-data-display-node';
    
    // Injects raw custom styles to guarantee visibility over global sheet resets
    displayBox.style.width = "100%";
    displayBox.style.margin = "15px 0";
    displayBox.style.padding = "15px";
    displayBox.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
    displayBox.style.border = "1px solid rgba(16, 185, 129, 0.3)";
    displayBox.style.borderRadius = "6px";
    displayBox.style.fontFamily = "monospace";
    displayBox.style.color = "#10b981";
    displayBox.style.fontSize = "12px";
    displayBox.style.boxShadow = "0 0 15px rgba(16, 185, 129, 0.1)";
    
    displayBox.innerHTML = `
      <div style="font-weight: bold; letter-spacing: 1px; margin-bottom: 8px; border-b: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px;">⚡ SYSTEM CORE MONITOR:</div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="opacity: 0.5;">GATEWAY NODE:</span> <span id="router-target" style="color: #ffffff;">CONNECTING...</span></div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span style="opacity: 0.5;">LOOP QUEUE:</span> <span id="router-count" style="color: #ffffff;">-- / --</span></div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span style="opacity: 0.5;">PRICE STREAM:</span> <span id="main-osc" style="color: #10b981; font-weight: bold; font-size: 14px;">$10.00</span></div>
      <div id="price-arrow" style="font-size: 10px; opacity: 0.6; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.05);">STATUS // INITIALIZING NETWORK LINK</div>
      <div id="terminal-track-matrix-container" style="margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(16, 185, 129, 0.2);"></div>
    `;
    
    anchor.parentNode.insertBefore(displayBox, anchor.nextSibling);
  }
}

/**
 * Paints the live API response values onto your visual layout IDs
 */
function updateLiveTradingFloor(data) {
  buildBloombergDataModule();

  activeMarketState.tier = data.portal_tier;
  activeMarketState.matrixCount = data.current_loop_position;
  activeMarketState.basePrice = data.payment_rules.cost_in;
  
  const targetElement = document.getElementById('router-target');
  const countElement = document.getElementById('router-count');
  const statusElement = document.getElementById('price-arrow');
  
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
      statusElement.style.color = "#10b981";
    }
  } else {
    activeMarketState.currentMode = "SELLER";
    if (targetElement) targetElement.innerText = `${data.active_seller_id}`;
    if (countElement) countElement.innerText = `${data.current_loop_position - 5} / 8 SALES TEAM`;
    if (statusElement) {
      statusElement.innerText = "STATUS // DIRECT RESELL NETTING";
      statusElement.style.color = "#eab308";
    }
  }

  initializeMarketOscillator(activeMarketState.basePrice);
  evaluateDownloadPrivileges(data);
  renderTrackAssetGrid(data.portal_tier, data.album_assets.title);
}

/**
 * Mimics financial terminal velocity by fluctuating pricing tickers up to a $130 cap
 */
function initializeMarketOscillator(floorPrice) {
  if (activeMarketState.oscillatorInterval) {
    clearInterval(activeMarketState.oscillatorInterval);
  }

  const tickerDisplay = document.getElementById('main-osc');
  if (!tickerDisplay) return;

  activeMarketState.oscillatorInterval = setInterval(() => {
    const targetPeak = 130.00;
    const timeFactor = Date.now() / 1500;
    const wave = (Math.sin(timeFactor) + 1) / 2; 
    const dynamicPrice = floorPrice + (wave * (targetPeak - floorPrice));
    
    tickerDisplay.innerText = `$${dynamicPrice.toFixed(2)}`;
  }, 100); 
}

/**
 * Activates the Free Download button module when a cleared payment record is confirmed
 */
function evaluateDownloadPrivileges(data) {
  const downloadBtn = document.getElementById('btn-free-download');
  if (!downloadBtn) return;

  if (data.status === "SUCCESS") {
    downloadBtn.disabled = false;
    downloadBtn.className = "border border-emerald-500 bg-emerald-500/20 p-3 text-center rounded font-mono text-xs text-white hover:bg-emerald-500/40 transition-all uppercase tracking-wider cursor-pointer";
    
    const lockBadge = downloadBtn.querySelector('.absolute') || downloadBtn.querySelector('span');
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
  const assetContainer = document.getElementById('terminal-track-matrix-container');
  if (!assetContainer) return;

  const tier1Tracks = ["G. Soul - Intro Vibe", "Blue Flame - Kinetic Velocity", "Ms. Butta - Velvet Smooth", "Shanae' - Silent Cries"];
  const tier2Tracks = ["G. Smooth - Street Royalty", "Blue Flame - Heavy Smoke", "Ms. Butta - Gold Dust", "Shanae' - Gansta Lyfe"];
  const tracksToRender = tier === 2 ? tier2Tracks : tier1Tracks;

  let htmlContent = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 10px; opacity: 0.5;">
      <span>ALBUM: ${albumTitle.toUpperCase()}</span>
      <span style="color: #10b981;">SINGLES: $1.00</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px;">
  `;

  tracksToRender.forEach((track, idx) => {
    htmlContent += `
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 3px 0; opacity: 0.8;">
        <span>${idx + 1}. ${track}</span>
        <span style="color: rgba(16, 185, 129, 0.6); font-size: 10px;">[READY]</span>
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
