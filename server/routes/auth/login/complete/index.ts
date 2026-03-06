import { z } from 'zod';
import { useChallenge } from '~/utils/challenge';
import { useAuth } from '~/utils/auth';

const completeSchema = z.object({
  publicKey: z.string(),
  challenge: z.object({
    code: z.string(),
    signature: z.string(),
  }),
  device: z.string().max(500).min(1),
});

export default defineEventHandler(async event => {
  // Temporarily disabled during database migration
  return { message: "Migrating to Firebase, route temporarily disabled" };
});
