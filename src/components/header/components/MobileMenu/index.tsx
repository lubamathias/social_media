// components/MobileMenuClient.tsx
"use client";

import { useAuth, SignInButton, SignOutButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, House, Bell, User, LogOut } from "lucide-react";
import style from "./page.module.scss";
import { FollowersModal } from "@/components/followersModal";
import { UserData } from "@/types/user";
import { Separator } from "@/components/ui/separator";

type Props = { serverUser: UserData | null };

export function MobileMenu({ serverUser }: Props) {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <div className="flex md:hidden">
      <div className={style.modeToggle}>
        <ModeToggle />
      </div>

      {!isLoaded && <span>loading...</span>}

      {isSignedIn && isLoaded && serverUser && (
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>
                <div className={style.title}>
                  <UserButton />
                </div>
              </SheetTitle>
            </SheetHeader>

            {/* aqui usamos os dados já carregados no server */}
            <div className="w-full flex justify-around mt-4">
              <div className="flex flex-col items-center">
                <FollowersModal
                  count={serverUser._count.followers}
                  label={
                    serverUser._count.followers === 1 ? "seguidor" : "seguidores"
                  }
                  list={serverUser.followers.map((f) => f.follower)}
                />
              </div>

              <div className="flex flex-col items-center">
                <FollowersModal
                  count={serverUser._count.following}
                  label="seguindo"
                  list={serverUser.following.map((f) => f.following)}
                />
              </div>
            </div>

              <Separator />
              
            <Button variant="ghost">
              <Link href="/" className={style.link}>
                <House /> <span>Home</span>
              </Link>
            </Button>
            <Button variant="ghost">
              <Link href="/notification" className={style.link}>
                <Bell /> <span>Notifications</span>
              </Link>
            </Button>
            <Button variant="ghost">
              <Link href="/follows" className={style.link}>
                <User /> <span>Sugestões</span>
              </Link>
            </Button>
            <SignOutButton>
              <Button variant="default">
                <LogOut /> Sign Out
              </Button>
            </SignOutButton>
          </SheetContent>
        </Sheet>
      )}

      {!isSignedIn && isLoaded && (
        <>
          <SignInButton mode="modal">
            <Button variant="default">Entrar</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="ghost">Cadastrar</Button>
          </SignUpButton>
        </>
      )}
    </div>
  );
}
