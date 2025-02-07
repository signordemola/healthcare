// Generate a JWT token
import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

// Generate a JWT token with user role
export const generateToken = async (
  userId: string,
  role: string
): Promise<string> => {
  const token = await new SignJWT({ userId, role }) // Include role in payload
    .setProtectedHeader({ alg: "HS256" }) // Algorithm
    .setIssuedAt() // Issued now
    .setExpirationTime("1h") // Expires in 1 hour
    .setIssuer("your-app-name") // Issuer
    .setAudience("your-audience") // Audience
    .sign(SECRET_KEY); // Sign with secret key

  return token;
};

// Verify a JWT token
export async function decodeToken(token: string) {
  try {
    // Encode the JWT secret
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    // Verify and decode the token
    const { payload } = await jwtVerify(token, secret);

    // Return the decoded payload and success status
    return {
      success: true,
      payload,
      error: null,
    };
  } catch (error) {
    console.error("Token decoding failed:", error);

    // Return an error object
    return {
      success: false,
      payload: null,
      error: "Invalid or expired token",
    };
  }
}
