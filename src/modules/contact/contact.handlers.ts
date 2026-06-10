import * as httpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/core/lib/types";
import type {
	CreateRoute,
	GetByIdRoute,
	ListRoute,
	RemoveRoute,
	UpdateRoute,
} from "@/modules/contact/contact.routes";
import {
	getContact,
	listContacts,
	processContactSubmission,
	removeContact,
	updateContact,
} from "./contact.service";

export const create: AppRouteHandler<CreateRoute> = async (c) => {
	const payload = c.req.valid("json");

	const result = await processContactSubmission(payload);

	return c.json(
		{ success: true, message: "Submitted successfully.", data: result },
		httpStatusCodes.CREATED,
	);
};

export const getById: AppRouteHandler<GetByIdRoute> = async (c) => {
	const { id } = c.req.valid("param");

	const result = await getContact({ id });

	return c.json(
		{
			success: true,
			message: "Contact record retrieved successfully",
			data: result,
		},
		httpStatusCodes.OK,
	);
};

export const list: AppRouteHandler<ListRoute> = async (c) => {
	const { page, limit, status } = c.req.valid("query");

	const result = await listContacts({ page, limit, status });

	return c.json(
		{
			success: true,
			message: "Contact list retrieved successfully",
			...result,
		},
		httpStatusCodes.OK,
	);
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
	const { id } = c.req.valid("param");

	const { status } = c.req.valid("json");

	const result = await updateContact({
		id,
		status,
	});

	return c.json(
		{ success: true, message: "Contact updated successfully", data: result },
		httpStatusCodes.OK,
	);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
	const { id } = c.req.valid("param");

	await removeContact({ id });

	return c.json(
		{ success: true, message: "Record deleted." },
		httpStatusCodes.OK,
	);
};
