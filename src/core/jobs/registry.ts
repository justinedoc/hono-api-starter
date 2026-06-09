import type { Worker } from "bullmq";

export const activeWorkers: Worker[] = [];

export function registerWorker(worker: Worker) {
	activeWorkers.push(worker);
}
