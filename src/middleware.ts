// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { jwtVerify } from "jose";
import { Profile } from "./generated/prisma";
import { User } from "@supabase/supabase-js";
import { decryptSession } from "./lib/session-crypto";
import { cookies } from "next/dist/server/request/cookies";

const secret = Buffer.from(process.env.SESSION_SECRET!, "hex");

const intlMiddleware = createIntlMiddleware(routing);

async function verifyJWT(token: string) {
	try {
		const { payload } = await jwtVerify(token, secret);
		return payload;
	} catch (e) {
		console.error("JWT verification failed:", e);
		return null;
	}
}

export async function getSession(): Promise<{
	isAuthenticated: boolean;
	profile: Profile | null;
	user: User | null;
} | null> {
	const cookiesSession = await cookies();
	const sessionToken = cookiesSession.get("session")?.value;
	if (!sessionToken) return null;

	return await decryptSession(sessionToken);
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/api")) {
		if (pathname.includes("auth")) return NextResponse.next();
		const authHeader = request.headers.get("authorization");

		if (!authHeader?.startsWith("Bearer ")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const token = authHeader.split(" ")[1];
		const payload = await verifyJWT(token);

		if (!payload) {
			return NextResponse.json({ error: "Invalid token" }, { status: 401 });
		}

		return NextResponse.next();
	}

	return intlMiddleware(request);
}

export const config = {
	matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
