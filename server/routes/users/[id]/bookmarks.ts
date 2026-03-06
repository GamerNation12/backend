import { useAuth } from '~/utils/auth';
import { z } from 'zod';

// Define bookmarks type since Prisma is removed
interface bookmarks {
  tmdb_id: number;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

const bookmarkMetaSchema = z.object({
  title: z.string(),
  year: z.number().optional(),
  poster: z.string().optional(),
  type: z.enum(['movie', 'show']),
});

const bookmarkDataSchema = z.object({
  tmdbId: z.string(),
  meta: bookmarkMetaSchema,
  group: z.union([z.string(), z.array(z.string())]).optional(),
  favoriteEpisodes: z.array(z.string()).optional(),
});

export default defineEventHandler(async event => {
  // All database logic disabled for migration
  return { message: "Migrating to Firebase, route temporarily disabled" };
});
