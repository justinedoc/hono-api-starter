import { createRouter } from "@/core/lib/create-app";
import * as handlers from "./newsletter.handlers";
import * as routes from "./newsletter.routes";

const router = createRouter()
	.openapi(routes.subscribe, handlers.subscribe)
	.openapi(routes.list, handlers.list)
	.openapi(routes.remove, handlers.remove);

export default router;
