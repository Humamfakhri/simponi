"use client";

import Gauge from "@/components/Gauge";
import { Button } from "@/components/ui/button";
import { LastUpdated, useDevicesRealtime } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Device } from "@/model/Device";
import { Bubbles, Calendar, Droplets, MapPin, Milk, Plus, Thermometer, Upload, Waves } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { devices, loading } = useDevicesRealtime();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    if (devices.length > 0) {
      setSelectedDevice(devices[0]); // pilih device pertama secara default
    }
  }, [devices]);

  if (loading) {
    return (
      <main className="bg-radial-[at_50%_75%] from-emerald-200 via-sky-200 to-[#d7d9db] to-90% py-8">
        <div className="container mx-auto min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-400"></div>
        </div>
      </main>
    );
  }



  return (
    <main className="min-h-screen bg-radial-[at_50%_75%] from-emerald-200 via-sky-200 to-[#d7d9db] to-90% py-8">
      {/* <main className="bg-radial-[at_50%_75%] from-[#b3beda] to-[#d7d9db] to-90% py-8"> */}
      {/* <main className="bg-linear-to-b from-[#dbdbdb] to-[#b3beda]"> */}
      <div className="container mx-auto">
        <h1 className="text-4xl text-center lg:text-start font-black font-heading mt-28 mb-8 mx-8">Dashboard</h1>
        {devices && devices.length === 0 && selectedDevice == null
          ?
          <div className="text-center text-muted-foreground">
            <p className="text-lg">No devices found</p>
            <p className="text-sm">Please add a device to get started</p>
          </div>
          :
          <div className="px-8 py-8 glass rounded-4xl relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <div className="relative bg-white/20 pt-3 pb-4 px-6 rounded-b-4xl border border-white/60">
                {/* <div className="absolute -right-6 top-0 h-full w-12 bg-[#ffffff4d] rounded-l-full z-0"></div> */}
                {/* <div className="absolute -left-6 top-0 h-full w-12 bg-[#d7d9db] rounded-r-full z-0"></div> */}
                {/* <div className="flex items-center gap-6">
                <div className="flex items-center justify-center size-12 bg-primary rounded-full text-white">
                  A
                </div>
                <div className="flex items-center justify-center size-12 bg-white rounded-full">
                  B
                </div>
                <div className="flex items-center justify-center size-12 bg-white rounded-full">
                  C
                </div>
              </div> */}

                <div className="flex items-center gap-6">
                  {devices?.map((device, index) => (
                    <div
                      key={device.id}
                      onClick={() => setSelectedDevice(device)}
                      className={cn(
                        "flex items-center justify-center size-12 rounded-full cursor-pointer transition-all",
                        selectedDevice?.id === device.id
                          ? "bg-primary text-white"
                          : "bg-white text-primary"
                      )}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col gap-2 mt-16 lg:mt-0">
                <div className="flex items-center gap-2">
                  {selectedDevice?.status === true ? (
                    <span className="relative flex size-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex size-3 rounded-full bg-emerald-500"></span>
                    </span>
                  ) : (
                    <span className="relative flex size-3">
                      {/* <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span> */}
                      <span className="relative inline-flex size-3 rounded-full bg-red-600"></span>
                    </span>
                  )}
                  <h2 className="text-xl font-black font-heading">{selectedDevice?.name}</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin strokeWidth={1} className="size-4" />
                  <p className="font-light max-w-xs lg:max-w-xl truncate">{selectedDevice?.location}</p>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center gap-2">
                <Button variant={"outline"} className="bg-transparent border-ring/60 rounded-full aspect-square h-full">
                  <Plus className="size-4 text-foreground/80" />
                </Button>
                <Button variant={"outline"} className="bg-transparent border-ring/60 rounded-full aspect-square h-full">
                  <Upload className="size-4 text-foreground/80" />
                </Button>
                <Button variant={"outline"} className="bg-transparent border-ring/60 rounded-full aspect-square h-full">
                  <Calendar className="size-4 text-foreground/80" />
                </Button>
              </div>
            </div>
            <div className="flex justify-center items-center mb-6 text-muted-foreground mt-12">
              {selectedDevice?.status ?
                <div className="flex flex-col items-center border border-white px-5 py-3 rounded-md bg-white/40">
                  <small>Terakhir diperbarui:</small>
                  <span className="text-sm font-semibold">
                    <LastUpdated
                      timestamp={selectedDevice?.latestReading?.timestamp?.toString() || ""}
                      deviceId={selectedDevice?.id || ""}
                    />
                  </span>
                </div>
                :
                <div className="flex flex-col items-center border border-white px-5 py-3 rounded-md bg-red-100 text-red-500">
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 justify-center items-center">
              <div className="relative flex flex-col items-center justify-center w-full grow bg-white/40 border border-white rounded-3xl pt-3 pb-4">
                <div className="flex items-center gap-2 justify-start w-full px-4">
                  <div className="flexCenter p-1 rounded-md shadow-md shadow-emerald-400">
                    {/* <div className="absolute top-0 left-0 m-4 flexCenter p-1  rounded-md shadow-md shadow-emerald-400"> */}
                    <Milk className="text-emerald-400 size-5" />
                  </div>
                  <p className="text-emerald-500 font-heading">Nutrisi</p>
                </div>
                <Gauge
                  minValue={600}
                  value={selectedDevice?.latestReading?.TDS}
                  maxValue={1000}
                  ticks={[
                    { value: 700 },
                    { value: 900 },
                    { value: 1000 }
                  ]}
                  subArcs={[
                    { limit: 700 },
                    { limit: 900 },
                    { limit: 1000 },
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
                  minValue={5}
                  value={selectedDevice?.latestReading?.water_pH}
                  maxValue={8}
                  ticks={[
                    { value: 6 },
                    { value: 7 },
                    { value: 8 }
                  ]}
                  subArcs={[
                    { limit: 6 },
                    { limit: 7 },
                    { limit: 8 }
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
                  maxValue={26}
                  ticks={[
                    { value: 17 },
                    { value: 22 },
                    { value: 26 }
                  ]}
                  subArcs={[
                    { limit: 17 },
                    { limit: 22 },
                    { limit: 26 }
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
                  maxValue={70}
                  ticks={[
                    { value: 40 },
                    { value: 60 },
                    { value: 70 }
                  ]}
                  subArcs={[
                    { limit: 40 },
                    { limit: 60 },
                    { limit: 70 }
                  ]}
                />
                <h5 className="-mt-6 text-foreground/80 text-2xl">cm</h5>
              </div>
              <div className="lg:col-span-4 grid grid-cols-subgrid gap-4 mx-auto w-full">
                <div className="col-start-2 relative flex flex-col items-center justify-center w-full grow bg-white/40 border border-white rounded-3xl px-4 pt-3 pb-4">
                  <div className="flex items-center gap-2 justify-start w-full">
                    <div className="flexCenter p-1 rounded-md shadow-md shadow-emerald-400">
                      <Thermometer className="text-emerald-400 size-5" />
                    </div>
                    <p className="text-emerald-500 font-heading">Suhu Udara</p>
                  </div>
                  <Gauge
                    minValue={14}
                    value={selectedDevice?.latestReading?.air_temp}
                    maxValue={26}
                    ticks={[
                      { value: 17 },
                      { value: 22 },
                      { value: 26 }
                    ]}
                    subArcs={[
                      { limit: 17 },
                      { limit: 22 },
                      { limit: 26 }
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
              {/* <div crelative lassName="flex flex-col items-center justify-center w-full grow bg-white/40 border border-white rounded-3xl pt-3 pb-4">
              <di className="absolute top-0 left-0 m-4 flexCenter p-1 border-1 border-emerald-400 rounded-md">
                <Gauge value={selectedDevice?.latestReading?.TDS5 />
                <h5 className="-mt-6 text-foreground/80 text-2xl">V</h5>
                <Dam/></di className="text-emerald-400 size-5"v>
              </div> */}
            </div>
            {/* <hr className="border-white my-10" />
            <h2 className="text-foreground/80 font-heading text-xl font-black">Konfigurasi Otomasi</h2> */}
          </div>
        }
      </div>
    </main>
  )
}
