import * as httpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/core/lib/types";
import type {
	AcceptInviteRoute,
	SendInviteRoute,
} from "@/modules/admin/admin.routes";
import { acceptAdminInvite, sendAdminInvite } from "./admin.service";

export const sendInviteHandler: AppRouteHandler<SendInviteRoute> = async (
	c,
) => {
	const payload = c.req.valid("json");

	const currentUser = c.var?.user;

	await sendAdminInvite({
		...payload,
		userId: currentUser?.id as string,
	});

	return c.json(
		{
			success: true,
			message: "Invitation sent successfully.",
		},
		httpStatusCodes.CREATED,
	);
};

export const acceptInviteHandler: AppRouteHandler<AcceptInviteRoute> = async (
	c,
) => {
	const payload = c.req.valid("json");

	const session = await acceptAdminInvite(payload);

	return c.json(
		{
			success: true,
			message: "Account created successfully.",
			data: { token: session.token },
		},
		httpStatusCodes.CREATED,
	);
};
