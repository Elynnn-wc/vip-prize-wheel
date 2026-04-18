const fs = require('fs');

const prizes = [
  {name: 'JACKPOT', icon: '💎', weight: 1},
  {name: '$50 CASH', icon: '💸', weight: 4},
  {name: '$10 V', icon: '💥', weight: 10},
  {name: '$5 C', icon: '💸', weight: 25},
  {name: '$1 R', icon: '💲', weight: 30},
  {name: 'TRY AGAIN', icon: '🥺', weight: 30}
];

// In browser: decodeURIComponent(escape(atob(str)))
// To encode for browser: btoa(unescape(encodeURIComponent(JSON.stringify(prizes))))
// Because btoa is not in normal node, we use this standard equivalent:
const encodedForAtob = Buffer.from(unescape(encodeURIComponent(JSON.stringify(prizes))), 'binary').toString('base64');

console.log("BASE64=", encodedForAtob);

const newEngine = `/**
 * VIP Fortune Wheel - Probability Engine
 */
(function() {
    const _c = "${encodedForAtob}";
    let _prizes = [];
    try {
        const decoded = decodeURIComponent(escape(atob(_c)));
        _prizes = JSON.parse(decoded);
    } catch (e) {
        console.error("System error: Core configuration corrupted.", e);
    }
    window.InternalEngine = {
        getPrizes: function() { return _prizes; },
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
`;

fs.writeFileSync('C:/Users/HP/.gemini/antigravity/scratch/prize-wheel/js/probability-engine.js', newEngine);
