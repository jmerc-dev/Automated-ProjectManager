import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  await setPersistence(auth, browserLocalPersistence);
  return signInWithPopup(auth, provider);
};
