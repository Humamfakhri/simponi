"use client";

import Gauge from "@/components/Gauge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addDeviceToUser, auth, getDocument, LastUpdated, useDevicesRealtime } from "@/lib/firebase";
import { Device } from "@/model/Device";
import { Bubbles, ChartColumn, CircleAlert, Droplets, MapPin, Milk, Plus, Search, Thermometer, Vault, Waves } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Sidebar from "@/components/Sidebar";
import { showToast } from "@/components/showToast";

export default function DashboardPage() {
  const { devices, loading } = useDevicesRealtime();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [addDeviceCode, setAddDeviceCode] = useState("");
  const [errorSearchDevice, setErrorSearchDevice] = useState<string | null>(null);
  const [isLoadingDeviceCode, setIsLoadingDeviceCode] = useState(false);
  const [isLoadingAddingDevice, setIsLoadingAddingDevice] = useState(false);
  const [isDeviceFound, setIsDeviceFound] = useState(false);
  const [newDeviceCode, setNewDeviceCode] = useState<Device | null>(null);
  const currentUser = auth.currentUser

  useEffect(() => {
    if (devices.length > 0) {
      setSelectedDevice(devices[0] || null);
    }
    // console.log(devices);
  }, [devices]);

  const handleSearchDevice = async (code: string) => {
    setErrorSearchDevice(null);
    try {
      setIsLoadingDeviceCode(true);
      await getDocument<Device>("devices", code)
        .then((device) => {
          if (device) {
            setNewDeviceCode(device);
            setIsDeviceFound(true);
          } else {
            setIsDeviceFound(false);
            setErrorSearchDevice("Kode perangkat tidak ditemukan");
          }
        });
    } catch (error) {
      // console.error("Login gagal:", error);
      setErrorSearchDevice(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoadingDeviceCode(false);
    }
  };

  const handleAddDevice = async () => {
    setIsLoadingAddingDevice(true);
    const result = await addDeviceToUser("btpNonAc");
    if (result.success) {
      showToast({ message: "Berhasil menambahkan perangkat", variant: "success" })
      setAddDeviceCode("");
      setIsDeviceFound(false);
      setNewDeviceCode(null);
    } else {
      showToast({ message: "Gagal menambahkan perangkat", variant: "error" })
      console.error("Gagal menambahkan perangkat:", result.message);
    }
    setIsLoadingAddingDevice(false);
  };

  useEffect(() => {
    // showToast({ message: "Berhasil mengubah peraturan", Icon: <CircleCheck className={"text-primary"} /> })
  }, [])

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
      {/* <main className="bg-radial-[at_50%_75%] from-[#b3beda] to-[#d7d9db] to-90% py-8"> */}
      {/* <main className="bg-linear-to-b from-[#dbdbdb] to-[#b3beda]"> */}
      <div className="container mx-auto mt-32 lg:mt-24 mb-16 lg:mb-8">
        {devices && devices.length === 0 && selectedDevice == null
          ?
          <div className="grow flex flex-col gap-4 items-center px-3 lg:px-8 py-12 mx-2 glass rounded-4xl text-center text-muted-foreground">
            <Image
              src="/question_mark.svg"
              // src="/empty.svg"
              alt="Empty"
              width={200}
              height={200}
              className="opacity-70 mb-4"
            />
            <p className="">Tidak ada perangkat ditemukan</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="text-white" strokeWidth={3} /> Perangkat</Button>
              </DialogTrigger>
              <DialogContent showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle className="font-heading font-bold">Tambah Perangkat</DialogTitle>
                </DialogHeader>
                <div className="mt-2 flex flex-col gap-2">
                  <form className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSearchDevice(addDeviceCode);
                    }}
                  >
                    <Input
                      placeholder="Kode Perangkat"
                      value={addDeviceCode}
                      onChange={(e) => setAddDeviceCode(e.target.value)}
                    />
                    <Button
                      // type="button"
                      // onClick={() => handleSearchDevice(addDeviceCode)}
                      disabled={addDeviceCode.length < 3}
                    >
                      {isLoadingDeviceCode
                        ?
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
                        :
                        <Search />
                      }
                    </Button>
                  </form>
                  <small className="text-xs text-muted-foreground">Petunjuk: Biasanya terdapat label kode pada perangkat</small>
                  {errorSearchDevice != null &&
                    <small className="text-destructive">{errorSearchDevice}</small>
                  }
                </div>
                {isDeviceFound &&
                  <div className="flex flex-col gap-4">
                    <hr className="w-full" />
                    <h1 className="font-bold font-heading">Perangkat Ditemukan:</h1>
                    <div className="flex items-center gap-2">
                      <Vault className="size-11 text-foreground/70" />
                      <div>
                        <p>{newDeviceCode?.name}</p>
                        <p className="text-sm text-muted-foreground">{newDeviceCode?.location}</p>
                      </div>
                    </div>
                    <div className="flex justify-end items-center gap-4 mt-2">
                      <DialogClose asChild>
                        <Button
                          variant="ghost"
                        >
                          Batal
                        </Button>
                      </DialogClose>
                      <Button
                        autoFocus
                        variant="default"
                        onClick={handleAddDevice}
                        disabled={isLoadingAddingDevice}
                      >
                        {isLoadingAddingDevice
                          ?
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
                          :
                          "Tambahkan"
                        }
                      </Button>
                    </div>
                  </div>
                }
              </DialogContent>
            </Dialog>
          </div>
          :
          <div className="flex items-start gap-4">
            <Sidebar />
            <div className="grow">
              <div className="px-3 lg:px-8 py-6 mx-2 mt-4 glass rounded-4xl relative">
                {/* DEVICES TAB */}
                <div className="absolute top-0 right-0">
                  <div className="relative bg-white/10 pt-3 pb-4 px-6 rounded-bl-4xl rounded-tr-4xl border border-white/60">
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
                      <Button variant={"outline"} className="flex items-center justify-center size-12 rounded-full cursor-pointer transition-all border border-ring/60 bg-transparent">
                        <Plus className="size-4 text-secondary-foreground" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col gap-2 mt-24 lg:mt-0">
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
                  </div>
                </div>
                <div className={`${!selectedDevice?.isShareable && selectedDevice?.owner != currentUser?.uid ? "flex" : "hidden"} flex-col items-center gap-2 text-muted-foreground border border-white/60 px-8 py-8 rounded-md bg-white/20`}>
                  <CircleAlert />
                  <span className="text-xs">Pemilik perangkat menonaktifkan fitur bagikan data.</span>
                </div>
                <div className={`${selectedDevice?.isShareable || selectedDevice?.owner == currentUser?.uid ? "flex" : "hidden"} justify-center items-center mb-8 text-muted-foreground mt-12`}>
                  {selectedDevice?.status ?
                    <div className="flex flex-col items-center border border-white/60 px-8 py-3 rounded-md bg-white/20">
                      <span className="text-xs">Terakhir diperbarui:</span>
                      <span className="text-sm font-semibold">
                        <LastUpdated
                          timestamp={selectedDevice?.latestReading?.timestamp?.toString() || ""}
                          deviceId={selectedDevice?.id || ""}
                        />
                      </span>
                    </div>
                    :
                    <div className="flex flex-col items-center border border-white/60 px-8 py-3 rounded-md bg-white/20 text-slate-500">
                      <span className="text-xs">Terakhir diperbarui:</span>
                      <span className="text-sm font-semibold">
                        <LastUpdated
                          timestamp={selectedDevice?.latestReading?.timestamp?.toString() || ""}
                          deviceId={selectedDevice?.id || ""}
                        />
                      </span>
                      {/* <CircleAlert className="text-red-500 size-5 mb-1" /> */}
                    </div>
                  }
                </div>
                <div className={selectedDevice?.isShareable || selectedDevice?.owner == currentUser?.uid ? "block" : "hidden"}>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 justify-center items-center">
                    <div className="relative flex flex-col items-center justify-center w-full grow bg-white/40 border border-white rounded-3xl pt-3 pb-4">
                      <div className="flex items-center gap-2 justify-start w-full px-4">
                        <div className="flexCenter p-1 rounded-md shadow-md shadow-emerald-400">
                          {/* <div className="absolute top-0 left-0 m-4 flexCenter p-1  rounded-md shadow-md shadow-emerald-400"> */}
                          <Milk className="text-emerald-400 size-5" />
                        </div>
                        <p className="text-emerald-500 font-heading">TDS</p>
                      </div>
                      <Gauge
                        minValue={0}
                        value={selectedDevice?.latestReading?.TDS}
                        maxValue={1100}
                        ticks={[
                          { value: 700 },
                          { value: 900 },
                          { value: 1100 }
                        ]}
                        subArcs={[
                          { limit: 700 },
                          { limit: 900 },
                          { limit: 1100 },
                        ]}
                      />
                      <h5 className="-mt-6 text-foreground/80 text-2xl">PPM</h5>
                    </div>
                    <div className="relative flex flex-col items-center justify-center w-full grow bg-white/40 border border-white rounded-3xl pt-3 pb-4">
                      <div className="flex items-center gap-2 justify-start w-full px-4">
                        <div className="flexCenter p-1 rounded-md shadow-md shadow-emerald-400">
                          <Droplets className="text-emerald-400 size-5" />
                        </div>
                        <p className="text-emerald-500 font-heading">pH</p>
                      </div>
                      <Gauge
                        minValue={4}
                        value={selectedDevice?.latestReading?.water_pH}
                        maxValue={9}
                        ticks={[
                          { value: 6 },
                          { value: 7.5 },
                          { value: 9 }
                        ]}
                        subArcs={[
                          { limit: 6 },
                          { limit: 7.5 },
                          { limit: 9 }
                          // { limit: 500 },
                          // { limit: 600 },
                          // { limit: 800 },
                        ]}
                      />
                      <h5 className="-mt-6 text-foreground/80 text-2xl">pH</h5>
                    </div>
                    <div className="relative flex flex-col items-center justify-center w-full grow bg-white/40 border border-white rounded-3xl pt-3 pb-4">
                      <div className="flex items-center gap-2 justify-start w-full px-4">
                        <div className="flexCenter p-1 rounded-md shadow-md shadow-emerald-400">
                          <Thermometer className="text-emerald-400 size-5" />
                        </div>
                        <p className="text-emerald-500 font-heading">Suhu Air</p>
                      </div>
                      <Gauge
                        minValue={14}
                        value={selectedDevice?.latestReading?.water_temp}
                        maxValue={30}
                        ticks={[
                          { value: 17 },
                          { value: 22 },
                          { value: 30 }
                        ]}
                        subArcs={[
                          { limit: 17 },
                          { limit: 22 },
                          { limit: 30 }
                        ]}
                      />
                      <h5 className="-mt-6 text-foreground/80 text-2xl">°C</h5>
                    </div>
                    <div className="relative flex flex-col items-center justify-center w-full grow bg-white/40 border border-white rounded-3xl pt-3 pb-4">
                      <div className="flex items-center gap-2 justify-start w-full px-4">
                        <div className="flexCenter p-1 rounded-md shadow-md shadow-emerald-400">
                          <Waves className="text-emerald-400 size-5" />
                        </div>
                        <p className="text-emerald-500 font-heading">Ketinggian Air</p>
                      </div>
                      <Gauge
                        minValue={30}
                        value={selectedDevice?.latestReading?.water_level}
                        maxValue={100}
                        ticks={[
                          { value: 40 },
                          { value: 60 },
                          { value: 100 }
                        ]}
                        subArcs={[
                          { limit: 40 },
                          { limit: 60 },
                          { limit: 100 }
                        ]}
                      />
                      <h5 className="-mt-6 text-foreground/80 text-2xl">cm</h5>
                    </div>
                    <div className="lg:col-span-4 grid grid-cols-subgrid gap-4 mx-auto w-full">
                      <div className="col-start-2 relative flex flex-col items-center justify-center w-full grow bg-white/40 border border-white rounded-3xl pt-3 pb-4">
                        <div className="flex items-center gap-2 justify-start w-full px-4">
                          <div className="flexCenter p-1 rounded-md shadow-md shadow-emerald-400">
                            <Thermometer className="text-emerald-400 size-5" />
                          </div>
                          <p className="text-emerald-500 font-heading">Suhu Udara</p>
                        </div>
                        <Gauge
                          minValue={14}
                          value={selectedDevice?.latestReading?.air_temp}
                          maxValue={32}
                          ticks={[
                            { value: 17 },
                            { value: 22 },
                            { value: 32 }
                          ]}
                          subArcs={[
                            { limit: 17 },
                            { limit: 22 },
                            { limit: 32 }
                          ]}
                        />
                        <h5 className="-mt-6 text-foreground/80 text-2xl">°C</h5>
                      </div>
                      <div className="relative flex flex-col items-center justify-center w-full grow bg-white/40 border border-white rounded-3xl pt-3 pb-4">
                        <div className="flex items-center gap-2 justify-start w-full px-4">
                          <div className="flexCenter p-1 rounded-md shadow-md shadow-emerald-400">
                            <Bubbles className="text-emerald-400 size-5" />
                          </div>
                          <p className="text-emerald-500 font-heading">Kelembapan</p>
                        </div>
                        <Gauge
                          minValue={30}
                          value={selectedDevice?.latestReading?.air_humidity}
                          maxValue={100}
                          ticks={[
                            { value: 50 },
                            { value: 80 },
                            { value: 100 }
                          ]}
                          subArcs={[
                            { limit: 50 },
                            { limit: 80 },
                            { limit: 100 }
                          ]}
                        />
                        <h5 className="-mt-6 text-foreground/80 text-2xl">%</h5>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center mt-8">
                    <Button variant={"glass"}><ChartColumn />Lihat histori</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </main>
  )
}
