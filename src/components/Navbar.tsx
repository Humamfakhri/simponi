"use client";

// import { Bell, Leaf, Mail, Music2 } from 'lucide-react';
import { UserRound } from 'lucide-react';
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
import Image from 'next/image';
import Link from 'next/link';


export default function Navbar() {
  const [userName, setUserName] = useState("");

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
    <nav className="glass-navbar absolute top-0 w-full z-50 px-4 lg:px-0">
      <div className="container mx-auto flex items-center justify-between py-6">
        <Image src="/logo.jpg" alt="logo" width={140} height={140} className='rounded-md' />
        {/* <div className="flex items-center gap-2 bg-radial-[at_50%_75%] from-emerald-200 via-white/40 to-white/40  px-3 py-2 rounded-2xl">
          <Music2 strokeWidth={3} className='size-5' />
          <Leaf strokeWidth={3} className='size-5 -ml-4' />
          <span className="text-xl font-black font-heading">SIMPONI</span>
        </div> */}
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
                  <div className="aspect-square bg-muted/70 rounded-full size-12 flex items-center justify-center">
                    <UserRound className="text-foreground/70 size-5" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={24} side="bottom" align="end" className='p-2 min-w-40'>
                  <DropdownMenuLabel className='flex flex-col gap-1'>
                    <p className='text-xs text-muted-foreground font-light'>Login sebagai</p>
                    <p>{userName}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className='text-destructive hover:text-destructive/80! hover:underline hover:bg-transparent! cursor-pointer' onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            :
            <Link href='/login'>
              <button
                type="button"
                className={`w-full text-white px-8 py-3 text-sm rounded-lg flex justify-center items-center bg-emerald-500 hover:bg-emerald-600 shadow-lg hover:shadow-none shadow-emerald-500 cursor-pointer transition-all duration-200 ease-in-out`}
              >
                Masuk
              </button>
            </Link>
          }
        </ul>

      </div>
    </nav>
  )
}
