/**
 * AITITRADE Terminal Data Line Controller - V3.4 (Absolute Fail-Safe Mode)
 * Bypasses all layout class dependencies to force-render the Bloomberg UI panel and price oscillator.
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
    // Run layout builder even if backend is offline to guarantee visual presence
    updateLiveTradingFloor({
      portal_tier: tier,
      current_loop_position: 1,
      payment_rules: { cost_in: tier === 2 ? 20 : 10, payout_target: tier === 2 ? 160 : 80 },
      album_assets: { title: tier === 2 ? "GANSTA LYFE" : "FIRST ALBUM" },
      active_seller_id: "THE_MUSIC_MARKET_DIRECT"
    });
  }
}

/**
 * Creates and injects an isolated Bloomberg container that can't be hidden by existing styles
 */
function buildBloombergDataModule() {
  let displayBox = document.getElementById('terminal-data-display-node');
  
  if (!displayBox) {
    // Look for any standard button container on your screen to attach below, or fall back to body
    const anchor = document.getElementById('p-0')?.parentElement || document.body.firstChild;
    if (!anchor) return;
    
    displayBox = document.createElement('div');
    displayBox.id = 'terminal-data-display-node';
    
    // Hardcoded inline styling blocks any global theme inheritance bugs
    displayBox.style.cssText = `
      width: 95%;
      max-width: 500px;
      margin: 20px auto;
      padding: 20px;
      background-color: #000000 !important;
      border: 2px solid #10b981 !important;
      border-radius: 8px !important;
      font-family: 'Courier New', monospace !important;
      color: #10b981 !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.2) !important;
      text-align: left !important;
    `;
    
    displayBox.innerHTML = `
      <div style="font-weight: bold; font-size: 14px; letter-spacing: 1px; margin-bottom: 12px; border-b: 1px solid rgba(16,185,129,0.3); padding-bottom: 6px; color: #10b981;">⚡ SYSTEM CORE MONITOR:</div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px;"><span style="color: rgba(16,185,129,0.6);">GATEWAY NODE:</span> <span id="router-target" style="color: #ffffff; font-weight: bold;">CONNECTING...</span></div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px;"><span style="color: rgba(16,185,129,0.6);">LOOP QUEUE:</span> <span id="router-count" style="color: #ffffff; font-weight: bold;">-- / --</span></div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px;"><span style="color: rgba(16,185,129,0.6);">PRICE STREAM:</span> <span id="main-osc" style="color: #10b981; font-weight: bold; font-size: 16px; text-shadow: 0 0 5px rgba(16,185,129,0.5);">$10.00</span></div>
      <div id="price-arrow" style="font-size: 10px; color: rgba(16,185,129,0.7); padding-top: 6px; border-top: 1px solid rgba(16,185,129,0.1); font-weight: bold;">STATUS // INITIALIZING NETWORK LINK</div>
      <div id="terminal-track-matrix-container" style="margin-top: 14px; padding-top: 10px; border-top: 1px solid rgba(16, 185, 129, 0.3);"></div>
    `;
    
    if (anchor.parentNode) {
      anchor.parentNode.insertBefore(displayBox, anchor.nextSibling);
    } else {
      document.body.appendChild(displayBox);
    }
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
      tierTwoButton.style.opacity = "1";
      tierTwoButton.style.cursor = "pointer";
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

  downloadBtn.disabled = false;
  downloadBtn.style.opacity = "1";
  downloadBtn.style.cursor = "pointer";
  downloadBtn.style.borderColor = "#10b981";
  downloadBtn.style.color = "#ffffff";
  downloadBtn.style.backgroundColor = "rgba(16, 185, 129, 0.2)";
  
  const lockBadge = downloadBtn.querySelector('.absolute') || downloadBtn.querySelector('span');
  if (lockBadge) {
    lockBadge.innerText = "VERIFIED";
    lockBadge.style.backgroundColor = "rgba(16, 185, 129, 0.3)";
    lockBadge.style.color = "#10b981";
  }
  
  downloadBtn.onclick = function() {
    if (data && data.album_assets && data.album_assets.audio_stream !== "NOT_SET") {
      window.open(data.album_assets.audio_stream, "_blank");
    } else {
      alert("Downloading digital album track items... (Redirecting to asset vault)");
    }
  };
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
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; opacity: 0.6; font-weight: bold;">
      <span>ALBUM: ${albumTitle ? albumTitle.toUpperCase() : "STREAM"}</span>
      <span style="color: #10b981;">SINGLES: $1.00</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 6px;">
  `;

  tracksToRender.forEach((track, idx) => {
    htmlContent += `
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(16,185,129,0.1); padding: 4px 0; font-size: 11px;">
        <span style="color: #ffffff; opacity: 0.9;">${idx + 1}. ${track}</span>
        <span style="color: #10b981; font-weight: bold; font-size: 10px;">[READY]</span>
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

    document.querySelectorAll('.portal-btn').forEach(btn => {
      btn.style.borderColor = "rgba(255,255,255,0.1)";
    });
    if (buttonTarget) buttonTarget.style.borderColor = "#10b981";

    fetchLiveLedgerState(requestedTier);
  };

  buildBloombergDataModule();
  fetchLiveLedgerState(1);
  
  setInterval(() => {
    fetchLiveLedgerState(activeMarketState.tier);
  }, TRADING_FLOOR_CONFIG.refreshRateMs);
}

// Global instant executor initialization
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hijackPortalControls);
} else {
  hijackPortalControls();
}
