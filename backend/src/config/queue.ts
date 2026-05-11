import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const jobsQueue = new Queue('JobsQueue', { connection });
export const queueEvents = new QueueEvents('JobsQueue', { connection });

// Define Worker later in app startup or separate worker process
export const createWorker = (processor: any) => {
  return new Worker('JobsQueue', processor, { connection });
};
