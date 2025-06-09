"use client";

import Image from "next/image";
import AddDeviceDialog from "@/components/AddDeviceDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Device } from "@/model/Device";

export default function NoDevice({ devices }: { devices: Device[] }) {
  return (
    <div className="grow flex flex-col gap-4 items-center px-3 lg:px-8 py-12 mx-2 glass rounded-4xl text-center text-muted-foreground">
      <Image
        src="/question_mark.svg"
        alt="Empty"
        width={200}
        height={200}
        className="opacity-70 mb-4"
      />
      <p>Tidak ada perangkat ditemukan</p>
      <AddDeviceDialog devices={devices}>
        <Button>
          <Plus className="text-white" strokeWidth={3} />Perangkat
        </Button>
      </AddDeviceDialog>
    </div>
  )
}
