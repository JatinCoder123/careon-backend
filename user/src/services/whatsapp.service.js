import axios from "axios";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN; // 🔒 keep in env
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;


export const sendWhatsApp = async ({
    to,
    userName,
    locationUrl,
    battery,
}) => {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",

                // ⚠️ Use TEMPLATE in production
                type: "template",

                to: to.replace(/\D/g, ""), // clean number

                template: {
                    name: "emergency_alert", // 👈 your approved template name
                    language: { code: "en" },
                    components: [
                        {
                            type: "body",
                            parameters: [
                                { type: "text", text: userName },
                                { type: "text", text: locationUrl },
                                { type: "text", text: `${battery}%` },
                            ],
                        },
                    ],
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error(
            "WhatsApp Error:",
            error.response?.data || error.message
        );

        return {
            success: false,
            error: error.response?.data || error.message,
        };
    }
};