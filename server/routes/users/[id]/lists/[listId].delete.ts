import { useAuth } from '#imports';

export default defineEventHandler(async event => {
  // Temporarily disabled during migration
  return { message: "Migrating to Firebase, route temporarily disabled" };
});
