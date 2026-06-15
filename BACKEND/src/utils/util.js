function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpHtml(otp) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
</head>
<body>
    <div>
        <h1>OTP Verification</h1>
        <h2>Your OTP Code</h2>

        <div>
            ${otp}
        </div>

        <p>Please use this code to verify your email address.</p>

        <p>This OTP will expire in 2 minutes.</p>
    </div>
</body>
</html>`;
}

module.exports = {
    generateOtp,
    getOtpHtml,
};