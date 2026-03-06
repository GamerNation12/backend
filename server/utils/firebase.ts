import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // 1. Grab the raw strings from the new, simpler environment variables
    const privateKey = process.env.FB_PRIVATE_KEY as string;
    const clientEmail = process.env.FB_CLIENT_EMAIL as string;
    const projectId = "poised-beach-312401"; // Hardcoded from your file name

    if (!privateKey || !clientEmail) {
      throw new Error("Missing FB_PRIVATE_KEY or FB_CLIENT_EMAIL");
    }

    // 2. Fix the newline issue manually just in case
    const formattedKey = privateKey.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formattedKey,
      }),
    });
    
    console.log('🔥 Firebase Admin successfully initialized with Direct Keys');
  } catch (error) {
    console.error('❌ Firebase Init Error:', error);
  }
}

export const db = admin.firestore();