import type { Logger } from "pino";
import type { ReactNode } from "react";
import { Resend } from "resend";
import { env } from "@/env";

export type SendEmailOptions = {
	to: string | string[];
	subject: string;
	react: ReactNode;
	from?: string;
	headers?: Record<string, string>;
};

export const sendEmail = async (logger: Logger, options: SendEmailOptions) => {
	if (env.NODE_ENV !== "production") {
		logger.info(
			{
				to: options.to,
				subject: options.subject,
				headers: options.headers,
				message: options.react?.toString(),
			},
			"Skipped sending email in development mode.",
		);
		return { success: true };
	}

	const resend = new Resend(env.RESEND_API_KEY);

	const defaultFrom = `Project <${env.SENDER_EMAIL}>`;

	try {
		const { data, error } = await resend.emails.send({
			from: options.from || defaultFrom,
			to: Array.isArray(options.to) ? options.to : [options.to],
			subject: options.subject,
			headers: options.headers,
			react: options.react,
		});

		if (error) {
			logger.error({ error, options }, "Resend API rejected the email");
			return { success: false, error };
		}

		logger.info({ id: data?.id, to: options.to }, "Email sent successfully");
		return { success: true, data };
	} catch (error) {
		logger.error({ error, options }, "Unexpected fatal error sending email");
		return { success: false, error };
	}
};
