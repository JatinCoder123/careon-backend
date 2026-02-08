// import twilio from "twilio";

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// export const sendSMS = async (to, message) => {
//   try {
//     const response = await client.messages.create({
//       body: message,
//       from: process.env.TWILIO_PHONE,
//       to,
//     });

//     console.log("✅ SMS sent:", response.sid);
//     return true;
//   } catch (error) {
//     console.error("❌ Twilio SMS error:", error.message);
//     throw new Error("Failed to send SMS");
//   }
// };
