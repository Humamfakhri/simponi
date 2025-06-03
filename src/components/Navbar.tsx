"use client";

import { CircleGauge, Leaf, Menu, Settings2, UserRound } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, handleLogout } from '@/lib/firebase';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from "next/navigation";


export default function Navbar() {
  const [userName, setUserName] = useState("");
  const pathname = usePathname();
  // const isActive = pathname.split('/')[1] === urlPathname;

  useEffect(() => {
    // const fetchUserData = async () => {
    //   await setDisplayName("Humam Ibadillah Fakhri");
    // };
    getCurrentUser().then((user) => {
      if (user) {
        setUserName(user.displayName || "");
      } else {
        console.log("Tidak ada user yang login");
      }
    });
    // fetchUserData();
  }, []);

  return (
    <nav className="glass-navbar fixed backdrop-blur-sm lg:absolute top-0 w-full z-50 px-4 lg:px-0">
      <div className="container mx-auto flex items-center justify-between py-3 lg:py-6">
        {/* <Image src="/logo.jpg" alt="logo" width={140} height={140} className='hidden lg:block rounded-md' />
        <Image src="/logo.jpg" alt="logo" width={96} height={96} className='block lg:hidden rounded-md' /> */}
        {/* <Image src="/logo.jpg" alt="logo" width={140} height={140} className='rounded-md' /> */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-linear-to-r from-emerald-300 from-0% via-30% via-white/30 to-white/40">
          {/* <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-linear-to-r from-emerald-300 from-0% via-30% via-white/40 to-white/40 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 ease-in-out"> */}
          {/* <div className="flex items-center gap-2 bg-radial-[at_50%_75%] from-emerald-200 via-white/40 to-white/40  px-3 py-2 rounded-2xl"> */}
          {/* <Music2 strokeWidth={3} className='size-5' /> */}
          <Leaf strokeWidth={3} className='size-5' />
          <span className="text-xl font-black font-heading">SIMPONI</span>
        </div>
        <ul className="flex items-center gap-2">
          {/* <li>
            <div className="aspect-square bg-muted/70 rounded-full size-12 flex items-center justify-center">
              <Mail className="text-foreground/70 size-5" />
            </div>
          </li>
          <li>
            <div className="aspect-square bg-muted/70 rounded-full size-12 flex items-center justify-center">
              <Bell className="text-foreground/70 size-5" />
            </div>
          </li> */}
          {userName ?
            <li>
              <DropdownMenu modal={false} >
                <DropdownMenuTrigger className="cursor-pointer">
                  <div className="lg:hidden aspect-square rounded-full size-12 flex items-center justify-center">
                    <Menu className="text-secondary-foreground size-7" />
                  </div>
                  <div className="hidden lg:flex items-center justify-center aspect-square bg-muted/70 rounded-full size-12">
                    <UserRound className="text-foreground/70 size-5" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={10} side="bottom" align="end" className='p-2 min-w-40 bg-white/80 lg:bg-white/60 border border-white/80 lg:border-white/60 backdrop-blur-lg lg:backdrop-blur-sm'>
                  <DropdownMenuLabel className='flex flex-col gap-1'>
                    <p className='text-xs text-muted-foreground font-light'>Login sebagai</p>
                    <p>{userName}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className='hover:bg-transparent!'>
                    <Link href={'/'} className={`flex items-center gap-3 w-full rounded-md py-2 group hover:text-primary! ${pathname.split('/')[1] === "" ? "text-primary font-bold" : "cursor-pointer"}`}>
                      <CircleGauge className={`size-5 ${pathname.split('/')[1] === "" ? "text-primary" : "text-foreground group-hover:text-primary"}`} />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                    <Link href={'/notifikasi'} className={`flex items-center gap-3 w-full rounded-md py-2 ${pathname.split('/')[1] === "notifikasi" && "text-primary font-bold"}`}>
                      <Bell className={`size-5 ${pathname.split('/')[1] === "notifikasi" ? "text-primary" : "text-foreground"}`} />
                      Notifikasi
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem asChild className='hover:bg-transparent!'>
                  <Link href={'/pengaturan'} className={`flex items-center gap-3 w-full rounded-md py-2 group hover:text-primary! ${pathname.split('/')[1] === "pengaturan" ? "text-primary font-bold cursor" : " cursor-pointer"}`}>
                  <Settings2 className={`size-5 ${pathname.split('/')[1] === "pengaturan" ? "text-primary" : "text-foreground group-hover:text-primary"}`} />
                      Pengaturan
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className='text-destructive! hover:text-destructive/80! hover:underline bg-transparent! cursor-pointer' onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            :
            <Link href='/masuk'>
              {/* <button
                type="button"
                className={`w-full text-white px-6 lg:px-8 py-2 lg:py-3 text-sm rounded-lg flex justify-center items-center bg-emerald-500 hover:bg-emerald-600 shadow hover:shadow-none shadow-emerald-500 cursor-pointer transition-all duration-200 ease-in-out`}
              >
                Masuk
              </button> */}
              <Button className='shadow shadow-primary hover:shadow-none rounded-full px-8'>
                Masuk
              </Button>
            </Link>
          }
        </ul>

      </div>
    </nav>
  )
}
