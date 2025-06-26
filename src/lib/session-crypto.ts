// lib/utils/session-crypto.ts
import { EncryptJWT, jwtDecrypt } from "jose";

const secret = Buffer.from(process.env.SESSION_SECRET!, "hex");
const alg = "dir";
const enc = "A256GCM";

export async function encryptSession(data: any): Promise<string> {
	return await new EncryptJWT({ data })
		.setProtectedHeader({ alg, enc })
		.setIssuedAt()
		.encrypt(secret);
}

export async function decryptSession(token: string): Promise<any | null> {
	try {
		const { payload } = await jwtDecrypt(token, secret);
		return payload.data;
	} catch (err) {
		console.error("Failed to decrypt session", err);
		return null;
	}
}
