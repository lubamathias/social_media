"use client"

import { Button } from "@/components/ui/button";
import Link from 'next/link'
import { ModeToggle } from "@/components/ModeToggle";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { useAuth, SignInButton, SignOutButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Menu, House, Bell, User, LogOut } from 'lucide-react';
import style from "./page.module.scss"


export function MobileMenu(){
    const {isSignedIn, isLoaded} = useAuth()
    return(
        <div className="flex md:hidden">
            <div className={style.modeToggle}>
                <ModeToggle/>
            </div>
            {!isLoaded && (
                <span>loading</span>
            )}
            {isSignedIn && isLoaded &&(
                <Sheet>
                    <SheetTrigger>
                        <Menu/>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle>
                                <div className={style.title}>
                                    <UserButton/>
                                </div>

                            </SheetTitle>
                        </SheetHeader>
                    <Button variant={"ghost"}>
                        <Link href="/" className={style.link}>
                            <House/>
                            <span> Home</span>
                        </Link>
                    </Button>
                    <Button variant={"ghost"}>
                        <Link href="/notification" className={style.link}>
                            <Bell/>
                            <span>Notifications</span>
                        </Link>
                    </Button>
                    <Button variant={"ghost"}>
                        <Link href="/follows" className={style.link}>
                            <User/>
                            <span>Sugestões</span>
                        </Link>
                    </Button>
                    <SignOutButton>
                        <Button variant="default">
                            <LogOut/>
                            Sign Out
                        </Button>
                    </SignOutButton>
                    </SheetContent>
                </Sheet>
            )}
            {!isSignedIn && isLoaded &&
            (
                <>
                    <SignInButton mode="modal">
                        <Button variant="default">
                        Entrar
                        </Button>
                    </SignInButton>
                    
                    <SignUpButton mode="modal">
                        <Button variant="ghost">
                        Cadastrar
                        </Button>
                    </SignUpButton>
                </>
            )
            }
        </div>
    )
}