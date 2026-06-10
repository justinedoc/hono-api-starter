/** @jsxImportSource react */

import type { Logger } from "pino";
import { Button, Heading, Section, Text } from "react-email";
import { EmailLayout } from "@/core/emails/layout";
import { sendEmail } from "@/core/emails/mailer.client";

export const AdminInviteTemplate = ({
	name,
	inviteLink,
}: {
	name: string;
	inviteLink: string;
}) => {
	return (
		<EmailLayout previewText="You have been invited to join the admin team">
			<Heading className="m-0 text-[24px] font-bold tracking-tight text-zinc-900">
				Hello, {name}
			</Heading>

			<Text className="mt-[16px] text-[16px] leading-[24px] text-zinc-600">
				You have been invited to join the admin team for our platform.
			</Text>

			<Section className="mt-[32px]">
				<Button
					href={inviteLink}
					className="inline-block rounded-md bg-zinc-900 px-[24px] py-[12px] text-[14px] font-semibold text-white no-underline"
				>
					Accept Invitation
				</Button>
			</Section>
		</EmailLayout>
	);
};

export const sendAdminInviteEmail = async (
	logger: Logger,
	payload: { name: string; email: string; inviteLink: string },
) => {
	return sendEmail(logger, {
		to: payload.email,
		subject: "Invitation to Join the Admin Team",
		react: (
			<AdminInviteTemplate
				name={payload.name}
				inviteLink={payload.inviteLink}
			/>
		),
	});
};
