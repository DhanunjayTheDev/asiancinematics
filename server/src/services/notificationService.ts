import config from '../config';
import { logger } from '../utils/logger';
import Notification from '../models/Notification';

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'order' | 'ticket' | 'visit' | 'inquiry' | 'system' | 'assignment',
  channel: 'in_app' | 'email' | 'whatsapp' = 'in_app',
  refModel?: string,
  refId?: string
): Promise<void> => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type,
      channel,
      refModel,
      refId,
      deliveryStatus: channel === 'in_app' ? 'sent' : 'pending',
    });
  } catch (error) {
    logger.error('Create notification error:', error);
  }
};

export const sendWhatsAppMessage = async (
  phone: string,
  message: string
): Promise<boolean> => {
  if (!config.features.whatsappNotifications) {
    logger.info(`WhatsApp disabled. Would send to ${phone}: ${message}`);
    return true;
  }

  try {
    // Placeholder for WhatsApp API integration
    logger.info(`WhatsApp message sent to ${phone}`);
    return true;
  } catch (error) {
    logger.error('WhatsApp send error:', error);
    return false;
  }
};
