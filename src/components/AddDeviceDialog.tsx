"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input";
import { addDeviceToUser, auth, getDocument } from "@/lib/firebase";
import { CircleHelp, Search, Vault } from "lucide-react";
import { showToast } from "./showToast";
import { useEffect, useState } from "react";
import { Device } from "@/model/Device";
import { Badge } from "./ui/badge";
import { User } from "@/model/User";

export default function AddDeviceDialog({ children }: Readonly<{ children: React.ReactNode }>) {
  const [addDeviceCode, setAddDeviceCode] = useState("");
  const [errorSearchDevice, setErrorSearchDevice] = useState<string | null>(null);
  const [isLoadingDeviceCode, setIsLoadingDeviceCode] = useState(false);
  const [isLoadingAddingDevice, setIsLoadingAddingDevice] = useState(false);
  const [isDeviceFound, setIsDeviceFound] = useState(false);
  const [newDevice, setNewDevice] = useState<Device | null>(null);
  const [isDeviceAdded, setIsDeviceAdded] = useState(false);
  const [isDeviceAlreadyAdded, setIsDeviceAlreadyAdded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [owner, setOwner] = useState("");
  const currentUser = auth.currentUser;

  const resetState = () => {
    setAddDeviceCode("");
    setErrorSearchDevice(null);
    setIsLoadingDeviceCode(false);
    setIsDeviceFound(false);
    setNewDevice(null);
    setIsDeviceAdded(false);
    setIsDeviceAlreadyAdded(false);
  }

  const handleSearchDevice = async (deviceCode: string) => {
    setErrorSearchDevice(null);
    setIsDeviceAlreadyAdded(false);

    if (currentUser) {
      const userDoc = await getDocument<User>("users", currentUser.uid);
      if (userDoc?.devices.includes(deviceCode)) {
        setIsDeviceAlreadyAdded(true);
      }
    }

    try {
      setIsLoadingDeviceCode(true);
      await getDocument<Device>("devices", deviceCode)
        .then((device) => {
          if (device) {
            setNewDevice(device);
            setIsDeviceFound(true);
            if (device.owner != "") {
              setOwner(device.owner);
            } else {
              setOwner("");
            }
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
    const result = await addDeviceToUser(addDeviceCode);
    if (result.success) {
      showToast({ message: "Berhasil menambahkan perangkat", variant: "success" })
      setAddDeviceCode("");
      setIsDeviceFound(false);
      setNewDevice(null);
      setIsDeviceAdded(true);
      // } else if (result.message === "Device sudah ditambahkan") {
      //   SetIsDeviceAlreadyAdded(true);
    } else {
      showToast({ message: result.message, variant: "error" })
      console.error(result.message);
    }
    setIsLoadingAddingDevice(false);
  };

  useEffect(() => {
    if (isDeviceAdded) {
      setIsDialogOpen(false);
      setIsDeviceAdded(false);
    }
  }, [isDeviceAdded])


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="bg-white/90">
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
                <p>{newDevice?.name}</p>
                <p className="text-sm text-muted-foreground">{newDevice?.location}</p>
              </div>
            </div>
            {owner == "" && !isDeviceAlreadyAdded &&
              <div className="flex items-center gap-2">
                <Badge variant={"outlineDefault"}>
                  Anda akan menjadi pemilik perangkat ini
                </Badge>
                <Tooltip>
                  <TooltipTrigger><CircleHelp className="text-muted-foreground size-5" /></TooltipTrigger>
                  <TooltipContent className="max-w-[360px]">
                    <p className="text-center">Belum ada pemilik tercatat untuk perangkat ini. Anda akan menjadi pemiliknya dan mendapatkan hak akses penuh.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            }
            {owner == currentUser?.uid &&
              <Badge variant={"outlineDefault"}>Perangkat milik Anda</Badge>
            }
            {isDeviceAlreadyAdded ?
              <Badge variant={"outlineDefault"}>Sudah ditambahkan</Badge>
              :
              <div className="flex justify-end items-center gap-4 mt-2">
                <DialogClose asChild>
                  <Button
                    onClick={resetState}
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
            }
          </div>
        }
      </DialogContent>
    </Dialog>
  )
}
