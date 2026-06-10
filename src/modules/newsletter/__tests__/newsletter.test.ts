import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { testClient } from "hono/testing";
import { describe, expect, it, vi } from "vitest";
import { createAuthCookie } from "@/core/__tests__/test-utils";
import { db } from "@/core/db";
import { emailQueue } from "@/core/jobs/email.job";
import createApp from "@/core/lib/create-app";
import router from "@/modules/newsletter/newsletter.router";
import { subscriber } from "@/modules/newsletter/newsletter.schema";

vi.mock("@/core/jobs/email.job", () => ({
	emailQueue: {
		add: vi.fn(),
	},
}));

describe("Newsletter API", () => {
	const client = testClient(createApp().route("/", router));

	it("should subscribe a new user and queue a welcome email", async () => {
		const testEmail = `newsletter.test-${randomUUID()}@example.com`;

		const response = await client.api.newsletter.$post({
			json: { email: testEmail },
		});

		expect(response.status).toBe(201);

		const savedSub = await db.query.subscriber.findFirst({
			where: eq(subscriber.email, testEmail),
		});
		expect(savedSub).toBeDefined();
		expect(savedSub?.status).toBe("subscribed");

		expect(emailQueue.add).toHaveBeenCalledWith(
			"newsletter-welcome-email",
			{ email: testEmail },
			expect.any(Object),
		);
	});

	it("should allow an admin to list subscribers via cookie auth", async () => {
		const { cookieString } = await createAuthCookie("super_admin");

		const response = await client.api.newsletter.$get(
			{ query: { page: "1", limit: "10" } },
			{
				headers: {
					Cookie: cookieString,
					Host: "localhost:3000",
					Origin: "http://localhost:3000",
				},
			},
		);

		expect(response.status).toBe(200);
		// biome-ignore lint/suspicious/noExplicitAny: test payload
		const data = (await response.json()) as any;
		expect(data.data).toBeInstanceOf(Array);
		expect(data.meta.total).toBeDefined();
	});

	it("should block unauthenticated users from listing subscribers", async () => {
		const response = await client.api.newsletter.$get({
			query: { page: "1", limit: "10" },
		});

		expect(response.status).toBe(401);
	});
});
