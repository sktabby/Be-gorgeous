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
    createdAtMs: Date.now(),       // ✅ stable ordering
    createdAt: serverTimestamp(),  // ✅ server truth
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
  const q = query(col, orderBy("createdAtMs", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listByCategory(categoryId) {
  const q = query(
    col,
    where("categoryId", "==", categoryId),
    orderBy("createdAtMs", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listFeatured(max = 6) {
  const q = query(
    col,
    where("featured", "==", true),
    orderBy("createdAtMs", "desc"),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
