"use client";

import LineChartWithXAxisPadding from "@/components/LineChartWithXAxisPadding";
import { SensorChartCard } from "@/components/SensorChartCard";
import Tab from "@/components/Tab";
import { useDevicesRealtime } from "@/hooks/useDevicesRealtime";
import { auth } from "@/lib/firebase";
import { Device } from "@/model/Device";
import { useEffect, useState } from "react";

export default function HistoriPage() {
  const currentUser = auth.currentUser
  const { devices, loading } = useDevicesRealtime();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"owned" | "shared">("owned");

  // Filter perangkat saat render
  const ownedDevices = devices.filter(device => device.owner === currentUser?.uid);
  const sharedDevices = devices.filter(device => currentUser?.uid !== undefined && device.sharedWith?.includes(currentUser.uid));
  const visibleDevices: Device[] = activeTab === "owned" ? ownedDevices : sharedDevices;

  useEffect(() => {
    // Cek jumlah device di masing-masing tab 
    const ownedCount = ownedDevices.length;
    const sharedCount = sharedDevices.length;
    const exists = visibleDevices.some(d => d.id === selectedDevice?.id);

    // Jika tab "owned" aktif dan tidak ada device, pindah ke "shared" jika ada device di sana
    if (activeTab === "owned" && ownedCount === 0 && sharedCount > 0) {
      setActiveTab("shared");
      return;
    }
    // Jika tab "shared" aktif dan tidak ada device, pindah ke "owned" jika ada device di sana
    if (activeTab === "shared" && sharedCount === 0 && ownedCount > 0) {
      setActiveTab("owned");
      return;
    }
    // Jika kedua tab kosong, setSelectedDevice(null)
    if (ownedCount === 0 && sharedCount === 0) {
      setSelectedDevice(null);
      return;
    }

    // Pilih device pertama jika selectedDevice tidak ada
    if (!selectedDevice && visibleDevices.length > 0) {
      setSelectedDevice(visibleDevices[0]);
      setSelectedDeviceIndex(0);
      // Pilih device pertama jika selectedDevice dihapus
    } else if (!exists && visibleDevices.length > 0) {
      setSelectedDevice(visibleDevices[0]);
      setSelectedDeviceIndex(0);
    } else if (visibleDevices.length === 0) {
      setSelectedDevice(null);
    }

    if (selectedDevice != visibleDevices[selectedDeviceIndex]) {
      setSelectedDevice(visibleDevices[selectedDeviceIndex]);
    }
  }, [devices, activeTab, selectedDevice, visibleDevices, ownedDevices, sharedDevices, selectedDeviceIndex])

  const handleClickDeviceNumber = (index: number) => {
    setSelectedDeviceIndex(index);
    setSelectedDevice(visibleDevices[index]);
  };

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <>
      <Tab ownedDevices={ownedDevices} sharedDevices={sharedDevices} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/60 pr-8 py-4 border border-white rounded-2xl">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="px-5 font-bold">TDS <span className="text-muted-foreground font-normal text-sm">(PPM)</span></h1>
            <p className="px-5 text-muted-foreground text-sm">Total Dissolved Solids</p>
          </div>
          <div>
            <LineChartWithXAxisPadding />
          </div>
        </div>
        <div className="bg-white/60 pr-8 py-4 border border-white rounded-2xl">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="px-5 font-bold">pH</h1>
            <p className="px-5 text-muted-foreground text-sm">pH Air</p>
          </div>
          <div>
            <LineChartWithXAxisPadding />
          </div>
        </div>
        <div className="bg-white/60 pr-8 py-4 border border-white rounded-2xl">
          <div className="mb-6">
            <h1 className="px-5 font-bold">TDS</h1>
            <p className="px-5 text-muted-foreground text-sm">Total Dissolve Solid</p>
          </div>
          <div className="grid grid-cols-4">
            <SensorChartCard
              title="Average TDS"
              average={753.42}
              data={[
                { timestamp: "2025-06-09T05:00:00Z", value: 700 },
                { timestamp: "2025-06-09T05:05:00Z", value: 710 },
                { timestamp: "2025-06-09T05:10:00Z", value: 770 },

              ]}
            />

          </div>
        </div>
      </div>
    </>
  );
}
