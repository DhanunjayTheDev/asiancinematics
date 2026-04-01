import nodemailer from 'nodemailer';
import config from '../config';
import { logger } from '../utils/logger';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  if (!config.features.emailNotifications) {
    logger.info(`Email notification disabled. Would send to: ${to}`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: `"${config.email.fromName}" <${config.email.fromEmail}>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    logger.error('Email send error:', error);
    return false;
  }
};

export const sendOrderConfirmationEmail = async (
  to: string,
  orderNumber: string,
  totalAmount: number
): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a56db;">Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
      <p>We'll notify you when your order is being processed.</p>
      <hr />
      <p style="color: #6b7280; font-size: 12px;">Asian Cinematics</p>
    </div>
  `;
  return sendEmail(to, `Order Confirmed - ${orderNumber}`, html);
};

export const sendStatusUpdateEmail = async (
  to: string,
  type: string,
  refNumber: string,
  status: string
): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a56db;">Status Update</h2>
      <p>Your ${type} <strong>${refNumber}</strong> status has been updated to: <strong>${status}</strong></p>
      <hr />
      <p style="color: #6b7280; font-size: 12px;">Asian Cinematics</p>
    </div>
  `;
  return sendEmail(to, `${type} Update - ${refNumber}`, html);
};
