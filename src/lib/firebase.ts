import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { redirect } from 'next/navigation';
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    WithFieldValue,
    DocumentData,
} from "firebase/firestore";
// import {Peraturan} from "@/model/peraturan";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
export const auth = getAuth(app);

// export const handleCreatePeraturan = async (data: Peraturan) => {
//     const peraturanRef = doc(db, "peraturan", "D9ZH1tPTVTi9bgtpjXUc");

//     try {
//         await setDoc(peraturanRef, {
//             ...data,
//             updated_at: serverTimestamp(),
//         }, {merge: false});

//         console.log("Peraturan berhasil diubah");
//     } catch (error) {
//         console.error("Gagal menyimpan peraturan:", error);
//     }
// };

export const handleLogout = async () => {
    try {
        await signOut(auth);
        // console.log("Logout berhasil");
        redirect('/login');
    } catch (error) {
        console.error("Logout gagal:", error);
    }
};

// ✅ CREATE dokumen (ID otomatis)
export async function createDocument<T extends WithFieldValue<DocumentData>>(
    collectionName: string,
    data: T
): Promise<string | null> {
    try {
        const ref = collection(db, collectionName);
        const docRef = await addDoc(ref, data);
        console.log(`✅ Document created in '${collectionName}' with ID: ${docRef.id}`);
        return docRef.id;
    } catch (error) {
        console.error(`❌ Failed to create document in '${collectionName}':`, error);
        return null;
    }
}

// ✅ SET dokumen (override atau buat baru)
export async function setDocument<T extends WithFieldValue<DocumentData>>(
    collectionName: string,
    id: string,
    data: T
): Promise<boolean> {
    try {
        const ref = doc(db, collectionName, id);
        await setDoc(ref, data);
        console.log(`✅ Document '${id}' set in '${collectionName}'.`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to set document '${id}' in '${collectionName}':`, error);
        return false;
    }
}

// ✅ GET dokumen (dengan ID)
export async function getDocument<T>(collectionName: string, id: string): Promise<(T & { id: string }) | null> {
    try {
        const ref = doc(db, collectionName, id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
            console.warn(`⚠️ Document '${id}' not found in '${collectionName}'.`);
            return null;
        }
        console.log(`📄 Document '${id}' fetched from '${collectionName}'.`);
        return { id: snap.id, ...snap.data() } as T & { id: string };
    } catch (error) {
        console.error(`❌ Failed to get document '${id}' from '${collectionName}':`, error);
        return null;
    }
}

// ✅ GET semua dokumen
export async function getDocuments<T>(collectionName: string): Promise<(T & { id: string })[]> {
    try {
        const ref = collection(db, collectionName);
        const snap = await getDocs(ref);
        console.log(`📚 ${snap.docs.length} documents fetched from '${collectionName}'.`);
        return snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as (T & { id: string })[];
    } catch (error) {
        console.error(`❌ Failed to get documents from '${collectionName}':`, error);
        return [];
    }
}

// ✅ UPDATE dokumen (partial)
export async function updateDocument<T extends Partial<WithFieldValue<DocumentData>>>(
    collectionName: string,
    id: string,
    data: T
): Promise<boolean> {
    try {
        const ref = doc(db, collectionName, id);
        await updateDoc(ref, data);
        console.log(`✏️ Document '${id}' updated in '${collectionName}'.`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to update document '${id}' in '${collectionName}':`, error);
        return false;
    }
}

// ✅ DELETE dokumen
export async function deleteDocument(collectionName: string, id: string): Promise<boolean> {
    try {
        const ref = doc(db, collectionName, id);
        await deleteDoc(ref);
        console.log(`🗑️ Document '${id}' deleted from '${collectionName}'.`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to delete document '${id}' from '${collectionName}':`, error);
        return false;
    }
}