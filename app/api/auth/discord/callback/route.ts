import { NextResponse } from "next/server";
import { encrypt } from "@/app/lib/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.redirect(new URL("/", request.url));

  try {
    // 1. Exchange OAuth Code for User's Access Token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) throw new Error("Failed to get token");

    // 2. Get User Info
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const user = await userRes.json();

    // 3. AUTO-JOIN GUILD
    // We use the BOT TOKEN to authorize this request, but we pass the USER'S access token in the body.
    const guildId = process.env.DISCORD_GUILD_ID!;
    const botToken = process.env.DISCORD_BOT_TOKEN!;

    // Minimal error handling on join to not block login if bot privileges are missing
    try {
      await fetch(
        `https://discord.com/api/guilds/${guildId}/members/${user.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bot ${botToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: tokenData.access_token,
          }),
        },
      );
    } catch (err) {
      console.error("Auto-join failed:", err);
    }

    // 4. Create Session & Redirect
    const session = await encrypt({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    });

    const response = NextResponse.redirect(new URL("/rsvp", request.url));
    response.cookies.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }
}
