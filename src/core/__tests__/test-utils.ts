import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/core/db";
import { auth } from "@/core/lib/auth";
import { user } from "@/modules/auth/auth.schema";

export async function createAuthCookie(role = "user") {
	const testEmail = `test-${randomUUID()}@example.com`;

	const res = await auth.api.signUpEmail({
		body: {
			email: testEmail,
			password: "TestPassword123!",
			name: "Test User",
		},
		asResponse: true,
	});

	if (!res.ok) {
		throw new Error("Failed to generate test session via Better Auth");
	}

	const cookies = res.headers.getSetCookie();
	const sessionCookie = cookies.find((c) =>
		c.includes("better-auth.session_token"),
	);

	if (!sessionCookie) {
		throw new Error("No session cookie found in Better Auth response");
	}

	const cookieString = sessionCookie.split(";")[0];

	await db
		.update(user)
		.set({ role: role !== "user" ? role : undefined, emailVerified: true })
		.where(eq(user.email, testEmail));

	return { cookieString };
}
