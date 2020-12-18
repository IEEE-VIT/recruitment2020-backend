const admin = require("firebase-admin");

const firebase = require("firebase/app");

require("firebase/auth");
require("firebase/firestore");

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "recruitments2020-rsvp",
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key.replace(/\\n/g, "\n"),
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
  }),
  databaseURL: process.env.databaseURL,
});

firebase.initializeApp({
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
});

const firebaseDb = admin.firestore();

module.exports = { firebaseDb };
