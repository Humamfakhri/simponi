import { auth, db } from "@/lib/firebase";
import { Device } from "@/model/Device";
import { collection, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

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