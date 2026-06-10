import { createRouter } from "@/core/lib/create-app";
import * as handlers from "./upload.handlers";
import * as routes from "./upload.routes";

const router = createRouter()
	.openapi(routes.initUploadRoute, handlers.initUpload)
	.openapi(routes.deleteFileRoute, handlers.deleteFile);

export default router;
