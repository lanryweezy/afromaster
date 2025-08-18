const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

const db = admin.firestore();
const PAYSTACK_SECRET_KEY = "YOUR_PAYSTACK_SECRET_KEY"; // TODO: Replace with your secret key

exports.verifyPaystackTransaction = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
  }

  const { reference } = data;
  const url = `https://api.paystack.co/transaction/verify/${reference}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const transaction = response.data.data;

    if (transaction.status === "success") {
      const amount = transaction.amount / 100; // Amount is in kobo
      let credits = 0;
      if (amount === 500) credits = 1;
      else if (amount === 2000) credits = 5;
      else if (amount === 3500) credits = 10;

      if (credits > 0) {
        const userRef = db.collection("users").doc(context.auth.uid);
        await userRef.update({
          credits: admin.firestore.FieldValue.increment(credits),
        });
        return { success: true, creditsAdded: credits };
      }
    }
    return { success: false, message: "Transaction not successful." };
  } catch (error) {
    console.error("Paystack verification failed:", error);
    throw new functions.https.HttpsError("internal", "Paystack verification failed.");
  }
});
