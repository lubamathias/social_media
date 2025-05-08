import { currentUser } from "@clerk/nextjs/server"
import { getUserByClerkId } from "@/actions/user.actions";
import { prisma } from "@/lib/prisma";
import {
    Card,
    CardContent
  } from "@/components/ui/card"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import style from "./page.module.scss"
import { Separator } from "../ui/separator";
import { MapPinCheck, MapPinMinus, Link2, CircleUserRound  } from 'lucide-react';
import Link from "next/link";
import { FollowersModal } from "../followersModal";

  


export async function SideBar(){

    const authUser = await currentUser();
    if (!authUser) return null;


    const user = await getUserByClerkId(authUser.id);
    if (!user) return null;



    return (
        
        <div className={style.container}>

            {user ? (

            <Card className={style.card}>
                <CardContent className={style.cardContent}>
                    <Link
                        href={`/profile/${user.userName}`}
                    >
                        <div className={style.profileTitle}>
                            <Avatar className={style.avatar}>
                                <AvatarImage
                                    src={user.image || "/avatar.png"}
                                />
                                <AvatarFallback>
                                    <CircleUserRound width={100} height={100}/>
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3>
                                    {user.name}
                                </h3>
                                <h4>
                                    {user.userName}
                                </h4>
                            </div>
                        </div>
                    </Link>

                    <Separator className="mt-4 mb-4"/>

                    <div className={style.followContainer}>
                        <div>
                            <FollowersModal 
                                count={user._count.followers}
                                label={user._count.followers === 1 ? "seguidor" : "seguidores"}
                                list={user.followers.map(f => f.follower)}
                            />
                        </div>

                        <div>
                            <FollowersModal 
                                count={user._count.following}
                                label="seguindo"
                                list={user.following.map(f => f.following)}
                            />
                        </div>
                    </div>

                    <Separator className="mt-4 mb-4"/>

                    <div className={style.extrasContainer}>
                        {user.location ? (
                            <div>
                                <MapPinCheck className="w-4 h-4"/>
                                <p>{user.location}</p>
                            </div>
                        ) : (
                            <div>
                                <MapPinMinus className="w-4 h-4"/>
                                <p>sem localização</p>
                            </div>
                        )}

                        <div>
                            <Link2 className="w-4 h-4"/>
                            {user.website ? (
                                <a href={user.website} target="_blank" className={style.siteLink}>
                                    {user.website}
                                </a>
                            ): (
                                <p>sem website</p>
                            ) }
                        </div>
                    </div>

                </CardContent>
            </Card>
            ): (
                <div >

                </div>
            )}
        </div>
    )
}