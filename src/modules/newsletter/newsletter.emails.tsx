/** @jsxImportSource react */

import type { Logger } from "pino";
import { Button, Heading, Section, Text } from "react-email";
import type z from "zod";
import { EmailLayout } from "@/core/emails/layout";
import { sendEmail } from "@/core/emails/mailer.client";
import type { insertSubscriberSchema } from "./newsletter.schema";

export const NewsletterWelcomeTemplate = () => {
	return (
		<EmailLayout previewText="Welcome to our updates">
			<Heading className="m-0 text-[24px] font-bold tracking-tight text-zinc-900">
				Welcome to the newsletter
			</Heading>

			<Text className="mt-[16px] text-[16px] leading-[24px] text-zinc-600">
				Thank you for subscribing to our mailing list. We are glad to have you
				with us.
			</Text>

			<Text className="mt-[12px] text-[16px] leading-[24px] text-zinc-600">
				We will share regular updates, technical insights, and new feature
				releases directly to your inbox.
			</Text>

			<Section className="mt-[32px]">
				<Button
					href="https://example.com"
					className="inline-block rounded-md bg-zinc-900 px-[24px] py-[12px] text-[14px] font-semibold text-white no-underline"
				>
					Visit Our Website
				</Button>
			</Section>
		</EmailLayout>
	);
};

export const sendNewsletterWelcomeEmail = async (
	logger: Logger,
	payload: z.infer<typeof insertSubscriberSchema>,
) => {
	return sendEmail(logger, {
		to: payload.email,
		subject: "Welcome to our community!",
		react: <NewsletterWelcomeTemplate />,
	});
};
