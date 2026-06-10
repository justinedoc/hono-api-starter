import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { db } from "@/core/db";
import { auth } from "@/core/lib/auth";
import { PERMISSIONS } from "@/core/lib/permissions";
import { env } from "@/env";
import { user } from "@/modules/auth/auth.schema";

config();

async function seedSuperAdmin() {
	console.log(`Checking if Super Admin exists...`);

	const [existingUser] = await db
		.select()
		.from(user)
		.where(eq(user.email, env.SUPER_ADMIN_EMAIL));

	const allPermissions = Object.values(PERMISSIONS);

	if (existingUser) {
		console.log(
			"✅ Super Admin already exists. Seeding skipped and updating permissions",
		);

		await db
			.update(user)
			.set({
				permissions: allPermissions,
			})
			.where(eq(user.id, existingUser.id));

		console.log("Super Admin permissions elevated successfully.");
		process.exit(0);
	}

	console.log("Creating new Super Admin account...");

	const newSession = await auth.api.signUpEmail({
		body: {
			email: env.SUPER_ADMIN_EMAIL,
			password: env.SUPER_ADMIN_PASSWORD,
			name: "Super Admin",
		},
	});

	if (!newSession?.user?.id) {
		console.error("Failed to create user via Auth API.");
		process.exit(1);
	}

	await db
		.update(user)
		.set({
			role: "super_admin",
			permissions: allPermissions,
			emailVerified: true,
		})
		.where(eq(user.id, newSession.user.id));

	console.log("Super Admin created and privileges elevated successfully.");
	process.exit(0);
}

seedSuperAdmin().catch((err) => {
	console.error("Fatal Error:", err);
	process.exit(1);
});
