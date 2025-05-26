"use client";

import Gauge from "@/components/Gauge";
import { Button } from "@/components/ui/button";
import { getDocuments } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Device } from "@/model/Device";
import { Bubbles, Calendar, Dam, Droplets, MapPin, Milk, Plus, Thermometer, Upload, Waves } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {

  // const [devices, setDevices] = useState<Device[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [devices, setDevices] = useState<Device[] | null>([])
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(devices ? devices[0] : null)

  useEffect(() => {
    setLoading(true);
    getDocuments<Device>("devices")
      .then((data) => {
        setDevices(data);
        if (data.length > 0) {
          setSelectedDevice(data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
      })
      .finally(() => {
        setLoading(false); // ✅ dijalankan setelah selesai atau error
      });
  }, []);


  if (loading) {
    return (
      <main className="bg-radial-[at_50%_75%] from-emerald-200 via-sky-200 to-[#d7d9db] to-90% py-8">
        <div className="container mx-auto min-h-screen flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-radial-[at_50%_75%] from-emerald-200 via-sky-200 to-[#d7d9db] to-90% py-8">
      {/* <main className="bg-radial-[at_50%_75%] from-[#b3beda] to-[#d7d9db] to-90% py-8"> */}
      {/* <main className="bg-linear-to-b from-[#dbdbdb] to-[#b3beda]"> */}
      <div className="min-h-screen container mx-auto">
        <h1 className="text-3xl font-black font-heading mt-20 mb-6">Dashboard</h1>
        {devices && devices.length === 0
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
            <div className="flex items-center justify-between mb-12">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-black font-heading">{selectedDevice?.name}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin strokeWidth={1} className="size-4" />
                  <p className="font-light max-w-xl truncate">{selectedDevice?.location}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
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
            <div className="grid grid-cols-4 gap-4 justify-center items-center">
              <div className="relative flex flex-col items-center justify-center w-full grow bg-white/40 border border-white rounded-3xl pt-3 pb-4">
                <div className="absolute top-0 left-0 m-4 flexCenter p-1  rounded-md shadow-md shadow-emerald-400">
                  <Milk className="text-emerald-400 size-5" />
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
                <div className="absolute top-0 left-0 m-4 flexCenter p-1  rounded-md shadow-md shadow-emerald-400">
                  <Droplets className="text-emerald-400 size-5" />
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
                <div className="absolute top-0 left-0 m-4 flexCenter p-1  rounded-md shadow-md shadow-emerald-400">
                  <Dam className="text-emerald-400 size-5" />
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
                <div className="absolute top-0 left-0 m-4 flexCenter p-1  rounded-md shadow-md shadow-emerald-400">
                  <Waves className="text-emerald-400 size-5" />
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
              <div className="col-span-4 grid grid-cols-subgrid gap-4 mx-auto w-full">
                <div className="col-start-2 relative flex flex-col items-center justify-center w-full grow bg-white/40 border border-white rounded-3xl pt-3 pb-4">
                  <div className="absolute top-0 left-0 m-4 flexCenter p-1  rounded-md shadow-md shadow-emerald-400">
                    <Thermometer className="text-emerald-400 size-5" />
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
                  <div className="absolute top-0 left-0 m-4 flexCenter p-1  rounded-md shadow-md shadow-emerald-400">
                    <Bubbles className="text-emerald-400 size-5" />
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
          </div>
        }
        {/* CONTAINER BAWAH */}
        {/* <div className="grid grid-cols-2 gap-8 my-8">
          <div className="px-8 py-8 glass rounded-4xl relative">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-xl font-heading font-bold">New Case Management</h2>
              <div className="flex items-center justify-center gap-2">
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
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white/90 w-full h-full aspect-square rounded-2xl"></div>
              <div className="bg-white/90 w-full h-full aspect-square rounded-2xl"></div>
              <div className="bg-white/90 w-full h-full aspect-square rounded-2xl"></div>
              <div className="bg-white/90 w-full h-full aspect-square rounded-2xl"></div>
            </div>
          </div>
          <div className="px-8 py-8 glass rounded-4xl relative">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-xl font-heading font-bold">New Case Management</h2>
              <div className="flex items-center justify-center gap-2">
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
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white/90 w-full h-full aspect-square rounded-2xl"></div>
              <div className="bg-white/90 w-full h-full aspect-square rounded-2xl"></div>
              <div className="bg-white/90 w-full h-full aspect-square rounded-2xl"></div>
              <div className="bg-white/90 w-full h-full aspect-square rounded-2xl"></div>
            </div>
          </div>
        </div> */}
      </div>
    </main>
  )
}
