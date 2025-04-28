import { ModeToggle } from '@/components/ModeToggle'
import { Button } from '@/components/ui/button'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
import Link from 'next/link'
import { House, Bell, User } from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import style from "./page.module.scss"


export async function DesktopMenu(){

    const user = await currentUser();


    return (
        <div className={style.main}>

            {user ? (
                <div className={style.authenticatedMenu}>
                    <Button variant={"ghost"}>
                        <Link href="/" className={style.link}>
                            <House/>
                            <span className={style.linkSpan}> Home</span>
                        </Link>
                    </Button>
                    <Button variant={"ghost"}>
                        <Link href="/" className={style.link}>
                            <Bell/>
                            <span className={style.linkSpan}>Notifications</span>
                        </Link>
                    </Button>
                    <Button variant={"ghost"}>
                        <Link href="/" className={style.link}>
                            <User/>
                            <span className={style.linkSpan}>Profile</span>
                        </Link>
                    </Button>
                    <UserButton/>
                
                </div>
            ): (
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
            )}

            <div className={style.modeToggle}>
                <ModeToggle/>
            </div>
        </div>
    )
}