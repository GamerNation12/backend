import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FB_PRIVATE_KEY;
    const clientEmail = process.env.FB_CLIENT_EMAIL;
    const projectId = "poised-beach-312401";

    if (!privateKey || !clientEmail) {
      throw new Error("Missing FB_PRIVATE_KEY or FB_CLIENT_EMAIL");
    }

    // This handles both literal newlines and escaped \n characters
    const formattedKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/"/g, '') // Remove accidental quotes
      .trim();

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formattedKey,
      }),
    });
    
    console.log('🔥 Firebase Admin successfully initialized');
  } catch (error) {
    console.error('❌ Firebase Init Error:', error);
  }
}

export const db = admin.firestore();