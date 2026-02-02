import express, { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import type { AuthRequest } from "../middleware/authMiddleware";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
const JWT_SECRET =
  process.env.JWT_SECRET || process.env.SESSION_SECRET || "default_secret";

interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  error?: string;
}

interface DiscordUserResponse {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
  verified?: boolean;
}

// 1. Redirect to Discord
router.get("/discord", (req: Request, res: Response) => {
  const scope = "identify email guilds.join";
  const state = Math.random().toString(36).substring(7); // Simple state for PoC
  // In production, store state in cookie/session to verify later

  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID!,
    redirect_uri: DISCORD_REDIRECT_URI!,
    response_type: "code",
    scope: scope,
    state: state,
  });

  const url = `https://discord.com/api/oauth2/authorize?${params.toString()}`;

  res.redirect(url);
});

// 2. Callback
router.get("/discord/callback", async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    res.status(400).send("No code provided");
    return;
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID || "",
        client_secret: DISCORD_CLIENT_SECRET || "",
        grant_type: "authorization_code",
        code: String(code),
        redirect_uri: DISCORD_REDIRECT_URI || "",
      }),
    });

    const tokenData = (await tokenResponse.json()) as DiscordTokenResponse;

    if (tokenData.error) {
      console.error("Discord Token Error:", tokenData);
      res.status(400).send("Error fetching token from Discord");
      return;
    }

    // Get User Info
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = (await userResponse.json()) as DiscordUserResponse;

    // Upsert User
    let user = await User.findOne({ discordId: userData.id });
    if (!user) {
      user = await User.create({
        discordId: userData.id,
        username: userData.username,
        discriminator: userData.discriminator,
        avatar: userData.avatar ?? undefined,
        email: userData.email,
      });
    } else {
      // Update fields if changed
      user.username = userData.username;
      user.discriminator = userData.discriminator;
      user.avatar = userData.avatar ?? undefined;
      user.email = userData.email;
      await user.save();
    }

    // Create JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Always true for SameSite=None
      sameSite: "none", // Required for cross-domain (Vercel -> Render)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend app with Token in parameter (for Bearer auth fallback)
    res.redirect(`${process.env.FRONTEND_URL}/app/apply?token=${token}`);
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 3. Me endpoint (for frontend check)
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ authenticated: false });
      return;
    }
    res.json({
      authenticated: true,
      user: {
        id: user._id,
        discordId: user.discordId,
        username: user.username,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ success: true });
});

export default router;
