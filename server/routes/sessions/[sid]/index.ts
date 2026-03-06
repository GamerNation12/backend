import { useAuth } from '~/utils/auth';
import { z } from 'zod';

const updateSessionSchema = z.object({
  deviceName: z.string().max(500).min(1).optional(),
});

export default defineEventHandler(async event => {
  // Session route temporarily disabled during migration
  return { message: "Migrating to Firebase, route temporarily disabled" };
});
