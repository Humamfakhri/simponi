import Gauge from "@/components/Gauge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Plus, Upload } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="bg-radial-[at_50%_75%] from-emerald-200 via-sky-200 to-[#d7d9db] to-90% py-8">
      {/* <main className="bg-radial-[at_50%_75%] from-[#b3beda] to-[#d7d9db] to-90% py-8"> */}
      {/* <main className="bg-linear-to-b from-[#dbdbdb] to-[#b3beda]"> */}
      <div className="min-h-screen container mx-auto">
        <h1 className="text-3xl font-black font-heading mt-20 mb-6">Dashboard</h1>
        <div className="px-8 py-8 glass rounded-4xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <div className="relative bg-white/20 pt-3 pb-4 px-6 rounded-b-4xl border border-white/60">
              {/* <div className="absolute -right-6 top-0 h-full w-12 bg-[#ffffff4d] rounded-l-full z-0"></div> */}
              {/* <div className="absolute -left-6 top-0 h-full w-12 bg-[#d7d9db] rounded-r-full z-0"></div> */}
              <div className="flex items-center gap-6">
                <div className="flex items-center justify-center size-12 bg-primary rounded-full text-white">
                  A
                </div>
                <div className="flex items-center justify-center size-12 bg-white rounded-full">
                  B
                </div>
                <div className="flex items-center justify-center size-12 bg-white rounded-full">
                  C
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-12">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold">SIMPONI A</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin strokeWidth={1} className="size-4" />
                <p className="font-light">Jl. Telekomunikasi No. 1, Telkom University</p>
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
            <div className="flex flex-col items-center justify-center w-full grow bg-white/50 border border-white rounded-3xl ">
              <Gauge value={300}/>
              <h5 className="-mt-4 font-bold text-foreground/80 text-2xl">PPM</h5>
            </div>
            <div className="flex flex-col items-center justify-center w-full grow bg-white/50 border border-white rounded-3xl ">
              <Gauge value={300}/>
              <h5 className="-mt-4 font-bold text-foreground/80 text-2xl">PPM</h5>
            </div>
            <div className="flex flex-col items-center justify-center w-full grow bg-white/50 border border-white rounded-3xl ">
              <Gauge value={300}/>
              <h5 className="-mt-4 font-bold text-foreground/80 text-2xl">PPM</h5>
            </div>
            <div className="flex flex-col items-center justify-center w-full grow bg-white/50 border border-white rounded-3xl ">
              <Gauge value={400}/>
              <h5 className="-mt-4 font-bold text-foreground/80 text-2xl">PPM</h5>
            </div>
            <div className="flex flex-col items-center justify-center w-full grow bg-white/50 border border-white rounded-3xl ">
              <Gauge value={500}/>
              <h5 className="-mt-4 font-bold text-foreground/80 text-2xl">PPM</h5>
            </div>
            <div className="flex flex-col items-center justify-center w-full grow bg-white/50 border border-white rounded-3xl ">
              <Gauge value={600}/>
              <h5 className="-mt-4 font-bold text-foreground/80 text-2xl">PPM</h5>
            </div>
          </div>
        </div>
        {/* CONTAINER BAWAH */}
        <div className="grid grid-cols-2 gap-8 my-8">
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
        </div>
      </div>
    </main>
  )
}
