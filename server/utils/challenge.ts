import { randomUUID } from 'crypto';
import { db } from './firebase';
import nacl from 'tweetnacl';

// Challenge code expires in 10 minutes
const CHALLENGE_EXPIRY_MS = 10 * 60 * 1000;

export function useChallenge() {
  const createChallengeCode = async (flow: string, authType: string) => {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + CHALLENGE_EXPIRY_MS);
    const code = randomUUID();

    const data = {
      code,
      flow,
      auth_type: authType,
      created_at: now,
      expires_at: expiryDate,
    };

    await db.collection('challenge_codes').doc(code).set(data);

    return data;
  };

  const verifyChallengeCode = async (
    code: string,
    publicKey: string,
    signature: string,
    flow: string,
    authType: string
  ) => {
    const doc = await db.collection('challenge_codes').doc(code).get();
    if (!doc.exists) {
      throw new Error('Invalid challenge code');
    }
    const challengeCode = doc.data();
    if (!challengeCode) {
      throw new Error('Invalid challenge code');
    }

    if (challengeCode.flow !== flow || challengeCode.auth_type !== authType) {
      throw new Error('Invalid challenge flow or auth type');
    }

    if (new Date(challengeCode.expires_at) < new Date()) {
      throw new Error('Challenge code expired');
    }

    const isValidSignature = verifySignature(code, publicKey, signature);
    if (!isValidSignature) {
      throw new Error('Invalid signature');
    }

    await db.collection('challenge_codes').doc(code).delete();

    return true;
  };

  const verifySignature = (data: string, publicKey: string, signature: string) => {
    try {
      let normalizedSignature = signature.replace(/-/g, '+').replace(/_/g, '/');
      while (normalizedSignature.length % 4 !== 0) {
        normalizedSignature += '=';
      }

      let normalizedPublicKey = publicKey.replace(/-/g, '+').replace(/_/g, '/');
      while (normalizedPublicKey.length % 4 !== 0) {
        normalizedPublicKey += '=';
      }

      const signatureBuffer = Buffer.from(normalizedSignature, 'base64');
      const publicKeyBuffer = Buffer.from(normalizedPublicKey, 'base64');
      const messageBuffer = Buffer.from(data);

      return nacl.sign.detached.verify(messageBuffer, signatureBuffer, publicKeyBuffer);
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  };

  return {
    createChallengeCode,
    verifyChallengeCode,
  };
}
