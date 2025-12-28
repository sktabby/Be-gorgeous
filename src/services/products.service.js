import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  where,
  updateDoc,
  deleteDoc,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../app/firebase/db";

const col = collection(db, "products");

export async function createProduct(data) {
  const res = await addDoc(col, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return res.id;
}

export async function updateProduct(id, data) {
  await updateDoc(doc(db, "products", id), data);
}

export async function removeProduct(id) {
  await deleteDoc(doc(db, "products", id));
}

export async function getProductById(id) {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function listProducts() {
  const q = query(col, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listByCategory(categoryId) {
  // ⚠️ If Firestore asks for an index, it will show a link in console. Create it once.
  const q = query(col, where("categoryId", "==", categoryId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listFeatured(max = 6) {
  const q = query(col, where("featured", "==", true), orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
