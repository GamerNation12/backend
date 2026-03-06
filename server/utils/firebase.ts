import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';

if (!getApps().length) {
  const serviceAccount = JSON.parse(readFileSync(join(process.cwd(), 'firebase-service-account.json'), 'utf8'));
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const db = getFirestore();

// Dummy prisma to prevent build errors during migration
export const prisma = {} as any;