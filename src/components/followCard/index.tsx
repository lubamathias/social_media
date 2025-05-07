// components/FollowCard.tsx
import { getRandomUsers } from "@/actions/user.actions";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import style from './page.module.scss'; // Mudei o nome do arquivo de estilo
import Link from "next/link";
import FollowButton from "../followButton";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";


// Remove 'use client' e mantém como Server Component
export default async function FollowCard() {
    const users = await getRandomUsers()

    return(
        <Card className={style.card}>
            <CardHeader className={style.cardHeader}>
                <h2 className="text-[large]">Faça novas conexões</h2>
            </CardHeader>
            <CardContent className="w-full">
                {users.length > 0 ? (
                    <div className={style.usersContainer}>
                        {users.map((user) => (
                            <div key={user.id} className={style.userItem}>
                                <div className={style.userInfo}>
                                    <Link href={`/profile/${user.userName}`}>
                                        <Avatar>
                                            <AvatarImage src={user?.image || "/avatar.png"}/>
                                            <AvatarFallback>
                                                <CircleUserRound/>
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className={style.userDetails}>
                                        <h3>{user.name}</h3>
                                        <p>{user.userName}</p>
                                    </div>
                                </div>
                                <FollowButton userId={user.id}/>
                            </div>
                        ))}
                    </div>

                ): (
                    <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col align-center justify-center text-center">
                        <p>Parabéns, você já segue todos os</p> <strong className="text-center">700 milhões</strong><p> de usuários da rede!!!</p>
                    </div>
                    <Image 
                        src="/images/Monkey.gif" 
                        alt="Macaco comemorando" 
   
                        width={300}
                        height={300}
                    />
                    <span className="text-sm text-muted-foreground">
                        Agora vá tomar um café e espere novos usuários nascerem 🌱
                    </span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}