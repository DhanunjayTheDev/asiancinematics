import { Queue, Worker } from 'bullmq';
import { getRedis } from '../config/redis';
import { sendEmail } from '../services/emailService';
import { sendWhatsAppMessage } from '../services/notificationService';
import Notification from '../models/Notification';
import { logger } from '../utils/logger';

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
};

// Notification Queue
export const notificationQueue = new Queue('notifications', { connection });

export const initWorkers = (): void => {
  const notificationWorker = new Worker(
    'notifications',
    async (job) => {
      const { type, data } = job.data;

      try {
        if (type === 'email') {
          const success = await sendEmail(data.to, data.subject, data.html);
          if (!success) throw new Error('Email send failed');

          if (data.notificationId) {
            await Notification.findByIdAndUpdate(data.notificationId, {
              deliveryStatus: 'sent',
            });
          }
        } else if (type === 'whatsapp') {
          const success = await sendWhatsAppMessage(data.phone, data.message);
          if (!success) throw new Error('WhatsApp send failed');

          if (data.notificationId) {
            await Notification.findByIdAndUpdate(data.notificationId, {
              deliveryStatus: 'sent',
            });
          }
        }
      } catch (error) {
        logger.error(`Notification job failed:`, error);

        if (data.notificationId) {
          await Notification.findByIdAndUpdate(data.notificationId, {
            deliveryStatus: 'failed',
            error: (error as Error).message,
          });
        }

        throw error;
      }
    },
    {
      connection,
      concurrency: 5,
      limiter: { max: 10, duration: 1000 },
    }
  );

  notificationWorker.on('completed', (job) => {
    logger.info(`Notification job ${job.id} completed`);
  });

  notificationWorker.on('failed', (job, err) => {
    logger.error(`Notification job ${job?.id} failed: ${err.message}`);
  });

  logger.info('BullMQ workers initialized');
};
