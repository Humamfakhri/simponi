"use client";

import AddDeviceDialog from '@/components/AddDeviceDialog';
import { showToast } from '@/components/showToast';
import Sidebar from "@/components/Sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { auth, removeDeviceFromUser, removeUserFromSharedWith, updateDocument, useDevicesRealtime, useSharedUsers } from "@/lib/firebase";
import { Device, SensorConfig } from "@/model/Device";
import { CircleHelp, CircleMinus, Copy, Info, MapPin, Plus, UserCircle2 } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function PengaturanPage() {
  const currentUser = auth.currentUser
  const { devices, loading } = useDevicesRealtime();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const ownedDevices = devices.filter(device => device.owner === currentUser?.uid);
  const sharedDevices = devices.filter(device => currentUser?.uid !== undefined && device.sharedWith?.includes(currentUser.uid));
  const [activeTab, setActiveTab] = useState<"owned" | "shared">("owned");
  const visibleDevices = activeTab === "owned" ? ownedDevices : sharedDevices;

  const [isShareable, setIsShareable] = useState<boolean>(selectedDevice?.isShareable || false);
  const [isDebug, setIsDebug] = useState<boolean>(selectedDevice?.isDebug || false);
  const [sensorConfig, setSensorConfig] = useState<SensorConfig | null>(selectedDevice?.sensorConfig || null);
  const isOwner = currentUser?.uid === selectedDevice?.owner;
  const [deviceName, setDeviceName] = useState(selectedDevice?.name || "");
  const [deviceLocation, setDeviceLocation] = useState(selectedDevice?.location || "");
  const [deviceNote, setDeviceNote] = useState(selectedDevice?.note || "");
  const [loadingUpdate, setLoadingUpdate] = useState("")
  // const { users, loadingUsers } = useSharedUsers(selectedDevice?.sharedWith || []);
  const uids = useMemo(() => selectedDevice?.sharedWith || [], [selectedDevice]);
  const { users, loadingUsers } = useSharedUsers(uids);


  const router = useRouter();

  // useEffect(() => {
  //   if (devices.length > 0) {
  //     setSelectedDevice(devices[0] || null);
  //     setDeviceName(devices[0].name || "");
  //     setDeviceLocation(devices[0].location || "");
  //   }
  // }, [devices]);
  // useEffect(() => {
  //   if (visibleDevices.length > 0) {
  //     setSelectedDevice(visibleDevices[0]);
  //   } 
  // }, [activeTab, devices, visibleDevices]);

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
    // Pilih device pertama jika selectedDevice tidak ada atau sudah tidak ada di visibleDevices
    if (!selectedDevice && visibleDevices.length > 0) {
      setSelectedDevice(visibleDevices[0]);
    } else if (!exists && visibleDevices.length > 0) {
      setSelectedDevice(visibleDevices[0]);
    } else if (visibleDevices.length === 0) {
      setSelectedDevice(null);
    }
  }, [devices, activeTab, selectedDevice, visibleDevices, ownedDevices, sharedDevices]);

  useEffect(() => {
    if (selectedDevice) {
      setIsShareable(selectedDevice.isShareable);
      setIsDebug(selectedDevice.isDebug);
      setSensorConfig(selectedDevice.sensorConfig);
      setDeviceName(selectedDevice.name || "");
      setDeviceLocation(selectedDevice.location || "");
    }
    console.log(selectedDevice?.sensorConfig);
  }, [selectedDevice]);


  const handleHapusPerangkat = async () => {
    if (!selectedDevice) return;

    try {
      const result = await removeDeviceFromUser(selectedDevice.id);
      if (result.success) {
        showToast({ message: "Berhasil menghapus perangkat", variant: "success" });
        // console.log(selectedDevice);
        // console.log(devices.length);

        // harusnya 0
        if (devices.length === 1) {
          router.push("/");
        }
      }
    } catch (error) {
      showToast({ message: "Gagal menghapus perangkat", variant: "error" });
      console.error("Gagal menghapus perangkat:", error);
    }
  }

  const handleRemoveUser = async (uid: string) => {
    if (!selectedDevice) return;

    try {
      const result = await removeUserFromSharedWith(selectedDevice.id, uid);
      if (result.success) {
        showToast({ message: "Berhasil menghapus pengguna", variant: "success" });
        // console.log(selectedDevice);
        // console.log(devices.length);

        // harusnya 0
        if (devices.length === 1) {
          router.push("/");
        }
      }
    } catch (error) {
      showToast({ message: "Gagal menghapus pengguna", variant: "error" });
      console.error("Gagal menghapus pengguna:", error);
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedDevice?.id || "");
      showToast({ message: "ID perangkat disalin ke clipboard", variant: "success" });
    } catch (error) {
      console.error("Gagal menyalin:", error);
    }
  };

  const handleToggleShareable = async () => {
    if (!selectedDevice) return;
    try {
      const result = await updateDocument("devices", selectedDevice?.id, {
        isShareable: !isShareable,
      });
      if (result) {
        setIsShareable(!isShareable);
      }
    } catch (error) {
      console.error("Gagal mengubah mode bagikan:", error);
    }
  };

  const handleToggleDebug = async () => {
    if (!selectedDevice) return;
    try {
      const result = await updateDocument("devices", selectedDevice?.id, {
        isDebug: !isDebug,
      });
      if (result) {
        setIsDebug(!isDebug);
      }
    } catch (error) {
      console.error("Gagal mengubah mode:", error);
    }
  };

  const handleSimpan = async (
    field: string,
    value: string | number,
    sensorConfig: boolean = false
  ) => {
    if (!selectedDevice) return;

    const loadingFields = ["name", "location", "TDS_offset_voltage", "note", "ph4", "ph7", "ph9", "water_level_height"];
    if (loadingFields.includes(field)) {
      setLoadingUpdate(field);
    }

    try {
      let result = false;
      if (sensorConfig) {
        result = await updateDocument("devices", selectedDevice.id, {
          [`sensorConfig.${field}`]: value,
        });
      } else {
        result = await updateDocument("devices", selectedDevice.id, {
          [field]: value,
        });
      }

      if (result) {
        showToast({ message: "Berhasil menyimpan perubahan", variant: "success" });
      } else {
        showToast({ message: "Gagal menyimpan perubahan", variant: "error" });
      }
    } catch (error) {
      console.error("Gagal menyimpan perubahan", error);
    } finally {
      setLoadingUpdate("");
    }
  };


  if (loading) {
    return (
      <main className="bg-main py-8">
        <div className="container mx-auto min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-400"></div>
        </div>
      </main>
    );
  }



  return (
    <main className="min-h-screen bg-radial-[at_50%_75%] from-emerald-200 via-sky-100 to-[#d7d9db] to-90% py-8">
      <div className="container mx-auto mt-20 lg:mt-24 mb-16 lg:mb-8">
        <div className="flex items-start gap-4">
          <Sidebar />
          <div className="grow flex flex-col gap-4 px-2">
            <div className="flex items-center gap-4">
              <div className="flex gap-2 mb-4">
                {ownedDevices.length > 0 &&
                  <Button
                    variant={activeTab === "owned" ? "dark" : "glass"}
                    className="rounded-full"
                    onClick={() => setActiveTab("owned")}
                  >
                    Perangkat Anda
                  </Button>
                }
                {sharedDevices.length > 0 &&
                  <Button
                    variant={activeTab === "shared" ? "dark" : "glass"}
                    className="rounded-full"
                    onClick={() => setActiveTab("shared")}
                  >
                    Dibagikan
                  </Button>
                }
              </div>
            </div>
            <div className="glass-container">
              {/* DEVICES TAB */}
              <div className="absolute top-0 right-1/2 lg:right-0 translate-x-1/2 lg:translate-x-0">
                {/* <div className="absolute top-0 left-1/2 -translate-x-1/2"> */}
                <div className="relative bg-white/10 pt-3 pb-4 px-6 rounded-b-4xl lg:rounded-br-none lg:rounded-bl-4xl lg:rounded-tr-4xl border border-white/60">
                  <div className="flex items-center gap-6">
                    {visibleDevices?.map((device, index) => (
                      <Button
                        key={device.id}
                        onClick={() => setSelectedDevice(device)}
                        variant={selectedDevice?.id === device.id ? "dark" : "glass"}
                        className="size-12 rounded-full cursor-pointer transition-all"
                      >
                        {index + 1}
                      </Button>
                    ))}
                    <AddDeviceDialog devices={devices}>
                      <Button variant={"outline"} className="flex items-center justify-center size-12 rounded-full cursor-pointer transition-all border border-ring/60 bg-transparent">
                        <Plus className="size-4 text-secondary-foreground" />
                      </Button>
                    </AddDeviceDialog>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start gap-2 mt-24 lg:mt-0">
                  <div className="flex items-center gap-2">
                    {selectedDevice?.status === true ? (
                      <Tooltip>
                        <TooltipTrigger><span className="relative flex size-3">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex size-3 rounded-full bg-primary"></span>
                        </span></TooltipTrigger>
                        <TooltipContent variant="default" sideOffset={5}>
                          <p>Perangkat Aktif</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip >
                        <TooltipTrigger>
                          <span className="relative flex size-3">
                            {/* <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span> */}
                            <span className="relative inline-flex size-3 rounded-full bg-destructive"></span>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent variant="destructive" sideOffset={5}>
                          <p>Perangkat Nonaktif</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <h2 className="text-lg lg:text-xl font-black font-heading">{selectedDevice?.name}</h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                    <MapPin strokeWidth={1} className="size-4" />
                    <p className="font-light max-w-[280px] lg:max-w-xl truncate">{selectedDevice?.location}</p>
                  </div>
                  <div className={`mt-4 ${!isOwner ? "flex" : "hidden"}`}>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant={"destructive"} className="">Hapus Perangkat</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Hapus perangkat {selectedDevice?.name} dari akun ini. Data perangkat tidak akan dihapus dari server.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction variant='destructive' onClick={handleHapusPerangkat}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div> {/* END OF GLASS CONTAINER */}
            {/* CATATAN */}
            <div className={`glass-container ${isOwner ? "flex" : "hidden"} flex-col items-start gap-4 ${selectedDevice?.isShareable && !isOwner && "text-muted-foreground"}`}>
              <div className='header-text flex flex-col gap-2'>
                <h1 className='text-lg lg:text-xl font-black font-heading'>Catatan Anda</h1>
                <p className='text-muted-foreground text-sm'>Catat informasi penting yang Anda perlukan dan akses kapanpun.</p>
              </div>
              <Textarea className='bg-white/60 border-white shadow-none text-sm rounded-xl' value={deviceNote} onChange={(e) => setDeviceNote(e.target.value)} id="lokasi" placeholder="Ketik di sini ..." />
              <div className="flex items-center justify-end w-full">
                <Button disabled={loadingUpdate == "note"} onClick={() => handleSimpan("note", deviceNote)}>
                  {loadingUpdate == "note" &&
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  }
                  Simpan
                </Button>
              </div>
            </div>

            {/* KONFIGURASI PARAMETER */}
            <div className={`glass-container ${isOwner ? "flex" : "hidden"} flex-col items-start gap-4 ${selectedDevice?.isShareable && !isOwner && "text-muted-foreground"}`}>
              <div className="flex items-center justify-between w-full mb-2">
                <h1 className='text-lg lg:text-xl font-black font-heading'>Konfigurasi Parameter</h1>
                <div className="flex items-center gap-1">
                  <Switch className={`cursor-pointer ${isDebug ? "bg-primary" : "bg-input"}`} checked={isDebug} onClick={handleToggleDebug} />
                  <span className='text-sm font-semibold text-foreground ml-1'>Mode Debug</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CircleHelp className='size-4' />
                    </TooltipTrigger>
                    <TooltipContent sideOffset={5} className='flex flex-col gap-1' side='bottom' align='end'>
                      <p>Digunakan untuk kalibrasi sensor yang membuat:</p>
                      <p>perubahan data di Dashboard lebih intens (per detik),</p>
                      <p>data lengkap sensor muncul di Serial Monitor perangkat,</p>
                      <p>data tidak disimpan ke histori.</p>
                      <Link href={'#'} className='text-primary'>Pelajari selengkapnya</Link>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className={`flex flex-col items-start gap-4`}>
                {/* <div className={`flex flex-col items-start gap-4 ${!isDebug && 'opacity-50'}`}> */}
                <div className='grid grid-cols-2 gap-4 max-w-fit'>
                  <div className="bg-white/40 border border-white/60 rounded-lg lg:rounded-2xl rounded-b-none px-3 py-3 lg:px-6 lg:py-4 w-full max-w-[320px]">
                    <div className="flex flex-col gap-1 mb-3">
                      <h2 className='font-semibold'>TDS</h2>
                      <p className='text-sm text-foreground/80 italic'>TDS Offset Voltage</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Input
                          id="TDS_offset_voltage"
                          type="number"
                          disabled={!isDebug}
                          placeholder="TDS Offset Voltage"
                          value={sensorConfig?.TDS_offset_voltage ?? ""}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value);
                            setSensorConfig((prev) => prev ? { ...prev, TDS_offset_voltage: newValue } : null);
                          }}
                          className='bg-white/80 border-white max-w-[174px] shadow-none text-sm pr-16'
                        />
                        <Button disabled variant={"outline"} className='absolute top-0 right-0'>V</Button>
                      </div>
                      <Button disabled={!isDebug || sensorConfig?.TDS_offset_voltage == null || loadingUpdate == "TDS_offset_voltage"} onClick={() => sensorConfig?.TDS_offset_voltage !== undefined && handleSimpan("TDS_offset_voltage", sensorConfig.TDS_offset_voltage, true)}>
                        {loadingUpdate == "TDS_offset_voltage" &&
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                        }
                        Simpan
                      </Button>
                    </div>
                  </div>
                  <div className="bg-white/40 border border-white/60 rounded-lg lg:rounded-2xl rounded-b-none px-3 py-3 lg:px-6 lg:py-4 w-full max-w-[320px]">
                    <div className="flex flex-col gap-1 mb-3">
                      <h2 className='font-semibold'>Ketinggian Air</h2>
                      <p className='text-sm text-foreground/80'>Jarak antara sensor dan alas tandon air</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Input
                          id="water_level_height"
                          type="number"
                          disabled={!isDebug}
                          placeholder="Ketinggian Air"
                          value={sensorConfig?.water_level_height ?? ""}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value);
                            setSensorConfig((prev) => prev ? { ...prev, water_level_height: newValue } : null);
                          }}
                          className='bg-white/80 border-white max-w-[174px] shadow-none text-sm pr-16'
                        />
                        <Button variant={"outline"} disabled className='absolute top-0 right-0'>cm</Button>
                      </div>
                      <Button disabled={!isDebug || sensorConfig?.water_level_height == null || loadingUpdate == "water_level_height"} onClick={() => sensorConfig?.water_level_height !== undefined && handleSimpan("water_level_height", sensorConfig.water_level_height, true)}>
                        {loadingUpdate == "water_level_height" &&
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                        }
                        Simpan
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-17 bg-white/40 border border-white/60 rounded-lg lg:rounded-2xl rounded-b-none px-3 py-3 lg:px-6 lg:py-4">
                  <div className='w-full max-w-[265px]'>
                    <div className="flex flex-col gap-1 mb-3">
                      <h2 className='font-semibold'>pH</h2>
                      <p className='text-sm text-foreground/80'>phVoltage saat <span className="font-bold">pH 4,01</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Input
                          id="ph4"
                          type="number"
                          disabled={!isDebug}
                          placeholder="pH 4,01 Voltage"
                          value={sensorConfig?.ph4 ?? ""}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value);
                            setSensorConfig((prev) => prev ? { ...prev, ph4: newValue } : null);
                          }}
                          className='bg-white/80 border-white max-w-[174px] shadow-none text-sm pr-16'
                        />
                        <Button variant={"outline"} disabled className='absolute top-0 right-0'>V</Button>
                      </div>
                      <Button disabled={!isDebug || sensorConfig?.ph4 == null || loadingUpdate == "ph4"} onClick={() => sensorConfig?.ph4 !== undefined && handleSimpan("ph4", sensorConfig.ph4, true)}>
                        {loadingUpdate == "ph4" &&
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                        }
                        Simpan
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col gap-1 mb-3">
                      <h2 className='font-semibold invisible'>pH</h2>
                      <p className='text-sm text-foreground/80'>phVoltage saat <span className="font-bold">pH 6,86</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Input
                          id="ph7"
                          type="number"
                          disabled={!isDebug}
                          placeholder="pH 6,86 Voltage"
                          value={sensorConfig?.ph7 ?? ""}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value);
                            setSensorConfig((prev) => prev ? { ...prev, ph7: newValue } : null);
                          }}
                          className='bg-white/80 border-white max-w-[174px] shadow-none text-sm pr-16'
                        />
                        <Button variant={"outline"} disabled className='absolute top-0 right-0'>V</Button>
                      </div>
                      <Button disabled={!isDebug || sensorConfig?.ph7 == null || loadingUpdate == "ph7"} onClick={() => sensorConfig?.ph7 !== undefined && handleSimpan("ph7", sensorConfig.ph7, true)}>
                        {loadingUpdate == "ph7" &&
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                        }
                        Simpan
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col gap-1 mb-3">
                      <h2 className='font-semibold invisible'>pH</h2>
                      <p className='text-sm text-foreground/80'>phVoltage saat <span className="font-bold">pH 9,18</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Input
                          id="ph9"
                          type="number"
                          disabled={!isDebug}
                          placeholder="pH 9,18 Voltage"
                          value={sensorConfig?.ph9 ?? ""}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value);
                            setSensorConfig((prev) => prev ? { ...prev, ph9: newValue } : null);
                          }}
                          className='bg-white/80 border-white max-w-[174px] shadow-none text-sm pr-16'
                        />
                        <Button variant={"outline"} disabled className='absolute top-0 right-0'>V</Button>
                      </div>
                      <Button disabled={!isDebug || sensorConfig?.ph9 == null || loadingUpdate == "ph9"} onClick={() => sensorConfig?.ph9 !== undefined && handleSimpan("ph9", sensorConfig.ph9, true)}>
                        {loadingUpdate == "ph9" &&
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                        }
                        Simpan
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BAGIKAN AKSES */}
            <div>
              <div className={`${isOwner ? "flex" : "hidden"} flat-glass-container rounded-t-2xl lg:rounded-t-4xl flex-col items-start gap-4 px-4 lg:px-8 pt-3 lg:pt-6 pb-6`}>
                <div className="flex items-center justify-between w-full">
                  <h1 className='text-lg lg:text-xl font-black font-heading mb-2'>Bagikan Akses</h1>
                  {/* <div className="flex items-center gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Switch className={`cursor-pointer ${isShareable ? "bg-primary" : "bg-input"}`} checked={isShareable} />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Berhenti bagikan?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Pengguna lain tidak akan dapat mengakses perangkat ini sampai Anda membagikannya lagi.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel variant='ghost'>Batal</AlertDialogCancel>
                          <AlertDialogAction variant='outline' onClick={handleToggleShareable} autoFocus>Ya</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <p className='text-sm text-foreground font-bold'>Dapat dibagikan</p>
                  </div> */}
                  <div className="flex lg:hidden items-center gap-2">
                    {isShareable
                      ?
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Switch className={`cursor-pointer ${isShareable ? "bg-primary" : "bg-input"}`} checked={isShareable} />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Berhenti bagikan?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Pengguna lain tidak akan dapat mengakses perangkat ini sampai Anda membagikannya lagi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel variant='ghost'>Batal</AlertDialogCancel>
                            <AlertDialogAction variant='outline' onClick={handleToggleShareable} autoFocus>Ya</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      :
                      <Switch className={`cursor-pointer ${isShareable ? "bg-primary" : "bg-input"}`} checked={isShareable} onClick={handleToggleShareable} />
                    }
                    <p className='text-sm text-foreground'>Dapat dibagikan</p>
                  </div>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={"outline"} onClick={handleCopy} className="rounded-xl">ID: {selectedDevice?.id} <Copy /></Button>
                  </TooltipTrigger>
                  <TooltipContent side='right' sideOffset={5}>
                    <p>Salin ID</p>
                  </TooltipContent>
                </Tooltip>
                <div className={`flex flex-col gap-2 w-full bg-white/20 rounded-2xl px-6 py-4 border border-white/60 transition-colors ${!isShareable && "text-muted-foreground/50"}`}>
                  <div className="flex items-center justify-between py-2">
                    <p className='text-sm'>Dibagikan dengan:</p>
                    <div className="hidden lg:flex items-center gap-2">
                      {isShareable
                        ?
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Switch className={`cursor-pointer ${isShareable ? "bg-primary" : "bg-input"}`} checked={isShareable} />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Berhenti bagikan?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Pengguna lain tidak akan dapat mengakses perangkat ini sampai Anda membagikannya lagi.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel variant='ghost'>Batal</AlertDialogCancel>
                              <AlertDialogAction variant='outline' onClick={handleToggleShareable} autoFocus>Ya</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        :
                        <Switch className={`cursor-pointer ${isShareable ? "bg-primary" : "bg-input"}`} checked={isShareable} onClick={handleToggleShareable} />
                      }
                      <p className='text-sm font-semibold text-foreground'>Dapat dibagikan</p>
                    </div>
                  </div>
                  <hr className='mb-2' />
                  <div className="flex flex-col gap-4">
                    {loadingUsers
                      ?
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full bg-muted-foreground/40" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px] bg-muted-foreground/40" />
                          <Skeleton className="h-4 w-[200px] bg-muted-foreground/40" />
                        </div>
                      </div>
                      :
                      users.length > 0
                        ?
                        users.map((user) => (
                          <div key={user.uid} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <UserCircle2 className='opacity-80 shrink-0' />
                              <div className="flex flex-col">
                                <p className='text-sm font-semibold'>{user.name}</p>
                                <p className='text-xs '>{user.email}</p>
                              </div>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="p-0 h-auto w-auto"
                                >
                                  <CircleMinus className="text-destructive size-6" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Hentikan berbagi data perangkat dengan {user.email}. Pengguna dapat menambahkan kembali perangkat Anda.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction variant='destructive' onClick={() => handleRemoveUser(user.uid)}>Hapus</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ))
                        :
                        <div className="flex flex-col items-center justify-center gap-4 my-4">
                          <Image src="/no_data.svg" width={80} height={80} alt="No data" className='opacity-50' />
                          <p className='text-sm text-muted-foreground'>Tidak ada pengguna yang menambahkan perangkat ini</p>
                        </div>
                    }
                  </div>
                </div>
              </div>
              <div className={`${isOwner ? "flex" : "hidden"} flat-glass-container !bg-white/20 !border-t-0 rounded-b-3xl lg:rounded-b-4xl items-center gap-3 px-3 lg:px-8 pt-6 pb-3 lg:py-6`}>
                <Info className='size-5 text-muted-foreground shrink-0' />
                <p className='text-xs lg:text-sm text-muted-foreground'>Anda dapat membagikan akses data perangkat ini dengan pengguna lain tanpa akses mengubah / mengontrol perangkat <span className="italic">(read-only)</span>.</p>
              </div>
            </div>

            {/* PENGATURAN PERANGKAT */}
            <div className={`glass-container ${isOwner ? "flex" : "hidden"} flex-col items-start gap-4`}>
              <h1 className='text-lg lg:text-xl font-black font-heading'>Pengaturan Perangkat</h1>
              {/* INPUT INFO PERANGKAT */}
              <div className='w-full'>
                <div className="bg-white/40 border border-white/60 rounded-lg lg:rounded-2xl rounded-b-none px-3 py-3 lg:px-6 lg:py-4 w-full">
                  <div className="flex flex-col gap-1 mb-3">
                    <h2 className='font-semibold'>Nama</h2>
                    <p className='text-sm text-foreground/80'>Ini adalah nama untuk memudahkan Anda dalam mengidentifikasi perangkat.</p>
                  </div>
                  <Input className='bg-white/80 border-white max-w-sm shadow-none text-sm' value={deviceName} onChange={(e) => setDeviceName(e.target.value)} type="text" id="nama" placeholder="Nama Perangkat" />
                </div>
                <div className="bg-white/10 border border-white/60 border-t-0 px-6 py-3 rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <p className="text-xs lg:text-sm text-muted-foreground">Mohon gunakan minimal 1 karakter.</p>
                    <Button disabled={deviceName.length < 1 || loadingUpdate == "name"} onClick={() => handleSimpan("name", deviceName)}>
                      {loadingUpdate == "name" &&
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      }
                      Simpan
                    </Button>
                  </div>
                </div>
              </div>
              <div className='w-full'>
                <div className="bg-white/40 border border-white/60 rounded-lg lg:rounded-2xl rounded-b-none px-3 py-3 lg:px-6 lg:py-4 w-full">
                  <div className="flex flex-col gap-1 mb-3">
                    <h2 className='font-semibold'>Lokasi</h2>
                    <p className='text-sm text-foreground/80'>Ini adalah lokasi di mana perangkat dilakukan instalasi.</p>
                  </div>
                  <Textarea className='bg-white/80 border-white shadow-none text-sm' value={deviceLocation} onChange={(e) => setDeviceLocation(e.target.value)} id="lokasi" placeholder="Lokasi Perangkat" />
                </div>
                <div className="bg-white/10 border border-white/60 border-t-0 px-6 py-3 rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <p className="text-xs lg:text-sm text-muted-foreground">Mohon gunakan minimal 1 karakter.</p>
                    <Button disabled={deviceLocation.length < 1 || loadingUpdate == "location"} onClick={() => handleSimpan("location", deviceLocation)}>
                      {loadingUpdate == "location" &&
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      }
                      Simpan
                    </Button>
                  </div>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"destructive"} className="mt-4">Hapus Perangkat</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Hapus perangkat {selectedDevice?.name} dari akun ini. Data perangkat tidak akan dihapus dari server.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction variant='destructive' onClick={handleHapusPerangkat}>Hapus</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
