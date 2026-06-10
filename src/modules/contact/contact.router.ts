import { createRouter } from "@/core/lib/create-app";
import * as handlers from "./contact.handlers";
import * as routes from "./contact.routes";

const router = createRouter()
	.openapi(routes.create, handlers.create)
	.openapi(routes.getById, handlers.getById)
	.openapi(routes.list, handlers.list)
	.openapi(routes.update, handlers.update)
	.openapi(routes.remove, handlers.remove);

export default router;
