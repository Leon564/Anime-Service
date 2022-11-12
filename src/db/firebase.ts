import admin from "firebase-admin";
import firebaseConfig from "./firebase.config";

admin.initializeApp(firebaseConfig);

const db = admin.database();

export default db;
