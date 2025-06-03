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
import { Input } from "@/components/ui/input";
import { addDeviceToUser, getDocument } from "@/lib/firebase";
import { Search, Vault } from "lucide-react";
import { showToast } from "./showToast";
import { useState } from "react";
import { Device } from "@/model/Device";

export default function AddDeviceDialog({children}: Readonly<{children: React.ReactNode}>) {
  const [addDeviceCode, setAddDeviceCode] = useState("");
  const [errorSearchDevice, setErrorSearchDevice] = useState<string | null>(null);
  const [isLoadingDeviceCode, setIsLoadingDeviceCode] = useState(false);
  const [isLoadingAddingDevice, setIsLoadingAddingDevice] = useState(false);
  const [isDeviceFound, setIsDeviceFound] = useState(false);
  const [newDeviceCode, setNewDeviceCode] = useState<Device | null>(null);

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
    const result = await addDeviceToUser(addDeviceCode);
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
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
  )
}
