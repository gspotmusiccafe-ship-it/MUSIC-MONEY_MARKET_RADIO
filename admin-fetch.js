// MUSIC MARKET ADMIN SYSTEM CONTROLLER FRAMEWORK
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
    let totalEcosystemEscrow = 0;

    Object.keys(adminPartnerConfig).forEach(portalId => {
        const partner = adminPartnerConfig[portalId];
        const telemetry = adminEcosystemState[portalId];
        
        let grossDerived = telemetry.gross;
        let partnerSplit = grossDerived * 0.50; // Core 50% split value logic
        totalEcosystemEscrow += grossDerived;

        html += `
        <tr class="hover:bg-emerald-500/5 transition-all">
            <td class="py-4 font-bold text-emerald-500/60 font-mono">PORTAL 0${parseInt(portalId) + 1}</td>
            <td class="py-4 font-bold">${partner.name}<span class="block text-[10px] text-gray-500">${partner.cashtag}</span></td>
            <td class="py-4 text-center font-mono">${telemetry.claimed} / 8</td>
            <td class="py-4 text-right font-mono text-emerald-400 font-bold">$${grossDerived.toFixed(2)}</td>
            <td class="py-4 text-right font-mono text-emerald-400 font-bold">$${partnerSplit.toFixed(2)}</td>
            <td class="py-4 text-center">
                <button onclick="window.selectPartnerForSettlement('${partner.name}', ${partnerSplit})" class="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-1 rounded hover:bg-emerald-500 hover:text-black font-bold font-mono transition-all cursor-pointer">SELECT</button>
            </td>
        </tr>`;
    });

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
