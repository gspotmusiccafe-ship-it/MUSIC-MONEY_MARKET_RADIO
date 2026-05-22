/**
 * AITITRADE User Terminal Data Engine
 * Connects the front-end Bloomberg-style terminal to the Apps Script Ledger Gateway.
 */

const TERMINAL_CONFIG = {
  // Your live verified API endpoint
  gatewayUrl: "https://script.google.com/macros/s/AKfycbzs5eeFvYmE-bn6vDb0Mp49Xw5zD3XfgPiq3g9ce_K0N5BXe3OXDO2g2eP3HBxwdvS3/exec",
  defaultTier: 1,
  pollingIntervalMs: 30000 // Refresh market data every 30 seconds
};

// Global state tracking object to prevent redundant UI paint cycles
let currentTerminalState = {
  tier: null,
  activeSeller: null,
  loopPosition: null
};

/**
 * Executes a network fetch request to retrieve live dual-tier market states.
 * @param {number} tier - The active Portal Tier (1 for $10, 2 for $20)
 */
async function fetchTerminalMarketData(tier = TERMINAL_CONFIG.defaultTier) {
  displayTerminalStatus("FETCHING LIVE FEED...");
  
  try {
    // Construct safe URL with tier routing parameters
    const requestUrl = `${TERMINAL_CONFIG.gatewayUrl}?tier=${tier}`;
    
    const response = await fetch(requestUrl, {
      method: 'GET',
      mode: 'cors', // Required for cross-origin Apps Script routing
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`NETWORK_HTTP_ERROR: Status ${response.status}`);
    }

    const marketState = await response.json();
    
    if (marketState.status === "SUCCESS") {
      renderTerminalInterface(marketState);
    } else {
      throw new Error(marketState.message || "UNKNOWN_GATEWAY_ERROR");
    }

  } catch (error) {
    console.error("Critical Terminal Network Error:", error);
    displayTerminalStatus("DATA FEED OFFLINE");
    flashErrorIndicator();
  }
}

/**
 * Updates the structural text elements of your Bloomberg-style interface.
 * @param {Object} data - The validated market state payload from the ledger gateway.
 */
function renderTerminalInterface(data) {
  // Update state tracking variables
  currentTerminalState.tier = data.portal_tier;
  currentTerminalState.activeSeller = data.active_seller_id;
  currentTerminalState.loopPosition = data.current_loop_position;

  // 1. Render Live Asset Registry Information
  document.getElementById("display-album-title").innerText = data.album_assets.title.toUpperCase();
  
  const coverElement = document.getElementById("display-cover-image");
  if (coverElement && data.album_assets.cover_image !== "NOT_SET") {
    coverElement.src = data.album_assets.cover_image;
  }
  
  const audioTrackSource = document.getElementById("terminal-audio-source");
  const audioPlayer = document.getElementById("terminal-audio-player");
  if (audioTrackSource && audioPlayer && data.album_assets.audio_stream !== "NOT_SET") {
    if (audioTrackSource.src !== data.album_assets.audio_stream) {
      audioTrackSource.src = data.album_assets.audio_stream;
      audioPlayer.load(); // Forces HTML5 audio engine to buffer the fresh stream
    }
  }

  // 2. Render Financial Pricing Matrix Rules
  document.getElementById("display-cost-in").innerText = `$${data.payment_rules.cost_in.toFixed(2)}`;
  document.getElementById("display-payout-target").innerText = `$${data.payment_rules.payout_target.toFixed(2)}`;

  // 3. Render Dynamic Escrow Routing Accounts
  document.getElementById("display-seller-id").innerText = data.active_seller_id;
  document.getElementById("handle-cashapp").innerText = data.payment_credentials.cash_app;
  document.getElementById("handle-applepay").innerText = data.payment_credentials.apple_pay;

  // 4. Render Kinetic Position Indicators (Market Position Scrolling Ticker)
  const positionString = `POSITION ${data.current_loop_position} OF 13`;
  document.getElementById("display-loop-position").innerText = positionString;
  
  // Calculate specific metrics for network visual queues
  const progressionPercentage = ((data.current_loop_position / 13) * 100).toFixed(0);
  const progressBar = document.getElementById("terminal-progress-bar");
  if (progressBar) {
    progressBar.style.width = `${progressionPercentage}%`;
  }

  // Update central ticker board feed notice
  displayTerminalStatus(`SYSTEM ONLINE // PORTAL_TIER_${data.portal_tier}`);
}

/**
 * Updates the terminal's status display bar.
 */
function displayTerminalStatus(message) {
  const statusBar = document.getElementById("terminal-status-ticker");
  if (statusBar) {
    statusBar.innerText = message.toUpperCase();
  }
}

/**
 * Visually alerts user via terminal elements if a data mismatch or failure occurs.
 */
function flashErrorIndicator() {
  const feedIndicator = document.getElementById("terminal-feed-status-light");
  if (feedIndicator) {
    feedIndicator.style.backgroundColor = "#ff0033"; // Alert Crimson Red
    feedIndicator.classList.add("flash-animation");
  }
}

/**
 * Interactive Terminal Event Listeners: Handles Tier switching commands
 */
function initializeTerminalControls() {
  const tierOneButton = document.getElementById("btn-tier-1");
  const tierTwoButton = document.getElementById("btn-tier-2");

  if (tierOneButton) {
    tierOneButton.addEventListener("click", () => {
      fetchTerminalMarketData(1);
    });
  }

  if (tierTwoButton) {
    tierTwoButton.addEventListener("click", () => {
      fetchTerminalMarketData(2);
    });
  }

  // Boot up the Initial Default Market Feed
  fetchTerminalMarketData(TERMINAL_CONFIG.defaultTier);

  // Establish continuous market streaming sequence loop
  setInterval(() => {
    fetchTerminalMarketData(currentTerminalState.tier || TERMINAL_CONFIG.defaultTier);
  }, TERMINAL_CONFIG.pollingIntervalMs);
}

// Attach controller directly to your web application initialization routine
document.addEventListener("DOMContentLoaded", initializeTerminalControls);
