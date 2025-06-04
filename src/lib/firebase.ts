"use client";

import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile, getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
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
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { Device } from "@/model/Device";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
import { SharedUser } from "@/model/User";
dayjs.extend(relativeTime);
dayjs.locale("id");

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
    console.log("Logout berhasil");
    redirect('/masuk');
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

// export function useDevicesRealtime() {
//     const [devices, setDevices] = useState<Device[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const unsub = onSnapshot(collection(db, "devices"), (snapshot) => {
//             const docs = snapshot.docs.map((doc) => {
//                 const data = doc.data();
//                 return {
//                     id: doc.id,
//                     ...data,
//                 } as Device;
//             });

//             setDevices(docs);
//             setLoading(false);
//         });

//         return () => unsub();
//     }, []);

//     return { devices, loading };
// }

// function getTimeAgo(isoString: string): { label: string; minutes: number } {
//     const last = new Date(isoString);
//     const now = new Date();
//     const diffMs = now.getTime() - last.getTime();
//     const diffMin = Math.floor(diffMs / 60000); // 1 menit = 60000ms

//     let label = "Baru saja";
//     if (diffMin === 1) label = "1 menit lalu";
//     else if (diffMin > 1) label = `${diffMin} menit lalu`;

//     return { label, minutes: diffMin };
// }

// export function LastUpdated({ timestamp, deviceId }: { timestamp: string, deviceId: string }) {
//   const [label, setLabel] = useState("");

//   useEffect(() => {
//     const now = dayjs();
//     const time = dayjs(timestamp);
//     const diffMinutes = now.diff(time, "minute");
//     const diffHours = now.diff(time, "hour");
//     const diffDays = now.diff(time, "day");

//     if (diffDays >= 3) {
//       // Contoh: 26 Mei 2025 | 14:26
//       setLabel(time.format("D MMMM YYYY | HH:mm"));
//     } else if (diffDays >= 1) {
//       setLabel(`${diffDays} hari lalu`);
//     } else if (diffHours >= 1) {
//       setLabel(`${diffHours} jam lalu`);
//     } else {
//       setLabel(`${diffMinutes} menit lalu`);
//     }

//     if (diffMinutes >= 2) {
//       const ref = doc(db, "devices", deviceId);
//       updateDoc(ref, {
//         status: false,
//       }).then(() => {
//         console.log("Status updated to false due to inactivity");
//       }).catch((err) => {
//         console.error("Update failed:", err);
//       });
//     }
//   }, [timestamp, deviceId]);

//   return label;
// }

export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // hentikan listener segera setelah mendapatkan user
      resolve(user);
    });
  });
}

export async function setDisplayName(name: string) {
  const user = auth.currentUser;
  if (user) {
    await updateProfile(user, { displayName: name });
    console.log("Display name updated: ", name);
  } else {
    console.warn("No user is logged in");
  }
}

// 1️⃣ Registrasi User + Buat Dokumen di Collection "users"
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { auth, db } from "@/lib/firebase";

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Buat akun Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update displayName (optional)
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name });
    }

    // Buat dokumen di Firestore (collection: users)
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      devices: [], // Kosong saat registrasi
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Registrasi berhasil" };
  } catch (error) {
    // console.error("Registrasi gagal:", error);
    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
};


// 2️⃣ Realtime Devices Berdasarkan User yang Login
// import { onSnapshot, doc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth, db } from "@/lib/firebase";
// import { User as UserModel, Device } from "@/types";

// export function useDevicesRealtime() {
//   const [devices, setDevices] = useState<Device[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [user] = useAuthState(auth);

//   useEffect(() => {
//     if (!user) return;

//     const userRef = doc(db, "users", user.uid);
//     const unsub = onSnapshot(userRef, async (snapshot) => {
//       const userData = snapshot.data() as UserModel | undefined;
//       if (!userData || !userData.devices || userData.devices.length === 0) {
//         setDevices([]);
//         setLoading(false);
//         return;
//       }

//       // Ambil data devices berdasarkan ID yang tersimpan
//       const devicePromises = userData.devices.map(async (deviceId) => {
//         const deviceSnap = await getDoc(doc(db, "devices", deviceId));
//         if (deviceSnap.exists()) {
//           return { id: deviceSnap.id, ...deviceSnap.data() } as Device;
//         }
//         return null;
//       });

//       const deviceResults = await Promise.all(devicePromises);
//       const filtered = deviceResults.filter((d): d is Device => d !== null);

//       setDevices(filtered);
//       setLoading(false);
//     });

//     return () => unsub();
//   }, [user]);

//   return { devices, loading };
// }

// GET DEVICES FROM USERS
// export function useDevicesRealtime() {
//   const [devices, setDevices] = useState<Device[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [user] = useAuthState(auth);

//   useEffect(() => {
//     if (!user) return;

//     const userRef = doc(db, "users", user.uid);
//     const unsubscribeUser = onSnapshot(userRef, async (userSnap) => {
//       const userData = userSnap.data() as UserModel | undefined;
//       if (!userData || !userData.devices || userData.devices.length === 0) {
//         setDevices([]);
//         setLoading(false);
//         return;
//       }

//       // Hapus listener sebelumnya jika ada
//       const unsubscribers: (() => void)[] = [];

//       const realtimeDevices: Device[] = [];
//       const deviceIds = userData.devices;

//       // Dengarkan setiap device secara realtime
//       deviceIds.forEach((deviceId) => {
//         const deviceRef = doc(db, "devices", deviceId);
//         const unsubscribeDevice = onSnapshot(deviceRef, (deviceSnap) => {
//           if (deviceSnap.exists()) {
//             const updatedDevice = { id: deviceSnap.id, ...deviceSnap.data() } as Device;
//             // Update hanya device yang berubah
//             realtimeDevices.push(updatedDevice);

//             setDevices((prevDevices) => {
//               const others = prevDevices.filter((d) => d.id !== updatedDevice.id);
//               return [...others, updatedDevice];
//             });
//           }
//         });

//         unsubscribers.push(unsubscribeDevice);
//       });

//       setLoading(false);

//       // Cleanup semua listener saat komponen unmount atau user ganti
//       return () => {
//         unsubscribers.forEach((unsub) => unsub());
//       };
//     });

//     return () => unsubscribeUser();
//   }, [user]);

//   return { devices, loading };
// }


// GET DEVICES WITH FILTER OWNER AND SHARED
export function useDevicesRealtime() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;

    const devicesRef = collection(db, "devices");

    const unsubscribe = onSnapshot(devicesRef, (snapshot) => {
      const userDevices: Device[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const device = { id: docSnap.id, ...data } as Device;

        // Filter: apakah user adalah owner atau ada di sharedWith
        const isOwner = device.owner === user.uid;
        const isShared = Array.isArray(device.sharedWith) && device.sharedWith.includes(user.uid);

        if (isOwner || isShared) {
          userDevices.push(device);
        }
      });

      setDevices(userDevices);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { devices, loading };
}

export function useSharedUsers(uids: string[]) {
  const [users, setUsers] = useState<SharedUser[]>([]);
  const [loadingUsers, setLoading] = useState(true);

  useEffect(() => {

    if (!uids || uids.length === 0) {
      setUsers([]);
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      const userData: SharedUser[] = [];

      await Promise.all(
        uids.map(async (uid) => {
          const userRef = doc(db, "users", uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            userData.push({
              uid,
              name: data.name ?? "Tidak diketahui",
              email: data.email ?? "-",
            });
          }
        })
      );

      setUsers(userData);
      setLoading(false);
    };

    fetchUsers();
  }, [uids]);

  return { users, loadingUsers };
}


// 3️⃣ Tambahkan Device ke Field "devices" dalam Dokumen User
// import { arrayUnion, doc, updateDoc } from "firebase/firestore";
// import { auth, db } from "@/lib/firebase";
// import { Device } from "@/types";

// export const addDeviceToUser = async (deviceCode: string): Promise<{ success: boolean; message: string }> => {
//   const currentUser = auth.currentUser;
//   if (!currentUser) return { success: false, message: "User belum login" };

//   try {
//     const userRef = doc(db, "users", currentUser.uid);
//     await updateDoc(userRef, {
//       devices: arrayUnion(deviceCode),
//     });
//     return { success: true, message: "Device berhasil ditambahkan" };
//   } catch (error) {
//     console.error("Gagal menambahkan device:", error);
//     return { success: false, message: error instanceof Error ? error.message : String(error) };
//   }
// };

// export const addDeviceToUser = async (
//   deviceCode: string
// ): Promise<{ success: boolean; message: string }> => {
//   const currentUser = auth.currentUser;
//   if (!currentUser) {
//     return { success: false, message: "User belum login" };
//   }

//   const userRef = doc(db, "users", currentUser.uid);
//   const deviceRef = doc(db, "devices", deviceCode);

//   const userDoc = await getDocument<UserModel>("users", currentUser.uid);
//   if (userDoc?.devices.includes(deviceCode)) {
//     return { success: false, message: "Device sudah ditambahkan" };
//   }

//   try {
//     // Tambahkan deviceCode ke array devices milik user
//     await updateDoc(userRef, {
//       devices: arrayUnion(deviceCode),
//     });

//     // Ambil informasi device
//     const deviceSnap = await getDoc(deviceRef);
//     if (!deviceSnap.exists()) {
//       return { success: false, message: "Device tidak ditemukan" };
//     }

//     const deviceData = deviceSnap.data();
//     const isOwnerExists = !!deviceData.owner;

//     if (!isOwnerExists) {
//       // Jika belum ada owner, tetapkan current user sebagai owner
//       await updateDoc(deviceRef, {
//         owner: currentUser.uid,
//         sharedWith: [], // inisialisasi jika belum ada
//       });
//     } else {
//       // Jika sudah ada owner, tambahkan ke sharedWith jika belum ada
//       const sharedWith: string[] = deviceData.sharedWith || [];
//       if (!sharedWith.includes(currentUser.uid)) {
//         await updateDoc(deviceRef, {
//           sharedWith: arrayUnion(currentUser.uid),
//         });
//       }
//     }

//     return { success: true, message: "Device berhasil ditambahkan" };
//   } catch (error) {
//     console.error("Gagal menambahkan device:", error);
//     return {
//       success: false,
//       message: error instanceof Error ? error.message : String(error),
//     };
//   }
// };

// export const addDeviceToUser = async (
//   deviceCode: string
// ): Promise<{ success: boolean; message: string }> => {
//   const currentUser = auth.currentUser;
//   if (!currentUser) {
//     return { success: false, message: "User belum login" };
//   }

//   const userRef = doc(db, "users", currentUser.uid);
//   const deviceRef = doc(db, "devices", deviceCode);

//   const userDoc = await getDocument<UserModel>("users", currentUser.uid);
//   if (userDoc?.devices.includes(deviceCode)) {
//     return { success: false, message: "Device sudah ditambahkan" };
//   }

//   try {
//     // Tambahkan deviceCode ke array devices milik user
//     await updateDoc(userRef, {
//       devices: arrayUnion(deviceCode),
//     });

//     // Ambil informasi device
//     const deviceSnap = await getDoc(deviceRef);
//     if (!deviceSnap.exists()) {
//       return { success: false, message: "Device tidak ditemukan" };
//     }

//     const deviceData = deviceSnap.data();
//     const isOwnerExists = !!deviceData.owner;

//     if (!isOwnerExists) {
//       // Jika belum ada owner, tetapkan current user sebagai owner
//       await updateDoc(deviceRef, {
//         owner: currentUser.uid,
//         sharedWith: [], // inisialisasi sharedWith kosong
//       });
//     } else if (deviceData.owner !== currentUser.uid) {
//       // Jika bukan owner, tambahkan ke sharedWith jika belum ada
//       const sharedWith: string[] = deviceData.sharedWith || [];
//       if (!sharedWith.includes(currentUser.uid)) {
//         await updateDoc(deviceRef, {
//           sharedWith: arrayUnion(currentUser.uid),
//         });
//       }
//     }

//     return { success: true, message: "Device berhasil ditambahkan" };
//   } catch (error) {
//     console.error("Gagal menambahkan device:", error);
//     return {
//       success: false,
//       message: error instanceof Error ? error.message : String(error),
//     };
//   }
// };

export const addDeviceToUser = async (
  deviceCode: string,
  existingDeviceIds: string[] // Dikirim dari front-end (state devices)
): Promise<{ success: boolean; message: string }> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return { success: false, message: "User belum login" };
  }

  // const userRef = doc(db, "users", currentUser.uid);
  const deviceRef = doc(db, "devices", deviceCode);

  // Cek apakah deviceCode sudah ada dalam state dari frontend
  if (existingDeviceIds.includes(deviceCode)) {
    return { success: false, message: "Device sudah ditambahkan" };
  }

  try {
    // Ambil informasi device dari Firestore
    const deviceSnap = await getDoc(deviceRef);
    if (!deviceSnap.exists()) {
      return { success: false, message: "Device tidak ditemukan" };
    }

    const deviceData = deviceSnap.data();
    const isOwnerExists = !!deviceData.owner;

    if (!isOwnerExists) {
      // Jika belum ada owner, tetapkan current user sebagai owner
      await updateDoc(deviceRef, {
        owner: currentUser.uid,
        sharedWith: [], // Inisialisasi sharedWith kosong
      });
    } else if (deviceData.owner !== currentUser.uid) {
      // Jika user bukan pemilik, tambahkan ke sharedWith jika belum ada
      const sharedWith: string[] = deviceData.sharedWith || [];
      if (!sharedWith.includes(currentUser.uid)) {
        await updateDoc(deviceRef, {
          sharedWith: arrayUnion(currentUser.uid),
        });
      }
    }

    return { success: true, message: "Device berhasil ditambahkan" };
  } catch (error) {
    console.error("Gagal menambahkan device:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
};



// export const removeDeviceFromUser = async (deviceCode: string): Promise<{ success: boolean; message: string }> => {
//   const currentUser = auth.currentUser;
//   if (!currentUser) return { success: false, message: "User belum login" };

//   try {
//     const userRef = doc(db, "users", currentUser.uid);
//     await updateDoc(userRef, {
//       devices: arrayRemove(deviceCode),
//     });
//     return { success: true, message: "Device berhasil dihapus" };
//   } catch (error) {
//     console.error("Gagal menghapus device:", error);
//     return { success: false, message: error instanceof Error ? error.message : String(error) };
//   }
// };

export const removeDeviceFromUser = async (
  deviceCode: string
): Promise<{ success: boolean; message: string }> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return { success: false, message: "User belum login" };

  const userRef = doc(db, "users", currentUser.uid);
  const deviceRef = doc(db, "devices", deviceCode);

  try {
    // Hapus dari koleksi user
    await updateDoc(userRef, {
      devices: arrayRemove(deviceCode),
    });

    const deviceSnap = await getDoc(deviceRef);
    if (!deviceSnap.exists()) {
      return { success: true, message: "Device berhasil dihapus (tanpa dokumen device)" };
    }

    const deviceData = deviceSnap.data();
    if (deviceData.owner !== currentUser.uid) {
      // Jika bukan owner, juga hapus dari sharedWith
      await updateDoc(deviceRef, {
        sharedWith: arrayRemove(currentUser.uid),
      });
    }

    return { success: true, message: "Device berhasil dihapus" };
  } catch (error) {
    console.error("Gagal menghapus device:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
};

// export function LastUpdated({ timestamp, deviceId }: { timestamp: Timestamp, deviceId: string }) {
//   const [label, setLabel] = useState("");

//   useEffect(() => {
//     const now = dayjs();
//     const time = dayjs(timestamp.toDate());
//     const diffMinutes = now.diff(time, "minute");
//     const diffHours = now.diff(time, "hour");
//     const diffDays = now.diff(time, "day");

//     if (diffDays >= 3) {
//       setLabel(time.format("D MMMM YYYY | HH:mm"));
//     } else if (diffDays >= 1) {
//       setLabel(`${diffDays} hari lalu`);
//     } else if (diffHours >= 1) {
//       setLabel(`${diffHours} jam lalu`);
//     } else {
//       setLabel(`${diffMinutes} menit lalu`);
//     }

//     if (diffMinutes >= 2) {
//       const ref = doc(db, "devices", deviceId);
//       updateDoc(ref, {
//         status: false,
//       }).then(() => {
//         console.log("Status updated to false due to inactivity");
//       }).catch((err) => {
//         console.error("Update failed:", err);
//       });
//     }
//   }, [timestamp, deviceId]);

//   return label;
// }

export function LastUpdated({
  timestamp,
  deviceId,
}: {
  timestamp: Timestamp | { seconds: number; nanoseconds: number };
  deviceId: string;
}) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    let timeObj: Date;
    
    if (typeof (timestamp as Timestamp).toDate === "function") {
      timeObj = (timestamp as Timestamp).toDate();
    } else {
      // fallback manual jika bukan Timestamp instance
      const { seconds, nanoseconds } = timestamp as { seconds: number; nanoseconds: number };
      timeObj = new Date(seconds * 1000 + Math.floor(nanoseconds / 1e6));
    }

    // console.log(timeObj);

    const now = dayjs();
    const time = dayjs(timeObj);
    const diffMinutes = now.diff(time, "minute");
    const diffHours = now.diff(time, "hour");
    const diffDays = now.diff(time, "day");

    if (diffDays >= 3) {
      setLabel(time.format("D MMMM YYYY | HH:mm"));
    } else if (diffDays >= 1) {
      setLabel(`${diffDays} hari lalu`);
    } else if (diffHours >= 1) {
      setLabel(`${diffHours} jam lalu`);
    } else {
      setLabel(`${diffMinutes} menit lalu`);
    }

    if (diffMinutes >= 2) {
      const ref = doc(db, "devices", deviceId);
      updateDoc(ref, {
        status: false,
      }).then(() => {
        console.log("Status updated to false due to inactivity");
      }).catch((err) => {
        console.error("Update failed:", err);
      });
    }
  }, [timestamp, deviceId]);

  return label;
}

export async function removeUserFromSharedWith(
  deviceId: string,
  userId: string,
  // setDevices: React.Dispatch<React.SetStateAction<Device[]>>
): Promise<{ success: boolean; message: string }> {
  try {
    const deviceRef = doc(db, "devices", deviceId);
    await updateDoc(deviceRef, {
      sharedWith: arrayRemove(userId),
    });

    // setDevices((prevDevices) =>
    //   prevDevices.map((device) =>
    //     device.id === deviceId
    //       ? {
    //           ...device,
    //           sharedWith: device.sharedWith?.filter((uid) => uid !== userId) || [],
    //         }
    //       : device
    //   )
    // );

    // console.log(`User ${userId} removed from sharedWith on device ${deviceId}`);
    return { success: true, message: "Berhasil menghapus pengguna" };
  } catch (error) {
    console.error("Gagal menghapus pengguna dari daftar bagikan:", error);
    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
}