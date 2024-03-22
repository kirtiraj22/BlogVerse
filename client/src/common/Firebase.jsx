import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// google auth
const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
	let user = null;
	try {
		const result = await signInWithPopup(auth, provider);
		user = result.user;
	} catch (err) {
		console.log(err);
	}

	return user;
};
