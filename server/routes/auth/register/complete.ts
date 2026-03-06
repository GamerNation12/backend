import { db } from '~/server/utils/firebase';
import { useChallenge } from '~/server/utils/challenge';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { code, publicKey, signature, username } = body;

  const challenge = useChallenge();

  try {
    // 1. Verify the 12-word phrase (challenge code) exists in Firestore
    await challenge.verifyChallengeCode(code, publicKey, signature, 'registration', 'mnemonic');

    // 2. Create the actual user profile
    const userRef = db.collection('users').doc(publicKey); 
    await userRef.set({
      id: publicKey,
      username: username || 'New User',
      createdAt: new Date().toISOString(),
      // P-Stream uses the publicKey as the "password" identifier
    });

    return {
      success: true,
      user: { id: publicKey, username }
    };
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      message: error.message || 'Verification failed',
    });
  }
});