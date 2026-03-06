import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const rawAccount = process.env.FIREBASE_SERVICE_ACCOUNT as string;
    const serviceAccount = JSON.parse(rawAccount);
    
    // 🔥 THE MAGIC FIX: Convert literal "\n" strings back into actual line breaks
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('🔥 Firebase Admin successfully initialized');
  } catch (error) {
    console.error('❌ Firebase Init Error: Make sure FIREBASE_SERVICE_ACCOUNT is a valid JSON string', error);
  }
}

export const db = admin.firestore();