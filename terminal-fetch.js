/**
 * AITITRADE Terminal Data Line Controller - V2.1
 * Class-independent selector engine for rendering live assets and matrix counts.
 */

const TRADING_FLOOR_CONFIG = {
  gatewayUrl: "https://script.google.com/macros/s/AKfycbzRex97vYqKqhi53zVfw8tOay1Av_sIX9tzm-hzn6H5ALl-oId0lb_oSMdY1dgTufqY/exec",
  defaultTier: 1,
  refreshRateMs: 15000 
};

let activeMarketState = {
  tier: 1,
  currentMode: "POOL",
  matrixCount: 0
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
    console.warn("Ledger gateway reading fallback mode active: ", error.message);
  }
}

/**
 * Paints the live API response values onto your visual layout IDs
 */
function updateLiveTradingFloor(data) {
  activeMarketState.tier = data.portal_tier;
  activeMarketState.matrixCount = data.current_loop_position;
  
  const targetElement = document.getElementById('router-target');
  const countElement = document.getElementById('router-count');
  const statusElement = document.getElementById('price-arrow');
  const visualizer = document.getElementById('matrix-visualizer');
  const mainOscillator = document.getElementById('main-osc');
  
  if (mainOscillator) {
    mainOscillator.innerText = `$${data.payment_rules.cost_in.toFixed(2)}`;
  }

  // Handle Binary Matrix Destination Output Formatting
  if (data.current_loop_position <= 5) {
    activeMarketState.currentMode = "POOL";
    if (targetElement) targetElement.innerText = "MARKET POOL (A/B SEEDING)";
    if (countElement) countElement.innerText = `${data.current_loop_position} / 5 SALES`;
    if (statusElement) {
      statusElement.innerText = "STATUS // POOL SEEDING";
      statusElement.className = "font-bold text-sm mb-4 text-emerald-400";
    }
    
    if (visualizer) {
      if (data.current_loop_position <= 1) {
        visualizer.innerText = "[YOU] INITIAL BUY-IN ACTIVE";
      } else {
        visualizer.innerText = `[YOU] ➔ L/R SYNC SEEDING (${data.current_loop_position}/5)`;
      }
    }
  } else {
    activeMarketState.currentMode = "SELLER";
    if (targetElement) targetElement.innerText = `ACTIVE SELLER ID: ${data.active_seller_id}`;
    if (countElement) countElement.innerText = `${data.current_loop_position - 5} / 8 SALES TEAM`;
    if (statusElement) {
      statusElement.innerText = "STATUS // DIRECT NETTING";
      statusElement.className = "font-bold text-sm mb-4 text-yellow-500";
    }
  }

  // Render Track List dynamically using structural layout sniffing
  renderTrackAssetGrid(data.portal_tier, data.album_assets.title);
  logExecutionStream(data);
}

/**
 * Dynamically builds the album asset ledger items on the right section
 * Uses structural element sniffing to find your track column container perfectly.
 */
function renderTrackAssetGrid(tier, albumTitle) {
  // Sniffs out the column box based on the static header text inside your layout
  let assetContainer = null;
  const headings = document.getElementsByTagName('h3');
  
  for (let i = 0; i < headings.length; i++) {
    if (headings[i].innerText.includes("TRACK ASSET TRACKER")) {
      assetContainer = headings[i].parentElement;
      break;
    }
  }

  // Fallback selector check if the header wrapper changes
  if (!assetContainer) {
    assetContainer = document.querySelector('.w-full.bg-black\\/40.p-4.border.border-white\\/10');
  }

  if (!assetContainer) return; // Safeguard if page is layout shifting during initialization

  // Track list setup based on your 90-second song structural rules
  const tier1Tracks = ["G. Soul - Intro Vibe", "Blue Flame - Kinetic Velocity", "Ms. Butta - Velvet Smooth", "Shanae' - Silent Cries"];
  const tier2Tracks = ["G. Smooth - Street Royalty", "Blue Flame - Heavy Smoke", "Ms. Butta - Gold Dust", "Shanae' - Gansta Lyfe"];
  const tracksToRender = tier === 2 ? tier2Tracks : tier1Tracks;

  let htmlContent = `
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xs tracking-widest text-white/40 uppercase font-mono">TRACK ASSET TRACKER</h3>
      <span class="text-xs text-emerald-400 font-mono">SINGLES: $1.00</span>
    </div>
    <div class="text-sm font-bold text-emerald-400 mb-2 font-mono uppercase">${albumTitle || "ALBUM STREAM"}</div>
    <div class="space-y-2 font-mono text-xs">
  `;

  tracksToRender.forEach((track, idx) => {
    htmlContent += `
      <div class="flex justify-between items-center border-b border-white/5 py-2 hover:bg-white/5 px-1 transition-all">
        <span class="text-white/80">${idx + 1}. ${track}</span>
        <button class="text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded text-[10px] hover:bg-emerald-400/20" onclick="alert('Asset purchase routine initialized')">BUY SINGLE</button>
      </div>
    `;
  });

  htmlContent += `</div>`;
  assetContainer.innerHTML = htmlContent;
}

function logExecutionStream(data) {
  const flow = document.getElementById('flow-content');
  if (!flow) return;

  const entry = document.createElement('div');
  entry.className = "border-b border-white/5 py-1 text-white opacity-70 flex justify-between font-mono text-xs";
  
  if (data.current_loop_position <= 5) {
    entry.innerHTML = `<span>GATEWAY // SYNCED PORTAL TIER ${data.portal_tier} DATA FEED</span><span class="text-emerald-400">ACTIVE</span>`;
  } else {
    entry.innerHTML = `<span>ROUTING // LIVE NODE CONNECTED TO [${data.active_seller_id}]</span><span class="text-yellow-500">LIVE</span>`;
  }

  flow.prepend(entry);
  if (flow.children.length > 3) {
    flow.removeChild(flow.lastChild);
  }
}

function hijackPortalControls() {
  window.switchPortal = function(idx) {
    const requestedTier = idx + 1;
    
    document.querySelectorAll('.portal-btn').forEach(btn => btn.classList.remove('active'));
    const clickedButton = document.getElementById(`p-${idx}`);
    if (clickedButton) clickedButton.classList.add('active');
    
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
