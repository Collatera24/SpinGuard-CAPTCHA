const express = require('express');
const cors = require('cors');
const { generateCaptcha, verifyCaptcha } = require('./captcha');

const app = express();
const PORT = 3000;

app.use(cors()); // Allow requests from any origin
app.use(express.json()); // Parse JSON request bodies

// Endpoint to generate a new CAPTCHA
app.get('/api/captcha', (req, res) => {
    const { captchaId, code } = generateCaptcha();
    res.json({ captchaId, captcha: code });
});

// Endpoint to verify CAPTCHA input
app.post('/api/verify', (req, res) => {
    const { captchaId, userInput } = req.body;
    const result = verifyCaptcha(captchaId, userInput);
    res.json(result);
});

// Start the server
app.listen(PORT, () => {
    console.log(`CAPTCHA API running at http://localhost:${PORT}`);
});
