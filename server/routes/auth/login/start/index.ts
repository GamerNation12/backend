import { z } from 'zod';
import { useChallenge } from '~/utils/challenge';
import { db } from '~/utils/firebase';

const startSchema = z.object({
  publicKey: z.string(),
});

export default defineEventHandler(async event => {
  const body = await readBody(event);

  const result = startSchema.safeParse(body);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request body',
    });
  }

  const querySnapshot = await db.collection('users').where('public_key', '==', body.publicKey).get();
  if (querySnapshot.empty) {
    throw createError({
      statusCode: 401,
      message: 'User cannot be found',
    });
  }
  const user = querySnapshot.docs[0].data();

  const challenge = useChallenge();
  const challengeCode = await challenge.createChallengeCode('login', 'mnemonic');

  return {
    challenge: challengeCode.code,
  };
});
