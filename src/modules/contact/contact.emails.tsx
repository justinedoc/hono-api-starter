/** @jsxImportSource react */

import type { Logger } from "pino";
import { Heading, Section, Text } from "react-email";
import type z from "zod";
import { EmailLayout } from "@/core/emails/layout";
import { sendEmail } from "@/core/emails/mailer.client";
import { env } from "@/env";
import type { insertContactSchema } from "./contact.schema";

type ContactEmailTemplateProps = z.infer<typeof insertContactSchema>;

export function ContactNotificationTemplate({
	firstName,
	email,
	message,
}: ContactEmailTemplateProps) {
	return (
		<EmailLayout previewText={`New contact request from ${firstName}`}>
			<Heading className="m-0 text-[24px] font-bold tracking-tight text-zinc-900">
				New Contact Submission
			</Heading>

			{/* User Details Box */}
			<Section className="mt-[24px] rounded-md border border-solid border-zinc-200 bg-zinc-50 p-[16px]">
				<Text className="m-0 text-[14px] leading-[24px] text-zinc-600">
					<strong className="text-zinc-900 font-semibold">Name:</strong>{" "}
					{firstName}
				</Text>
				<Text className="m-0 text-[14px] leading-[24px] text-zinc-600">
					<strong className="text-zinc-900 font-semibold">Email:</strong>{" "}
					{email}
				</Text>
			</Section>

			{/* Message Body */}
			<Section className="mt-[24px]">
				<Text className="m-0 text-[16px] font-semibold text-zinc-900">
					Message:
				</Text>
				<Text className="mt-[8px] whitespace-pre-wrap text-[16px] leading-[24px] text-zinc-600">
					{message}
				</Text>
			</Section>
		</EmailLayout>
	);
}

export const sendContactNotificationEmail = async (
	logger: Logger,
	payload: z.infer<typeof insertContactSchema>,
) => {
	return sendEmail(logger, {
		to: env.SUPER_ADMIN_EMAIL,
		subject: `New Contact Request: ${payload.firstName}`,
		react: <ContactNotificationTemplate {...payload} />,
	});
};

export interface ReplyEmailPayload {
	originalMessageId: string;
	clientEmail: string;
	clientFirstName: string;
	replyMessage: string;
}

export const replyToContactEmail = async (
	logger: Logger,
	payload: ReplyEmailPayload,
) => {
	const threadId = payload.originalMessageId.startsWith("<")
		? payload.originalMessageId
		: `<${payload.originalMessageId}>`;

	return sendEmail(logger, {
		to: payload.clientEmail,
		subject: `Re: New Contact Request: ${payload.clientFirstName}`,
		headers: {
			"In-Reply-To": threadId,
			References: threadId,
		},
		react: (
			<EmailLayout previewText="Your proposal details">
				<Heading className="m-0 text-[24px] font-bold tracking-tight text-zinc-900">
					Proposal Response
				</Heading>
				<Section className="mt-[24px]">
					<Text className="m-0 whitespace-pre-wrap text-[16px] leading-[24px] text-zinc-600">
						{payload.replyMessage}
					</Text>
				</Section>
			</EmailLayout>
		),
	});
};
