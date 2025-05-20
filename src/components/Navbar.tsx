import { Bell, Mail, UserRound } from 'lucide-react';
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function Navbar() {
  return (
    <nav className="glass-navbar fixed top-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Image src="/logo_text_placeholder.png" alt="logo" width={120} height={120} />
        <ul className="flex items-center gap-2">
          <li>
            <div className="aspect-square bg-muted/70 rounded-full size-12 flex items-center justify-center">
              <Mail className="text-foreground/70 size-5" />
            </div>
          </li>
          <li>
            <div className="aspect-square bg-muted/70 rounded-full size-12 flex items-center justify-center">
              <Bell className="text-foreground/70 size-5" />
            </div>
          </li>
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
                  <p>Admin</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='text-destructive hover:text-destructive/80! hover:underline hover:bg-transparent! cursor-pointer'>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>

      </div>
    </nav>
  )
}
