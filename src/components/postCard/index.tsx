"use client"


import { getPosts, toggleLike } from "@/actions/post.action";
import { useUser } from "@clerk/nextjs";

import { useState } from "react"
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "../ui/avatar";


type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number]


export default function PostCard({post, dbUserId} : {post:Post; dbUserId: string | null}) {
    const {user} = useUser();
    const [isLiking, setIsLiking] = useState (false);
    const [hasLiked, setHasLiked] = useState (post.likes.some(like => user?.id === dbUserId));
    const [likes, setLikes] = useState(post._count.likes);

    async function handleLikes() {
        if (!isLiking) return;
        try {
            setIsLiking(true);
            setHasLiked ( prev => !prev)
            setLikes (prev => prev + (hasLiked ? -1 : 1))
            await toggleLike(post.id)
        } catch (error) {
            setLikes(post._count.likes)
            setHasLiked(post.likes.some(like => user?.id === dbUserId))
            
        } finally {
            setIsLiking(false)
        }
    }

    
    return(
        <Card className="w-full">
            <CardHeader className="w-full flex items-center flex-row gap-4">
                <Avatar>
                    <AvatarImage className="w-10 h-auto rounded-full" src={post.author.image || "/avatar.png"} />
                </Avatar>
                <h4>
                    {post.author.name}
                </h4>
            </CardHeader>
            <CardContent>
                {post.content}
            </CardContent>
        </Card>
    )
}