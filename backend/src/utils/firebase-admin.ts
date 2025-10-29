import admin from "firebase-admin";

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
  process.env;

if (!admin.apps.length) {
  try {
    if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
      const pk = FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n").replace(
        /^"|"$/g,
        ""
      );

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: pk,
        }),
      });

      console.log(
        `[FirebaseAdmin] Initialized with service account (project_id=${FIREBASE_PROJECT_ID})`
      );
    }
  } catch (err) {
    console.error("[FirebaseAdmin] Failed to initialize:", err);
    throw err;
  }
}

export default admin;
