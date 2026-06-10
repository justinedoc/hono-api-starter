import { createRouter } from "@/core/lib/create-app";
import { me, remove, update } from "./user.handlers";
import {
	deleteAccountRoute,
	getProfileRoute,
	updateProfileRoute,
} from "./user.routes";

const router = createRouter()
	.openapi(getProfileRoute, me)
	.openapi(updateProfileRoute, update)
	.openapi(deleteAccountRoute, remove);

export default router;
