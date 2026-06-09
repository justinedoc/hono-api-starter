export const ROLES = {
	SUPER_ADMIN: "super_admin",
	ADMIN: "admin",
	USER: "user",
} as const;

/**
 *  Format: [action]: [resource]
 */
export const PERMISSIONS = {
	CREATE_SERVICE: "create:service",
	READ_SERVICE: "read:service",
	UPDATE_SERVICE: "update:service",
	DELETE_SERVICE: "delete:service",

	CREATE_BOOKING: "create:booking",
	READ_BOOKING: "read:booking",
	UPDATE_BOOKING: "update:booking",
	DELETE_BOOKING: "delete:booking",

	READ_CONTACT: "read:contact",
	UPDATE_CONTACT: "update:contact",
	DELETE_CONTACT: "delete:contact",

	MANAGE_NEWSLETTER: "manage:newsletter",

  MANAGE_ADMINS: "manage:admins",

  MANAGE_UPLOADS: "manage:uploads",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
