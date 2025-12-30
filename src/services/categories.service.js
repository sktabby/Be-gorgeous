// import {
//   collection,
//   addDoc,
//   getDocs,
//   orderBy,
//   query,
//   doc,
//   deleteDoc,
//   serverTimestamp,
//   where,
//   limit,
// } from "firebase/firestore";
// import { db } from "../app/firebase/db";
// import { collection as colRef } from "firebase/firestore";

// const col = collection(db, "categories");

// // Use client time for stable sorting + server time for audit
// export async function createCategory(data) {
//   const res = await addDoc(col, {
//     ...data,
//     createdAtMs: Date.now(),       // ✅ stable for orderBy immediately
//     createdAt: serverTimestamp(),  // ✅ real server timestamp
//   });
//   return res.id;
// }

// export async function listCategories() {
//   // Sort by createdAtMs instead of serverTimestamp field
//   const q = query(col, orderBy("createdAtMs", "desc"));
//   const snap = await getDocs(q);
//   return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
// }

// export async function removeCategory(id) {
//   // Prevent deleting category if products exist in it
//   const productsCol = colRef(db, "products");
//   const q = query(productsCol, where("categoryId", "==", id), limit(1));
//   const snap = await getDocs(q);

//   if (!snap.empty) {
//     throw new Error("This category has products. Delete/move products first.");
//   }

//   await deleteDoc(doc(db, "categories", id));
// }



import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  doc,
  deleteDoc,
  serverTimestamp,
  where,
  limit,
} from "firebase/firestore";
import { db } from "../app/firebase/db";
import { collection as colRef } from "firebase/firestore";

const col = collection(db, "categories");

// Use client time for stable sorting + server time for audit
export async function createCategory(data) {
  const res = await addDoc(col, {
    ...data,
    createdAtMs: Date.now(),       // ✅ stable for orderBy immediately
    createdAt: serverTimestamp(),  // ✅ real server timestamp
  });
  return res.id;
}

export async function listCategories(max = 100) {
  // ✅ LIMIT added (prevents slow full scan)
  const q = query(col, orderBy("createdAtMs", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function removeCategory(id) {
  // Prevent deleting category if products exist in it
  const productsCol = colRef(db, "products");
  const q = query(productsCol, where("categoryId", "==", id), limit(1));
  const snap = await getDocs(q);

  if (!snap.empty) {
    throw new Error("This category has products. Delete/move products first.");
  }

  await deleteDoc(doc(db, "categories", id));
}
