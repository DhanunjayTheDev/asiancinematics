import { Request } from 'express';
import AuditLog from '../models/AuditLog';

export const createAuditLog = async (
  req: Request,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>
): Promise<void> => {
  try {
    await AuditLog.create({
      user: req.user?._id,
      action,
      resource,
      resourceId,
      details,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
  } catch {
    // Audit log failure should not break the request
  }
};
