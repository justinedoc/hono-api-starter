import * as httpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/core/lib/types";
import type {
	ListRoute,
	RemoveRoute,
	SubscribeRoute,
} from "./newsletter.routes";
import {
	listSubscribers,
	subscribeToNewsletter,
	unsubscribe,
} from "./newsletter.service";

export const subscribe: AppRouteHandler<SubscribeRoute> = async (c) => {
	const payload = c.req.valid("json");

	const result = await subscribeToNewsletter(payload);

	return c.json(
		{ success: true, message: "Subscribed successfully", data: result },
		httpStatusCodes.CREATED,
	);
};

export const list: AppRouteHandler<ListRoute> = async (c) => {
	const payload = c.req.valid("query");

	const result = await listSubscribers(payload);

	return c.json(
		{ success: true, message: "Subscribers retrieved successfully", ...result },
		httpStatusCodes.OK,
	);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
	const payload = c.req.valid("param");

	await unsubscribe(payload);

	return c.json(
		{ success: true, message: "Unsubscribed successfully" },
		httpStatusCodes.OK,
	);
};
