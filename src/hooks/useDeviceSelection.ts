import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { Device } from "@/model/Device"; // pastikan tipe Device ini sudah sesuai
import { useDevicesRealtime } from "@/hooks/useDevicesRealtime";

export function useDeviceSelection() {
  const currentUser = auth.currentUser;
  const { devices, loading } = useDevicesRealtime();

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"owned" | "shared">("owned");

  const ownedDevices = devices.filter(device => device.owner === currentUser?.uid);
  const sharedDevices = devices.filter(
    device => currentUser?.uid && device.sharedWith?.includes(currentUser.uid)
  );
  const visibleDevices: Device[] = activeTab === "owned" ? ownedDevices : sharedDevices;

  useEffect(() => {
    const ownedCount = ownedDevices.length;
    const sharedCount = sharedDevices.length;
    const exists = visibleDevices.some(d => d.id === selectedDevice?.id);

    if (activeTab === "owned" && ownedCount === 0 && sharedCount > 0) {
      setActiveTab("shared");
      return;
    }
    if (activeTab === "shared" && sharedCount === 0 && ownedCount > 0) {
      setActiveTab("owned");
      return;
    }
    if (ownedCount === 0 && sharedCount === 0) {
      setSelectedDevice(null);
      return;
    }

    if (!selectedDevice && visibleDevices.length > 0) {
      setSelectedDevice(visibleDevices[0]);
      setSelectedDeviceIndex(0);
    } else if (!exists && visibleDevices.length > 0) {
      setSelectedDevice(visibleDevices[0]);
      setSelectedDeviceIndex(0);
    } else if (visibleDevices.length === 0) {
      setSelectedDevice(null);
    }

    if (selectedDevice !== visibleDevices[selectedDeviceIndex]) {
      setSelectedDevice(visibleDevices[selectedDeviceIndex]);
    }
  }, [devices, activeTab, selectedDevice, visibleDevices, ownedDevices, sharedDevices, selectedDeviceIndex]);

  const handleClickDeviceNumber = (index: number) => {
    setSelectedDeviceIndex(index);
    setSelectedDevice(visibleDevices[index]);
  };

  return {
    currentUser,
    devices,
    loading,
    selectedDevice,
    selectedDeviceIndex,
    setSelectedDevice,
    setSelectedDeviceIndex,
    activeTab,
    setActiveTab,
    ownedDevices,
    sharedDevices,
    visibleDevices,
    handleClickDeviceNumber,
  };
}
