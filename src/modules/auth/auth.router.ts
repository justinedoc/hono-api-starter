import { auth } from "@/core/lib/auth";
import { createRouter } from "@/core/lib/create-app";

const router = createRouter().on(["POST", "GET"], "/*", (c) => {
	return auth.handler(c.req.raw);
});

export default router;
