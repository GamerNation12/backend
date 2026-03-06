import { useAuth } from '#imports';
import { z } from 'zod';

export default defineEventHandler(async event => {
  // Handler disabled during migration
  return { message: "Migrating to Firebase, route temporarily disabled" };
});
