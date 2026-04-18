const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const prizeModal = document.getElementById('prizeModal');
const closeModal = document.querySelector('.close-modal');

let prizes = [];
let isSpinning = false;
let currentRotation = 0;

// Load Logo
const logoImg = new Image();
logoImg.src = "https://img.capalangresource.com/images/public/cpwl/banner/WLLB7/GENERAL/banner_20250426050341681.webp";
logoImg.onload = () => drawWheel();

// Initialize Prizes from Engine
if (window.InternalEngine) {
    prizes = window.InternalEngine.getPrizes();
}

const numSegments = prizes.length;
const segmentAngle = 360 / numSegments;

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSegments; i++) {
        const startAngle = (i * segmentAngle * Math.PI) / 180;
        const endAngle = ((i + 1) * segmentAngle * Math.PI) / 180;

        // Draw Segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        // Segment Colors
        ctx.fillStyle = prizes[i].color ? prizes[i].color : ((i % 2 === 0) ? '#2d0a4e' : '#1a0b30');
        ctx.fill();

        // Segment Border
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Text/Icon
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + (segmentAngle * Math.PI) / 360);
        
        // Text Shadow for readability
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'black';
        
        // Render Icon
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Outfit';
        ctx.textAlign = 'right';
        ctx.fillText(prizes[i].i, radius - 30, 10);

        // Render Label
        ctx.fillStyle = '#d4af37';
        ctx.font = 'bold 14px Outfit';
        ctx.fillText(prizes[i].n, radius - 70, 10);
        
        ctx.restore();
    }

    // Outer Glow Ring (Premium Border)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Inner shadow ring for depth
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 5, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Center Logo
    const logoSize = 100;
    ctx.save();
    // Shadow for center logo
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    
    // Draw white/gold circle backing for logo
    ctx.beginPath();
    ctx.arc(centerX, centerY, logoSize/2 + 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.stroke();

    if (logoImg.complete) {
        ctx.drawImage(logoImg, centerX - logoSize/2, centerY - logoSize/2, logoSize, logoSize);
    }
    ctx.restore();
}

function spin() {
    if (isSpinning) return;
    
    // Auth Checks
    if (typeof currentUser === 'undefined' || !currentUser) {
        alert("Please login first!");
        return;
    }
    if (currentUser.spins <= 0) {
        alert("You have 0 spins remaining.");
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;

    // Get Result from Secure Engine
    const result = window.InternalEngine.determineResult();
    const winningIndex = result.index;

    // Calculate rotation to land on the segment
    // Ensure it rotates at least 5-10 times for effect
    const extraSpins = 5 + Math.floor(Math.random() * 5);
    
    // Calculate the angle exactly. 
    // Pointer is at the top (negative 90 deg relative to canvas 0)
    // We need to rotate so the winning segment is at -90deg.
    // segment center = (index * segmentAngle) + (segmentAngle/2)
    const targetSegmentCenter = (winningIndex * segmentAngle) + (segmentAngle / 2);
    const stopAngle = 360 - targetSegmentCenter + 270; // 270 offsets to top pointer
    
    const totalRotation = currentRotation + (extraSpins * 360) + (stopAngle % 360);

    gsap.to(canvas, {
        duration: 5,
        rotation: totalRotation,
        ease: "power4.out",
        onUpdate: () => {
            // Optional: Audio click effect logic here
        },
        onComplete: () => {
            currentRotation = totalRotation;
            showPrize(result.details);
            
            // Generate Verify Code and Save to DB
            if (window.AppDB) {
                window.AppDB.saveClaim(result.details.name);
            }

            isSpinning = false;
            spinBtn.disabled = false;
        }
    });
}

function showPrize(details) {
    document.getElementById('prizeIcon').innerText = details.icon;
    document.getElementById('prizeName').innerText = details.name;
    prizeModal.style.display = 'flex';
    
    // Confetti!
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#ffffff', '#4b0082']
    });
}

// Event Listeners
spinBtn.addEventListener('click', spin);

closeModal.addEventListener('click', () => {
    prizeModal.style.display = 'none';
});

window.onclick = (event) => {
    if (event.target == prizeModal) {
        prizeModal.style.display = 'none';
    }
};

// Initial Call
drawWheel();
