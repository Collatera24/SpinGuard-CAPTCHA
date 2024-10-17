const { v4: uuidv4 } = require('uuid');

const captchas = {}; // Store captchas temporarily in memory

// Generate a random CAPTCHA code
function generateCaptcha(length = 7) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    const captchaId = uuidv4(); // Unique ID for each CAPTCHA
    captchas[captchaId] = { code: result, expiresAt: Date.now() + 60000 }; // Expires in 1 minute
    return { captchaId, code: result };
}

// Verify CAPTCHA input
function verifyCaptcha(captchaId, userInput) {
    const captcha = captchas[captchaId];
    if (!captcha) {
        return { success: false, message: 'CAPTCHA not found or expired.' };
    }

    if (Date.now() > captcha.expiresAt) {
        delete captchas[captchaId];
        return { success: false, message: 'CAPTCHA expired.' };
    }

    if (captcha.code === userInput) {
        delete captchas[captchaId]; // Remove after successful verification
        return { success: true, message: 'CAPTCHA verified successfully.' };
    }

    return { success: false, message: 'Invalid CAPTCHA.' };
}

module.exports = { generateCaptcha, verifyCaptcha };
