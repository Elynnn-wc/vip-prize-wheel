/* VIP Fortune Wheel - Secure Probability Engine */
(function() {
    // DEVELOPER AREA: Edit prizes and specific percentages here.
    // 0 weight means it will NEVER be selected randomly.
    // To test the 0% prizes, tap the "FORTUNE WHEEL" title 5 times
    // to enter Dev Mode (password 231879), where you can force win them!
    const PRIZES = [
        { name: "3.88", icon: "💸", color: "#4682B4", weight: 20 },
        { name: "5.88", icon: "💸", color: "#8A2BE2", weight: 30 },
        { name: "8.88", icon: "💸", color: "#FFD700", weight: 40 },
        { name: "18.88", icon: "💎", color: "#FF4D4D", weight: 8 },
        { name: "38.88", icon: "💎", color: "#FF9F40", weight: 2 },
        { name: "88.88", icon: "🔥", color: "#2D0A4E", weight: 0 },
        { name: "168.88", icon: "👑", color: "#1A0B30", weight: 0 }
    ];

    window.InternalEngine = {
        getPrizes: function() { 
            return PRIZES.map(p => ({ n: p.name, i: p.icon, color: p.color })); 
        },
        determineResult: function() {
            // Normal Random Physics
            const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0);
            let random = Math.random() * totalWeight;
            
            for (let i = 0; i < PRIZES.length; i++) {
                if (PRIZES[i].weight > 0) { // Ignore 0 weight explicitly
                    if (random < PRIZES[i].weight) {
                        return { index: i, details: { name: PRIZES[i].name, icon: PRIZES[i].icon } };
                    }
                    random -= PRIZES[i].weight;
                }
            }
            
            // Fallback (should theoretically never hit due to math, but just in case)
            return { index: 0, details: { name: PRIZES[0].name, icon: PRIZES[0].icon } }; 
        }
    };
})();
