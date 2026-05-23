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
    // Generate organic market velocity waves swinging up toward the $130 peak ceiling
    const targetPeak = 130.00;
    const timeFactor = Date.now() / 1800;
    const wave = (Math.sin(timeFactor) + 1) / 2; // Normalizes wave between 0 and 1
    const dynamicPrice = floorPrice + (wave * (targetPeak - floorPrice));
    
    tickerDisplay.innerText = `$${dynamicPrice.toFixed(2)}`;
  }, 150); // High-frequency terminal tick speed
}
