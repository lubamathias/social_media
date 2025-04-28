import { getRandomUsers } from "@/actions/user.actions";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import style from './page.module.scss';
import Link from "next/link";
import FollowButton from "../followButton";

export default async function FollowCard() {
    const users = await getRandomUsers()

    if (users?.length === 0) return;


    return(
        <Card className={style.card}>
            <CardHeader className={style.cardHeader}>
                <h2>
                    Faça novas conexões
                </h2>
            </CardHeader>
            <CardContent className="w-full">
                <div className={style.usersContainer}>
                    {users?.map((user) => (
                        <div key={user.id} className={style.div1}>
                            <div className={style.div2}>
                                <Link href={`/profile/${user.userName}`}>
                                    <Avatar>
                                        <AvatarImage src={user?.image || "/avatar.png"}/>
                                    </Avatar>
                                </Link>
                                <div className={style.div3}>
                                    <h3>
                                        {user.name}
                                    </h3>
                                    <p>
                                        {user.userName}
                                    </p>
                                </div>
                            </div>

                            <FollowButton userId={user.id}/>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}