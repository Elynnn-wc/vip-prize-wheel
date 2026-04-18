/**
 * VIP Fortune Wheel - Probability Engine
 */
(function() {
    const _c = "W3sibmFtZSI6IkpBQ0tQT1QiLCJpY29uIjoi8J+SjiIsIndlaWdodCI6MX0seyJuYW1lIjoiJDUwIENBU0giLCJpY29uIjoi8J+SuCIsIndlaWdodCI6NH0seyJuYW1lIjoiJDEwIFYiLCJpY29uIjoi8J+SpSIsIndlaWdodCI6MTB9LHsibmFtZSI6IiQ1IEMiLCJpY29uIjoi8J+SuCIsIndlaWdodCI6MjV9LHsibmFtZSI6IiQxIFIiLCJpY29uIjoi8J+SsiIsIndlaWdodCI6MzB9LHsibmFtZSI6IlRSWSBBR0FJTiIsImljb24iOiLwn6W6Iiwid2VpZ2h0IjozMH1d";
    let _prizes = [];
    
    try {
        const decoded = decodeURIComponent(escape(atob(_c)));
        _prizes = JSON.parse(decoded);
    } catch (e) {
        console.error("System error: Core configuration corrupted.", e);
    }
    
    window.InternalEngine = {
        getPrizes: function() { 
            // Re-mapped to support our front-end drawing logic!
            return _prizes.map(p => ({ n: p.name, i: p.icon })); 
        },
        determineResult: function() {
            const totalWeight = _prizes.reduce((sum, p) => sum + p.weight, 0);
            let random = Math.random() * totalWeight;
            for (let i = 0; i < _prizes.length; i++) {
                if (random < _prizes[i].weight) return { index: i, details: _prizes[i] };
                random -= _prizes[i].weight;
            }
            return { index: 0, details: _prizes[0] }; 
        }
    };
})();
