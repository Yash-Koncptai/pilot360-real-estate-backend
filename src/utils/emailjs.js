const emailjs = require("@emailjs/nodejs");

async function sendOtpEmail({ toEmail, toName, otp }) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const fromName = "Pilot360";

  if (!serviceId || !templateId || !publicKey) {
    throw new Error(
      "EmailJS env vars missing: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY"
    );
  }

  const templateParams = {
    to_email: toEmail,
    to_name: toName || toEmail,
    from_name: fromName,
    otp: otp,
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey: publicKey,
      privateKey: privateKey,
    });

    console.log("OTP email sent successfully:", response.status, response.text);
    return { success: true };
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw error;
  }
}

module.exports = { sendOtpEmail };
