"use client";

import { Button } from "@/components/ui/button";
import { Device } from "@/model/Device";

type TabProps = {
  ownedDevices: Device[];
  sharedDevices: Device[];
  activeTab: "owned" | "shared";
  setActiveTab: (tab: "owned" | "shared") => void;
}

export default function Tab({ ownedDevices, sharedDevices, activeTab, setActiveTab }: TabProps) {
  return (
    <div className="flex gap-2">
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
  )
}
