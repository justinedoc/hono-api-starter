import { createId } from "@paralleldrive/cuid2";

type prefixes = "usr" | "srv" | "bkg" | "con" | "sub" | "ivt";

export default function generateId(prefix: prefixes) {
	return `${prefix}_${createId()}`;
}
