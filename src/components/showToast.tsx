import { toast } from "sonner"
import React, { JSX } from "react"
import { CircleCheck, CircleX } from "lucide-react"

type CustomToastProps = {
    message: string
    variant?: "success" | "error",
}

export function showToast({ message, variant }: CustomToastProps) {
    toast.custom(() => (
        <div className="flex items-center gap-2 bg-white/40 border border-white backdrop-blur-md p-4 rounded-xl shadow">
            {variant === "success" ? (
                <CircleCheck className="text-primary" />
            ) : variant === "error" ? (
                <CircleX className="text-destructive" />
            ) : null}
            <p className="text-sm font-sans antialiased">{message}</p>
        </div>
    ))
}
