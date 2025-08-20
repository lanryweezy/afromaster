const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

const db = admin.firestore();

// Resolve Paystack secret from Firebase config or environment variable
const resolvePaystackSecret = () => {
  const configSecret = functions.config().paystack && functions.config().paystack.secret;
  return process.env.PAYSTACK_SECRET_KEY || configSecret;
};

exports.verifyPaystackTransaction = functions.https.onCall(
    async (data, context) => {
      if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "You must be logged in.",
        );
      }

      const { reference } = data;
      const url = `https://api.paystack.co/transaction/verify/${reference}`;
      const secret = resolvePaystackSecret();
      if (!secret) {
        throw new functions.https.HttpsError("failed-precondition", "Paystack secret not configured.");
      }

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${secret}`,
          },
        });

        const transaction = response.data.data;

        if (transaction.status === "success") {
          const { amount, currency } = transaction;
          const price = amount / 100;
          let credits = 0;

          if (currency === 'NGN') {
            if (price === 5000) credits = 1;
            else if (price === 20000) credits = 5;
            else if (price === 35000) credits = 10;
          } else if (currency === 'USD') {
            if (price === 5) credits = 1;
            else if (price === 22) credits = 5;
            else if (price === 40) credits = 10;
          }

          if (credits > 0) {
            const userRef = db.collection("users").doc(context.auth.uid);
            await db.runTransaction(async (t) => {
              const snap = await t.get(userRef);
              const current = (snap.exists && (snap.data().credits || 0)) || 0;
              const next = current + credits;
              t.set(userRef, { credits: next }, { merge: true });
            });
            return {success: true, creditsAdded: credits};
          }
        }
        return {success: false, message: "Transaction not successful."};
      } catch (error) {
        console.error("Paystack verification failed:", error);
        throw new functions.https.HttpsError(
            "internal",
            "Paystack verification failed.",
        );
      }
    },
);