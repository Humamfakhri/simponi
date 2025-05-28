"use client";

import { UserRound } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleLogout } from '@/lib/firebase';

export default function NavbarDropdown() {
  return (
    <DropdownMenu modal={false} >
      <DropdownMenuTrigger className="cursor-pointer">
        <div className="aspect-square bg-muted/70 rounded-full size-12 flex items-center justify-center">
          <UserRound className="text-foreground/70 size-5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={24} side="bottom" align="end" className='p-2 min-w-40'>
        <DropdownMenuLabel className='flex flex-col gap-1'>
          <p className='text-xs text-muted-foreground font-light'>Login sebagai</p>
          <p>Admin</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='text-destructive hover:text-destructive/80! hover:underline hover:bg-transparent! cursor-pointer' onClick={handleLogout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
