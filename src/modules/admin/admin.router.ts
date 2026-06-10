import { createRouter } from "@/core/lib/create-app";
import * as handlers from "./admin.handlers";
import * as routes from "./admin.routes";

const router = createRouter()
	.openapi(routes.sendInvite, handlers.sendInviteHandler)
	.openapi(routes.acceptInvite, handlers.acceptInviteHandler);

export default router;
