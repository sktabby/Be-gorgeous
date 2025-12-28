import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "./firebase.config";

export const auth = getAuth(app);

export async function adminSignIn(email, password) {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
}

export async function adminSignOut() {
  await signOut(auth);
}
