let currentUser = null;
let devModeActive = false;
let secretClicks = 0;
let secretTimer;

const loginScreen = document.getElementById('loginScreen');
const appMain = document.getElementById('appMain');
const devModeScreen = document.getElementById('devModeScreen');

// --- SECRET DEV MODE TRIGGER ---
document.getElementById('secretTrigger').addEventListener('click', () => {
    secretClicks++;
    clearTimeout(secretTimer);
    
    // Tap 5 times quickly to trigger
    if (secretClicks >= 5) {
        devModeScreen.style.display = 'flex';
        secretClicks = 0;
    }
    
    secretTimer = setTimeout(() => { secretClicks = 0; }, 1000);
});

document.getElementById('devCancelBtn').addEventListener('click', () => {
    devModeScreen.style.display = 'none';
});

document.getElementById('devLoginBtn').addEventListener('click', () => {
    const pass = document.getElementById('devPassInput').value;
    if (pass === '231879') {
        devModeActive = true;
        devModeScreen.style.display = 'none';
        document.getElementById('devControls').style.display = 'block';
        
        // Force login without saving to DB
        currentUser = { id: "DEV-MODE", spins: 999999 };
        loginScreen.style.display = 'none';
        appMain.style.display = 'flex';
        document.getElementById('displayPlayerId').innerText = "DEVELOPER";
    } else {
        alert("Access Denied");
    }
});


// --- UTILS ---
function getSGTDate() {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Singapore' }).format(new Date());
}

// --- PLAYER LOGIN ---
document.getElementById('loginBtn').addEventListener('click', async () => {
    const id = document.getElementById('playerIdInput').value.trim();
    const phone = document.getElementById('playerPhoneInput').value.trim();
    
    if (!id || !phone || phone.length !== 8) {
        document.getElementById('loginError').innerText = "Please enter a valid Player ID and 8-digit Phone (+65).";
        document.getElementById('loginError').style.display = 'block';
        return;
    }
    
    document.getElementById('loginError').style.display = 'none';
    const today = getSGTDate();
    
    if (window.FB && window.FB.db) {
        try {
            const userRef = window.FB.db.collection("users").doc(id);
            const doc = await userRef.get();
            
            if (doc.exists) {
                const data = doc.data();
                if (data.phone !== phone) {
                    document.getElementById('loginError').innerText = "Incorrect Phone Number for this ID.";
                    document.getElementById('loginError').style.display = 'block';
                    return;
                }
                
                // Daily Reset Logic
                if (data.lastSpinDate !== today) {
                    // New day! Reset spin to 1
                    await userRef.update({ 
                        spins: 1, 
                        lastSpinDate: today 
                    });
                    currentUser = { id: id, spins: 1 };
                } else {
                    currentUser = { id: id, spins: data.spins || 0 };
                }
            } else {
                // New user registration
                currentUser = { id: id, spins: 1 };
                await userRef.set({ 
                    phone: phone, 
                    spins: 1, 
                    lastSpinDate: today,
                    createdAt: new Date() 
                });
            }
        } catch(e) {
            console.warn("DB error, using offline logic.", e);
            currentUser = { id: id, spins: 1 };
        }
    } else {
        console.warn("Firebase not connected. Using offline logic.");
        currentUser = { id: id, spins: 1 };
    }
    
    if (currentUser.spins <= 0) {
        document.getElementById('loginError').innerText = "You have 0 spins remaining today. Please come back tomorrow!";
        document.getElementById('loginError').style.display = 'block';
        return;
    }

    // Success
    loginScreen.style.display = 'none';
    appMain.style.display = 'flex';
    document.getElementById('displayPlayerId').innerText = currentUser.id;
});


document.getElementById('logoutBtn').addEventListener('click', () => {
    currentUser = null;
    devModeActive = false;
    document.getElementById('devControls').style.display = 'none';
    appMain.style.display = 'none';
    loginScreen.style.display = 'flex';
});

// --- VERIFY CODE GENERATION & DB SAVE ---
async function generateAndSaveCode(prizeName) {
    // Generate Random Code e.g. VIP-4F8X
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "VIP-";
    for(let i=0; i<5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    document.getElementById("verifyCodeDisplay").innerText = code;
    
    if (devModeActive) {
        console.log("DEV MODE: Claim not saved to DB.", { code, prizeName });
        return; 
    }

    // DB save
    if (window.FB && window.FB.db) {
        try {
            await window.FB.db.collection("claims").add({
                userId: currentUser.id,
                prize: prizeName,
                code: code,
                timestamp: new Date(),
                status: "Pending"
            });
            
            // Deduct spin
            await window.FB.db.collection("users").doc(currentUser.id).update({
                spins: firebase.firestore.FieldValue.increment(-1)
            });
            currentUser.spins--;
            
        } catch(e) {
            console.error("Failed to save claim to DB", e);
        }
    }
}

// Make accessible to wheel.js
window.AppDB = {
    saveClaim: generateAndSaveCode,
    isDevMode: () => devModeActive,
    getForceValue: () => document.getElementById('forcePrizeSelect').value
};
