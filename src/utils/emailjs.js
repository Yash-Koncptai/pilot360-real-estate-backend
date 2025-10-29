const emailjs = require("@emailjs/nodejs");

async function sendEmail({ toEmail, toName, subject, data }) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const fromName = "Pilot360";

  let templateId;
  let templateParams = {
    to_email: toEmail,
    to_name: toName || toEmail,
    from_name: fromName,
  };

  let templateIds = process.env.EMAILJS_TEMPLATE_ID.split(",").map((f) =>
    f.trim()
  );

  switch (subject) {
    case "otp":
      templateId = templateIds[0];
      templateParams.otp = data.otp;
      break;

    case "credentials":
      templateId = templateIds[1];
      templateParams.user_email = data.email;
      templateParams.user_password = data.password;
      break;

    default:
      throw new Error(`Unknown email subject: ${subject}`);
  }

  if (!serviceId || !templateId || !publicKey) {
    throw new Error(
      `EmailJS env vars missing: EMAILJS_SERVICE_ID, EMAILJS_${subject.toUpperCase()}_TEMPLATE_ID, EMAILJS_PUBLIC_KEY`
    );
  }

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey: publicKey,
      privateKey: privateKey,
    });

    console.log(
      `${subject} email sent successfully:`,
      response.status,
      response.text
    );
    return { success: true };
  } catch (error) {
    console.error(`Failed to send ${subject} email:`, error);
    throw error;
  }
}

module.exports = { sendEmail };
