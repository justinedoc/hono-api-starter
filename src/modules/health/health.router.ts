import { createRouter } from "@/core/lib/create-app";
import { check } from "./health.handlers";
import { checkRoute } from "./health.routes";

const router = createRouter().openapi(checkRoute, check);

export default router;
