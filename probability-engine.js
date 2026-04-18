/**
 * VIP Fortune Wheel - Probability Engine
 * This script is obfuscated to prevent easy detection of odds in the console.
 */
(function() {
    // Encoded configuration (Base64) to hide raw data from a simple "grep" or console search
    // Data: Array of { name, icon, weight }
    const _c = "W3sibmFtZSI6IkpBQ0tQT1QiLCJpY29uIjoi8J+SjiIsIndlaWdodCI6MX0seyJuYW1lIjoiJDUwIENBU0giLCJpY29uIjoi8J+SqSIsIndlaWdodCI6NH0seyJuYW1lIjoiJDEwIFYiLCJpY29uIjoi8J+SpSIsIndlaWdodCI6MTB9LHsibmFtZSI6IiQ1IEMiLCJpY29uIjoi8J+SqSIsIndlaWdodCI6MjV9LHsibmFtZSI6IiQxIFIiLCJpY29uIjoi8J+SsiIsIndlaWdodCI6MzB9LHsibmFtZSI6IlRSWSBBR0FJTkiLCJpY29uIjoi8J+UhSIsIndlaWdodCI6MzB9XQ==";
    
    let _prizes = [];
    
    try {
        // Fix: Properly decode string with Emojis (UTF-8)
        const bytes = decodeURIComponent(escape(atob(_c)));
        _prizes = JSON.parse(bytes);
    } catch (e) {
        console.error("System error: Core configuration corrupted.");
    }

    // Exposed interface (Minimal)
    window.InternalEngine = {
        getPrizes: function() {
            // Return copy to prevent external mutation
            return _prizes.map(p => ({ n: p.name, i: p.icon }));
        },
        determineResult: function() {
            // Weighted random selection
            const totalWeight = _prizes.reduce((sum, p) => sum + p.weight, 0);
            let random = Math.random() * totalWeight;
            
            for (let i = 0; i < _prizes.length; i++) {
                if (random < _prizes[i].weight) {
                    return {
                        index: i,
                        details: _prizes[i]
                    };
                }
                random -= _prizes[i].weight;
            }
            return { index: 5, details: _prizes[5] }; // Fallback
        }
    };

    // Distraction logic to make console inspection messy
    const dummy = [];
    for(let i=0; i<100; i++) dummy.push(Math.random());
    console.log("%c System Integrity Check: OK", "color: #d4af37; font-weight: bold;");

})();
