"use client";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { removeFirebasePrefix } from "@/lib/utils";
// import { Leaf, Music2 } from 'lucide-react';
import Image from "next/image";

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
      <div className="col-span-2 w-full flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-400"></div>
      </div>
    )
  }

  return (
    <>
      {/* <div className="flex justify-center items-center bg-radial-[at_50%_100%] from-emerald-200 via-sky-200 to-white to-90% pt-3 pb-4 px-6"> */}
      {/* <div className="flex justify-center items-center bg-radial-[at_50%_100%] from-emerald-200 via-white to-white to-90% pt-3 pb-4 px-6"> */}
      <div className="flex justify-center items-center bg-transparent pt-3 pb-4 px-6 border-2 border-white/60 absolute w-full h-full">
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // mencegah reload halaman
              handleLogin(email, password);
            }}
            className="text-center flex flex-col gap-4 glass-login bg-white/50 px-4 py-8 lg:p-12 rounded-3xl z-10 w-full"
            // className="text-center min-w-96 flex flex-col gap-4 glass-login bg-white/50 p-6 lg:p-12 mx-2 rounded-3xl z-10"
          >
            <div className="header text-center lg:mb-10">
              <div className="flex flex-col items-center justify-center mb-8">
                <Image src="/logo.jpg" alt="logo" width={200} height={200} className="mx-auto mb-8 lg:mb-16 rounded-md" />
                {/* <div className="flex justify-center items-center gap-2  px-3 py-2 rounded-2xl"> */}
                {/* <div className="flex justify-center items-center gap-2 bg-radial-[at_50%_75%] from-emerald-200 via-white/40 to-white/40  px-3 py-2 rounded-2xl mb-8"> */}
                {/* <Music2 strokeWidth={3} className='size-9' />
                  <Leaf strokeWidth={3} className='size-9 -ml-6' />
                  <span className="text-4xl font-black font-heading">SIMPONI</span>
                </div> */}
                <h1 className="font-black font-heading text-xl lg:text-2xl mb-2">Selamat Datang di SIMPONI!</h1>
                <p className="text-primary/80">Masukkan kredensial Anda</p>
              </div>
              {/* <div className="flex flex-col items-center gap-1">
                <h1 className="font-black font-heading text-2xl">Selamat Datang di SIMPONI!</h1>
                <p className="text-muted-foreground">Masukkan kredensial Anda</p>
              </div> */}
            </div>
            {/* <p className="text-muted-foreground text-sm text-start">Masukkan kredensial Anda</p> */}
            <div className="flex items-center gap-1 border border-input rounded-md px-3 py-2 w-full bg-white/50 focus-within:ring-2 focus-within:ring-ring focus-within:outline-none">
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
            <div className="flex items-center gap-1 border border-input rounded-md px-3 py-2 w-full bg-white/50 focus-within:ring-2 focus-within:ring-ring focus-within:outline-none">
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
              className={`w-full text-white py-2 text-sm rounded-lg mt-8 flex justify-center items-center ${email && password ? "bg-emerald-500 shadow-lg shadow-emerald-500 cursor-pointer" : "bg-muted-foreground/50 cursor-not-allowed"
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
          </form>
        </div>
      </div>
      {/* <div className="relative -z-10">
        <Image
          src="/seed.jpg"
          alt="login background"
          fill
          objectFit="cover"
        />
      </div> */}
      <div className="relative -z-10 w-full h-full">
        {/* Gambar latar */}
        <Image
          src="/seed.jpg"
          alt="login background"
          fill
          objectFit="cover"
          // className="object-cover"
          priority
        />

        {/* Overlay blur */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />
      </div>

      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-12 p-20 items-center blur -z-10 bg-black/10">
        {/* <div className="grid grid-cols-3 gap-12 p-20 items-center max-h-screen bg-radial-[at_50%_75%] from-emerald-100 via-emerald-100 to-transparent to-90%"> */}
        <div className="hidden lg:flex items-center justify-end">
          <Image
            src="/seed-rounded.svg"
            alt="login background"
            width={180}
            height={180}
          />
        </div>
        <div className="flex items-center justify-center">
          <Image
            src="/lettuce-rounded.svg"
            alt="login background"
            width={400}
            height={400}
          />
        </div>
        <div className="hidden lg:flex items-center justify-start">
          <Image
            src="/seeds-rounded.svg"
            alt="login background"
            width={180}
            height={180}
          />
        </div>
        {/* <Image
          src="/wifi.svg"
          alt="login background"
          width={200}
          height={200}
          className="absolute bottom-0 right-0 mx-20"
          /> */}
      </div>
    </>
  )
}
