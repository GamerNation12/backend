import { useAuth } from '#imports';

export default defineEventHandler(async event => {
  // Database disabled while migrating
  return { message: "Migrating to Firebase, route temporarily disabled" };
});
