"use client";

import { Eye, EyeOff, Leaf, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { removeFirebasePrefix } from "@/lib/utils";
// import { Leaf, Music2 } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

export default function MasukPage() {
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

  const handleMasuk = async (email: string, password: string) => {
    // setLoading(true);
    setError("");
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      // console.error("Login gagal:", error);
      setError(error instanceof Error ? removeFirebasePrefix(error.message) : String(error));
      setLoading(false);
    } finally {
      setLoadingButton(false);
    }
  };

  if (loading) {
    return (
      <div className="col-span-2 w-full flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-400"></div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-center items-center bg-transparent pt-3 pb-4 absolute w-full lg:mx-auto h-full">
        <div className="grow lg:grow-0 lg:w-fit px-3 lg:mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault(); // mencegah reload halaman
              handleMasuk(email, password);
            }}
            className="text-center flex flex-col gap-4 border border-white bg-white/50 backdrop-blur-md px-6 py-8 lg:p-12 rounded-3xl z-10 w-full lg:min-w-md"
          >
            <div className="header text-center mb-10">
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full">
                  <Leaf strokeWidth={3} className='size-8' />
                  <span className="text-4xl font-black font-heading">SIMPONI</span>
                </div>
                <p>Sistem Monitoring Hidroponik Indoor</p>
              </div>
            </div>
            <div className="flex items-center gap-1 border border-input/30 rounded-md px-3 py-2 w-full bg-white/20 focus-within:ring-2 focus-within:ring-ring focus-within:outline-none">
              <Mail
                strokeWidth={2}
                width={20}
                className={`mr-2 transition-colors ${email ? "text-foreground" : "text-muted-foreground"}`}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/0 outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-1 border border-input/30 rounded-md px-3 py-2 w-full bg-white/20 focus-within:ring-2 focus-within:ring-ring focus-within:outline-none">
              <LockKeyhole
                strokeWidth={2}
                width={20}
                className={`mr-2 transition-colors ${password ? "text-foreground" : "text-muted-foreground"}`}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-white/0 outline-none text-sm placeholder:text-muted-foreground"
              />
              {
                showPassword ? (
                  <button type="button" onClick={() => setShowPassword(false)} className="outline-muted-foreground px-1">
                    <Eye
                      className="cursor-pointer text-muted-foreground"
                      width={22}
                    />
                  </button>
                ) : (
                  <button type="button" onClick={() => setShowPassword(true)} className="outline-muted-foreground px-1">
                    <EyeOff
                      className="cursor-pointer text-muted-foreground"
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
              className={`w-full text-white py-2 text-sm rounded-lg mt-8 flex justify-center items-center ${email && password ? "bg-primary hover:bg-emerald-600 shadow-lg shadow-primary hover:shadow-none cursor-pointer transition-all duration-200" : "bg-muted-foreground/50 cursor-not-allowed"
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
                "Masuk"
              )}
            </button>
            <div className="text-sm mt-4">
              <p>
                Belum memiliki akun?{" "}
                <Link
                  href="/daftar"
                  className="text-emerald-600 hover:underline"
                >
                  Daftar
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <div className="grid grid-cols-3 relative -z-10">
        <div className="relative -z-10 w-full h-full">
          <Image
            src="/seed.jpg"
            alt="login background"
            fill
            objectFit="cover"
            priority
          />
        </div>
        <div className="relative -z-10 w-full h-full">
          <Image
            src="/seeds.jpg"
            alt="login background"
            fill
            objectFit="cover"
            priority
          />
        </div>
        <div className="relative -z-10 w-full h-full">
          <Image
            src="/lettuce.jpg"
            alt="login background"
            fill
            objectFit="cover"
            priority
          />
        </div>
        {/* Overlay blur */}
        <div className="absolute w-full h-full top-0 left-0 backdrop-blur-sm bg-white/20" />
      </div>
    </>
  )
}
