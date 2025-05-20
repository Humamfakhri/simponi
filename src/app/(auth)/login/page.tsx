"use client";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { removeFirebasePrefix } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      if (user) {
        router.push("/");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router])

  const handleLogin = async (email: string, password: string) => {
    // setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
      setLoading(true); // Selesai loading
    } catch (error) {
      // console.error("Login gagal:", error);
      setError(error instanceof Error ? removeFirebasePrefix(error.message) : String(error));
      setLoading(false); // Selesai loading
    } finally {
      setLoadingButton(false); // Selesai loading
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // mencegah reload halaman
              handleLogin(email, password);
            }}
            className="text-center min-w-96 flex flex-col gap-4"
          >
            <div className="header text-center mb-10">
              <Image src="/logo_placeholder.png" alt="logo" width={120} height={120} className="mx-auto mb-4" />
              <h1 className="font-black font-heading text-2xl">Masuk</h1>
              <p className="text-muted-foreground">Masukkan kredensial Anda</p>
            </div>
            <div className="flex items-center gap-1 border border-input rounded-md px-3 py-2 w-full bg-background focus-within:ring-2 focus-within:ring-ring focus-within:outline-none">
              <Mail
                strokeWidth={1}
                width={20}
                className={`mr-2 transition-colors ${email ? "text-foreground" : "text-muted-foreground"}`}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-1 border border-input rounded-md px-3 py-2 w-full bg-background focus-within:ring-2 focus-within:ring-ring focus-within:outline-none">
              <LockKeyhole
                strokeWidth={1}
                width={20}
                className={`mr-2 transition-colors ${password ? "text-foreground" : "text-muted-foreground"}`}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
              {
                showPassword ? (
                  <button type="button" onClick={() => setShowPassword(false)} className="outline-muted-foreground px-1">
                    <Eye
                      className="cursor-pointer text-muted-foreground ring-red-500 outline-red-500"
                      width={22}
                    />
                  </button>
                ) : (
                  <button type="button" onClick={() => setShowPassword(true)} className="outline-muted-foreground px-1">
                    <EyeOff
                      className="cursor-pointer text-muted-foreground ring-red-500 outline-red-500"
                      width={22}
                    />
                  </button>
                )
              }
            </div>
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              onClick={() => setLoadingButton(true)}
              className={`w-full text-white py-2 text-sm rounded-lg mt-8 flex justify-center items-center ${email && password ? "bg-primary cursor-pointer" : "bg-muted-foreground/50 cursor-not-allowed"
                }`}
              disabled={!email || !password}
            >
              {loadingButton ? (
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
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
      <div className="bg-slate-400"></div>
    </>
  )
}
