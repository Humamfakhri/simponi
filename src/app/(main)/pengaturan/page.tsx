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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { auth, removeDeviceFromUser, updateDocument, useDevicesRealtime } from "@/lib/firebase";
import { Device } from "@/model/Device";
import { Copy, Info, MapPin, Plus, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PengaturanPage() {
  const { devices, loading } = useDevicesRealtime();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isShareable, setIsShareable] = useState<boolean>(selectedDevice?.isShareable || false);
  const currentUser = auth.currentUser
  const isOwner = currentUser?.uid === selectedDevice?.owner;
  const [deviceName, setDeviceName] = useState(selectedDevice?.name || "");
  const [deviceLocation, setDeviceLocation] = useState(selectedDevice?.location || "");
  const [loadingUpdate, setLoadingUpdate] = useState("")

  const router = useRouter();

  useEffect(() => {
    if (devices.length > 0) {
      setSelectedDevice(devices[0] || null);
      setDeviceName(devices[0].name || "");
      setDeviceLocation(devices[0].location || "");
    }
  }, [devices]);

  useEffect(() => {
    if (selectedDevice) {
      setIsShareable(selectedDevice.isShareable);
      setDeviceName(selectedDevice.name || "");
      setDeviceLocation(selectedDevice.location || "");
    }
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
      console.error("Gagal menyalin:", error);
    }
  };

  const handleSimpan = async (field: string, value: string) => {
    if (!selectedDevice) return;

    if (field === "name") {
      setLoadingUpdate("name");
    } else if (field === "location") {
      setLoadingUpdate("location");
    }

    try {
      const result = await updateDocument("devices", selectedDevice?.id, {
        field: value,
      });
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
      <main className="bg-radial-[at_50%_75%] from-emerald-200 via-sky-100 to-[#d7d9db] to-90% py-8">
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
            <div className="glass-container">
              {/* DEVICES TAB */}
              <div className="absolute top-0 right-1/2 lg:right-0 translate-x-1/2 lg:translate-x-0">
                {/* <div className="absolute top-0 left-1/2 -translate-x-1/2"> */}
                <div className="relative bg-white/10 pt-3 pb-4 px-6 rounded-b-4xl lg:rounded-br-none lg:rounded-bl-4xl lg:rounded-tr-4xl border border-white/60">
                  <div className="flex items-center gap-6">
                    {devices?.map((device, index) => (
                      <Button
                        key={device.id}
                        onClick={() => setSelectedDevice(device)}
                        variant={selectedDevice?.id === device.id ? "dark" : "glass"}
                        className="size-12 rounded-full cursor-pointer transition-all"
                      >
                        {index + 1}
                      </Button>
                    ))}
                    <AddDeviceDialog>
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
            <div className={`glass-container ${isOwner ? "flex" : "hidden"} flex-col items-start gap-4 ${selectedDevice?.isShareable && !isOwner && "text-muted-foreground"}`}>
              <h1 className='text-lg lg:text-xl font-black font-heading'>Konfigurasi Parameter</h1>

            </div>

            {/* BAGIKAN AKSES */}
            <div>
              <div className={`${isOwner ? "flex" : "hidden"} flat-glass-container rounded-t-2xl lg:rounded-t-4xl flex-col items-start gap-4 px-4 lg:px-8 pt-3 lg:pt-6 pb-6`}>
                <div className="flex items-center justify-between w-full">
                  <h1 className='text-lg lg:text-xl font-black font-heading'>Bagikan Akses</h1>
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
                    <div className="flex items-center gap-3">
                      <UserCircle2 className='opacity-80 shrink-0' />
                      <div className="flex flex-col">
                        <p className='text-sm font-semibold'>Bebas</p>
                        <p className='text-xs '>bebas@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <UserCircle2 className='opacity-80 shrink-0' />
                      <div className="flex flex-col">
                        <p className='text-sm font-semibold'>Bebas</p>
                        <p className='text-xs '>bebas@gmail.com</p>
                      </div>
                    </div>
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
                  <Input className='bg-white/80 border-white max-w-sm shadow-none' value={deviceName} onChange={(e) => setDeviceName(e.target.value)} type="text" id="nama" placeholder="Nama Perangkat" />
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
                  <Textarea className='bg-white/80 border-white shadow-none' value={deviceLocation} onChange={(e) => setDeviceLocation(e.target.value)} id="lokasi" placeholder="Lokasi Perangkat" />
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
