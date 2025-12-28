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

export async function createCategory(data) {
  const res = await addDoc(col, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return res.id;
}

export async function listCategories() {
  const q = query(col, orderBy("createdAt", "desc"));
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
