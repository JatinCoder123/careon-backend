import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);
export const verifyGoogleToken = async (idToken) => {
  if (!idToken) {
    throw new Error("ID token is required");
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_WEB_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      emailVerified: payload.email_verified,
    };
  } catch (error) {
    throw new Error("Failed to verify Google token");
  }
};
