/** biome-ignore-all lint/suspicious/noExplicitAny: <version conflict in bullmq> */
import { type Job, Queue, Worker } from "bullmq";
import { pino } from "pino";
import { registerWorker } from "@/core/jobs/registry";
import { redis } from "@/core/redis";
import { sendNewsletterWelcomeEmail } from "@/modules/newsletter/newsletter.emails";
import { sendAdminInviteEmail } from "@/modules/admin/admin.emails";

export const emailQueue = new Queue("email-queue", {
	connection: redis as any,
});

const backgroundLogger = pino({ name: "background-worker" });

export const emailWorker = new Worker(
	"email-queue",
	async (job: Job) => {
		backgroundLogger.info(`Processing job ${job.id} of type ${job.name}`);

		if (job.name === "newsletter-welcome-email") {
			const result = await sendNewsletterWelcomeEmail(backgroundLogger, {
				email: job.data.email,
			});

			if (!result.success) {
				backgroundLogger.error(
					{ error: result?.error },
					"Failed to send newsletter welcome email",
				);
				throw new Error("Failed to send newsletter welcome email");
			}
    }
		
		if (job.name === "admin-invite-email") {
			const result = await sendAdminInviteEmail(backgroundLogger, {
				email: job.data.email,
				name: job.data.name,
				inviteLink: job.data.inviteLink,
			});

			if (!result.success) {
				backgroundLogger.error(
					{ error: result?.error },
					"Failed to send admin invite email",
				);
				throw new Error("Failed to send admin invite email");
			}
		}
	},
	{ connection: redis as any },
);

emailWorker.on("failed", (job, err) => {
	backgroundLogger.error({ err, jobId: job?.id }, "Job failed");
});

registerWorker(emailWorker);
