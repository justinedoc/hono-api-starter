import { eq } from "drizzle-orm";
import { testClient } from "hono/testing";
import { describe, expect, it } from "vitest";
import { db } from "@/core/db";
import { emailQueue } from "@/core/jobs/email.job";
import createApp from "@/core/lib/create-app";
import router from "@/modules/contact/contact.router";
import { contact } from "@/modules/contact/contact.schema";

describe("Contact API", () => {
	const client = testClient(createApp().route("/", router));

	it("should process submission and queue notification", async () => {
		const res = await client.api.contact.$post({
			json: {
				firstName: "Justin",
				lastName: "Onyiriuka",
				email: "justin@gmail.com",
				message: "This test client is amazing.",
			},
		});

		expect(res.status).toBe(201);

		const data = await res.json();
		expect(data.success).toBe(true);

		const savedContact = await db.query.contact.findFirst({
			where: eq(contact.email, "justin@gmail.com"),
		});
		expect(savedContact).toBeDefined();

		expect(emailQueue.add).toHaveBeenCalled();
	});
});
