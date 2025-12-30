// import { initializeFirestore } from "firebase/firestore";
// import { app } from "./firebase.config";

// export const db = initializeFirestore(app, {
//   experimentalForceLongPolling: true,
//   useFetchStreams: false,
// });


import { getFirestore } from "firebase/firestore";
import { app } from "./firebase.config";

export const db = getFirestore(app);
