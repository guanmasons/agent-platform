import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { KEYCLOAK_REALM, KEYCLOAK_SERVER_URL } from "../config";

// Extend the Express Request interface to include the 'user' property
declare global {
    namespace Express {
      interface Request {
        user?: any; // Or define a more specific type
      }
    }
  }

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("Authorization header is missing");
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  try {
    // get keycloak public key from the following endpoint: http://localhost:8080/realms/ai-agent-realm
    const publicKeyResponse = await axios.get(`${KEYCLOAK_SERVER_URL}/realms/${KEYCLOAK_REALM}`);
    const publicKey = publicKeyResponse.data.public_key;
    const userinfoResponse = await axios.get(
      `${KEYCLOAK_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    req.user = userinfoResponse.data; // Attach user info to request
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).send("Invalid token");
  }
};