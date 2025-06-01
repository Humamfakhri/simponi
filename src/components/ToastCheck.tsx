import { showToast } from "@/components/showToast";
import { Button } from "./ui/button";

export default function ToastCheck() {
  return (
    <div className="flex mb-4 items-center gap-4">
      <Button onClick={() => showToast({ message: "Berhasil mengubah peraturan", variant: "success" })}>
        Toast
      </Button>
      <Button onClick={() => showToast({ message: "Gagal mengubah peraturan", variant: "error" })}>
        Toast
      </Button>
    </div>
  )
}
