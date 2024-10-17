let lastCursorPos = { x: 0, y: 0 };
let mouseMoved = false;
let captcha = '';
let captchaExpires = false;
let captchaLength = 7; // Default length of CAPTCHA
let attemptsLeft = 3; // Limit CAPTCHA attempts to 3
let canSpinAgain = true; // Tracks if the user can spin again
let expirationTimeout; // For handling CAPTCHA expiration timeout
let refreshTimeout; // For handling CAPTCHA refresh timeout after expiration

// Disable the submit button until CAPTCHA is verified
const submitBtn = document.getElementById('submitBtn');
const spinBtn = document.getElementById('spinBtn');
submitBtn.disabled = true;

// Function to monitor mouse movement
document.addEventListener('mousemove', (e) => {
    const deltaX = Math.abs(e.pageX - lastCursorPos.x);
    const deltaY = Math.abs(e.pageY - lastCursorPos.y);

    if (deltaX > 5 || deltaY > 5) {
        mouseMoved = true; // Non-linear movement detected
    }
    lastCursorPos = { x: e.pageX, y: e.pageY };
});

// Function to generate a spin with CAPTCHA result
spinBtn.addEventListener('click', function () {
    if (!canSpinAgain) {
        alert("Please move your cursor away from the button before spinning again!");
        return;
    }

    if (!mouseMoved) {
        alert("Please move the mouse in a non-straight path before spinning!");
        return;
    }

    const wheel = document.getElementById('wheel');
    wheel.classList.add('spinning'); // Add spinning class to trigger rotation

    // Generate CAPTCHA after the spin (delay for the spin to complete)
    setTimeout(function () {
        captcha = generateCaptchaResult(captchaLength); // Generate CAPTCHA
        document.getElementById('captchaResult').innerText = captcha;
        wheel.classList.remove('spinning'); // Reset wheel state after spinning
        submitBtn.disabled = false; // Enable the submit button after CAPTCHA is spun
        startCaptchaExpiration(); // Start the expiration countdown
        canSpinAgain = false; // Prevent the user from spinning again without moving the cursor
    }, 4000); // 4 seconds delay to match the CSS spin animation
});

// Ensure the cursor moves out of the button area before allowing another spin
spinBtn.addEventListener('mouseleave', function () {
    canSpinAgain = true; // Allow the user to spin again after moving the cursor out
});

// Function to generate CAPTCHA result based on the length
function generateCaptchaResult(length) {
    let captchaResult = '';
    const sectors = [
        'A', 'B', 'C', 'D', 'E', 'F', '1', '2', '3', '4', '5', '6',
        '7', '8', '9', '0', 'G', 'H', 'I', 'J', 'K', 'L'
    ];

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * sectors.length);
        captchaResult += sectors[randomIndex];
    }

    return captchaResult;
}

// Function to start CAPTCHA expiration (e.g., 1 minute expiration time)
function startCaptchaExpiration() {
    // Clear any existing expiration timeout
    clearTimeout(expirationTimeout);
    clearTimeout(refreshTimeout);

    captchaExpires = false; // Reset expiration flag
    expirationTimeout = setTimeout(() => {
        captchaExpires = true;
        document.getElementById('captchaResult').innerText = "Expired. Please spin again.";
        submitBtn.disabled = true; // Disable the submit button after expiration
        startRefreshCountdown(); // Start countdown for CAPTCHA refresh after expiration
    }, 60000); // CAPTCHA expires after 1 minute (60000 ms)
}

// Function to handle CAPTCHA refresh 30 seconds after expiration
function startRefreshCountdown() {
    refreshTimeout = setTimeout(() => {
        resetCaptcha(); // Reset CAPTCHA to prompt user to spin again
    }, 30000); // CAPTCHA refreshes after 30 seconds of expiring (30000 ms)
}

// Form Submission with CAPTCHA validation
document.getElementById('captchaForm').addEventListener('submit', function (e) {
    const captchaInput = document.getElementById('captchaInput').value;

    if (captchaExpires) {
        e.preventDefault();
        alert("CAPTCHA expired! Please spin again.");
        return;
    }

    if (captchaInput !== captcha) {
        e.preventDefault(); // Prevent form submission if CAPTCHA doesn't match
        attemptsLeft -= 1;
        alert(`Invalid CAPTCHA! You have ${attemptsLeft} attempts left.`);
        
        // If attempts run out, reset CAPTCHA
        if (attemptsLeft === 0) {
            alert('You have exhausted your attempts. Please spin the CAPTCHA again.');
            resetCaptcha(); // Reset CAPTCHA after attempts are exhausted
            attemptsLeft = 3; // Reset attempts
        }
        return;
    } else {
        alert('CAPTCHA verified successfully!');
        submitBtn.disabled = true; // Disable the button again after submission to prevent multiple submissions
    }
});

// Function to reset the CAPTCHA manually (can be triggered after submission or timeout)
function resetCaptcha() {
    captcha = ''; // Reset the CAPTCHA code
    document.getElementById('captchaResult').innerText = "Please spin again.";
    submitBtn.disabled = true;
    mouseMoved = false;
    attemptsLeft = 3; // Reset the attempts count
}
