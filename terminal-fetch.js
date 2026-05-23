/**
 * AITITRADE Terminal Data Line Controller - V3.1
 * Fully integrated matrix tracking, conditional tier locks, market price oscillation up to $130, and dynamic asset rendering.
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
 * Paints the live API response values onto your visual layout IDs
 */
function updateLiveTradingFloor(data) {
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
    if (targetElement) targetElement.innerText = "MARKET POOL (A/B SEEDING)";
    if (countElement) countElement.innerText = `${data.current_loop_position} / 5 SALES`;
    if (statusElement) {
      statusElement.innerText = "STATUS // POOL SEEDING";
      statusElement.className = "font-bold text-sm mb-4 text-emerald-400 font-mono";
    }
    if (visualizer) {
      visualizer.innerText = `[YOU] ➔ ARCHITECTURE BUILDING METRICS (${data.current_loop_position}/5)`;
    }
  } else {
    activeMarketState.currentMode = "SELLER";
    if (targetElement) targetElement.innerText = `ACTIVE SELLER ID: ${data.active_seller_id}`;
    if (countElement) countElement.innerText = `${data.current_loop_position - 5} / 8 SALES TEAM`;
    if (statusElement) {
      statusElement.innerText = "STATUS // DIRECT RESELL NETTING";
      statusElement.className = "font-bold text-sm mb-4 text-yellow-500 font-mono";
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
 * Dynamically builds the album asset ledger items on the right section
 */
function renderTrackAssetGrid(tier, albumTitle) {
  let assetContainer = null;
  const headings = document.getElementsByTagName('h3');
  for (let i = 0; i < headings.length; i++) {
    if (headings[i].innerText.includes("TRACK ASSET TRACKER")) {
      assetContainer = headings[i].parentElement;
      break;
    }
  }

  if (!assetContainer) {
    assetContainer = document.querySelector('.w-full.bg-black\\/40.p-4.border.border-white\\/10');
  }
  if (!assetContainer) return;

  const tier1Tracks = ["G. Soul - Intro Vibe", "Blue Flame - Kinetic Velocity", "Ms. Butta - Velvet Smooth", "Shanae' - Silent Cries"];
  const tier2Tracks = ["G. Smooth - Street Royalty", "Blue Flame - Heavy Smoke", "Ms. Butta - Gold Dust", "Shanae' - Gansta Lyfe"];
  const tracksToRender = tier === 2 ? tier2Tracks : tier1Tracks;

  let htmlContent = `
    <div class="flex justify-between items-center mb-4 font-mono">
      <h3 class="text-xs tracking-widest text-white/40 uppercase font-mono">TRACK ASSET TRACKER</h3>
      <span class="text-xs text-emerald-400">SINGLES: $1.00</span>
    </div>
    <div class="text-sm font-bold text-emerald-400 mb-2 font-mono uppercase">${albumTitle || "ALBUM STREAM"}</div>
    <div class="space-y-2 font-mono text-xs">
  `;

  tracksToRender.forEach((track, idx) => {
    htmlContent += `
      <div class="flex justify-between items-center border-b border-white/5 py-2 hover:bg-white/5 px-1 transition-all">
        <span class="text-white/80">${idx + 1}. ${track}</span>
        <button class="text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded text-[10px] hover:bg-emerald-400/20" onclick="alert('Transaction node prepared for single download.')">BUY SINGLE</button>
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
    
    const portalTitle = document.getElementById('portal-title-display');
    if (portalTitle) portalTitle.innerText = `PORTAL TIER ${requestedTier} BASE PRICE`;

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
