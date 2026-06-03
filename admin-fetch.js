// AITITRADE ADMIN SYSTEM CONTROLLER FRAMEWORK
const adminPartnerConfig = {
    0: { name: "QUEEN BUTTA", cashtag: "$QUEENBUTTAVALID", basePrice: 10.00 },
    1: { name: "GANSTA SMOOTH", cashtag: "$GANSTASMOOTH", basePrice: 20.00 },
    2: { name: "G. SMOOTH", cashtag: "$GSMOOTHLEGAL", basePrice: 30.00 },
    3: { name: "J. MARIE", cashtag: "$JMARIEMUSIC", basePrice: 40.00 },
    4: { name: "ROSELYN REYNOLDS", cashtag: "$ROSELYNJOY", basePrice: 50.00 }
};

// Simulation telemetry modeling real system metrics based on active 1-to-8 resale vectors
let adminEcosystemState = {
    0: { claimed: 5, gross: 50.00 },   // Queen Butta
    1: { claimed: 3, gross: 60.00 },   // Gansta Smooth
    2: { claimed: 8, gross: 240.00 },  // G. Smooth
    3: { claimed: 2, gross: 80.00 },   // J. Marie
    4: { claimed: 4, gross: 200.00 }   // Roselyn Reynolds
};

function renderAdminLedger() {
    const tableBody = document.getElementById('partner-ledger-rows');
    if (!tableBody) return;

    let html = "";
    let totalMarketSurplus = 0; // Your combined Brokerage + AI Royalty

    Object.keys(adminPartnerConfig).forEach(portalId => {
        const partner = adminPartnerConfig[portalId];
        const telemetry = adminEcosystemState[portalId];
        
        let grossSales = telemetry.gross;
        
        // 1. Brokerage Fee: Fixed $50 per $130 block
        let marketFee = grossSales * (50 / 130);
        
        // 2. Reseller Profit: Fixed $80 per $130 block
        let resellerProfit = grossSales * (80 / 130);
        
        // 3. AI Persona Royalty: 10% of the $50 Brokerage Fee
        let artistRoyalty = marketFee * 0.10; 
        
        // Your Total Market Surplus = Brokerage Fee + AI Royalty
        totalMarketSurplus += (marketFee + artistRoyalty);

        let cycleProgress = telemetry.claimed;
        let marketStatus = cycleProgress < 5 ? "MARKET PHASE (Direct)" : "RESELLER PHASE (Active)";
        let statusColor = cycleProgress < 5 ? "text-emerald-400" : "text-amber-400";

        html += `
        <tr class="hover:bg-emerald-500/5 transition-all">
            <td class="py-4 font-bold text-emerald-500/60 font-mono">PORTAL 0${parseInt(portalId) + 1}</td>
            <td class="py-4 font-bold">${partner.name}</td>
            <td class="py-4 text-center font-mono">${cycleProgress} / 13</td>
            <td class="py-4 text-right font-mono ${statusColor} font-bold">${marketStatus}</td>
            <td class="py-4 text-right font-mono text-emerald-400 font-bold">$${grossSales.toFixed(2)}</td>
            <td class="py-4 text-right font-mono text-rose-400 font-bold">$${resellerProfit.toFixed(2)}</td>
        </tr>`;
    });

    tableBody.innerHTML = html;
    document.getElementById('escrow-value').innerText = `$${totalMarketSurplus.toFixed(2)}`;
}

    tableBody.innerHTML = html;
    document.getElementById('escrow-value').innerText = `$${totalBrokerageProfit.toFixed(2)}`;
}

    tableBody.innerHTML = html;
    document.getElementById('escrow-value').innerText = `$${totalEcosystemEscrow.toFixed(2)}`;
}

window.selectPartnerForSettlement = function(name, amount) {
    document.getElementById('payee-name').value = name;
    document.getElementById('payee-amount').value = amount.toFixed(2);
};

window.processPayout = function(event) {
    event.preventDefault();
    const targetPartner = document.getElementById('payee-name').value;
    const disburseAmount = document.getElementById('payee-amount').value;
    const chosenGateway = document.getElementById('payout-gateway').value;

    if (!targetPartner || disburseAmount <= 0) {
        return alert("EXECUTION REJECTED: VALID TARGET ENDPOINT REQUESTED");
    }

    if (chosenGateway === "CASH_APP") {
        // Find partner config context to retrieve specific payment handle destination
        const partnerEntry = Object.values(adminPartnerConfig).find(p => p.name === targetPartner);
        if (partnerEntry) {
            // Generate immediate transaction breakout link mapping straight to mobile processing logic
            const cashAppSecureUrl = `https://cash.app/${partnerEntry.cashtag}/${disburseAmount}`;
            alert(`REDIRECTING SECURITY CLEARANCE BLOCK TO CASH APP TO DISBURSE $${disburseAmount} TO ${targetPartner}`);
            window.open(cashAppSecureUrl, '_blank');
        }
    } else {
        alert(`MANUAL TRANSACTION NOTED: SYSTEM BALANCES ADJUSTED FOR ${targetPartner}`);
    }
};

window.onload = () => { renderAdminLedger(); };
