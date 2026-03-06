import { randomUUID } from 'crypto';
import { useAuth } from '~/utils/auth';
import { z } from 'zod';

const groupOrderSchema = z.array(z.string());

export default defineEventHandler(async event => {
  // Temporarily disabled during DB migration
  return { message: "Migrating to Firebase, route temporarily disabled" };
}); 