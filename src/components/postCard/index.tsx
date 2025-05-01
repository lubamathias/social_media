"use client"


import { createComment, deletePost, getPosts, toggleLike } from "@/actions/post.action";
import { useUser } from "@clerk/nextjs";

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "../ui/avatar";
import toast from "react-hot-toast";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {MessageSquarePlus, MessagesSquare, LoaderCircle, Star, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import style from "./page.module.scss"
import Link from "next/link";


type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number]


export default function PostCard({post, dbUserId} : {post:Post; dbUserId: string | null}) {
    const {user} = useUser();
    const [isLiking, setIsLiking] = useState (false);
    const [hasLiked, setHasLiked] = useState(post.likes.some((like) => like.userId === dbUserId));
    const [likes, setLikes] = useState(post._count.likes);
    const [isCommenting, setIsCommenting] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [showComments, setShowComments] = useState (false)

    async function handleLikes() {
        if (isLiking) return;
        try {
            setIsLiking(true);
            setHasLiked ( prev => !prev)
            setLikes (prev => prev + (hasLiked ? -1 : 1))
            await toggleLike(post.id)
        } catch (error) {
            setLikes(post._count.likes)
            setHasLiked(post.likes.some((like) => like.userId === dbUserId))
            
        } finally {
            setIsLiking(false)
        }
    }

    async function handleAddComment(){
        if (!newComment.trim() || isCommenting) return;
        try {
            setIsCommenting(true);
            const result = await createComment(post.id, newComment);
            if (result?.success) {
                toast.success("Comentário criado!")
                setNewComment("")
            }
        } catch (error) {
            toast.error("Falha ao criar comentário")
            
        } finally {
            setIsCommenting(false)
        }
    }

    async function handleDeletePost() {
        if (isDeleting) return;
        try {
            setIsDeleting(true);

            const result = await deletePost(post.id);
            if (result?.success) toast.success("Postagem deletada!");
            else throw new Error (result.error);
        } catch (error) {
            toast.error("Erro ao deletar postagem")
        } finally {
            setIsDeleting(false)
        }
    }

    
    return(
        <Card className="w-full">
            <CardHeader className="w-full w-full flex items-center justify-between">
                <div className="w-full flex items-center flex-row gap-1">
                    <div className="flex items-center flex-row gap-3">
                        <Avatar>
                            <AvatarImage className="w-10 h-auto rounded-full" src={post.author.image || "/avatar.png"} />
                        </Avatar>
                        <h4>
                            {post.author.name}
                        </h4>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Link href={`/profile/${post.author.userName}`}>
                            @{post.author.userName}
                        </Link>
                        <span>●</span>
                        <span >
                            {formatDistanceToNow(new Date(post.createdAt)) }
                        </span>
                    </div>
                </div>
                {dbUserId === post.authorId && (

                    <Button
                        variant="ghost"
                        onClick={handleDeletePost}
                        className="hover:text-red-500 cursor-pointer">
                        <Trash2/>
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="mb-2">
                    {post.content}
                </div>

                <div className="flex items-center justify-baseline gap-3" >
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            onClick={handleLikes}
                            className={`text-muted-foreground ${hasLiked ? "text-[#0bafb4] hover:text-[#0baeb46a]": "hover:text-[#0baeb46a]"}`}
                        >
                            {hasLiked ? (
                                <div>
                                    <Star className="size-5 fill-current"/>
                                </div>
                            ) : (
                                <div>
                                    <Star size={16} className="size-5"/>
                                </div>
                            )}
                        </Button>
                        <span className="text-[medium] text-muted-foreground">
                            {likes}
                        </span>
                    </div>

                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`text-muted-foreground ${showComments ? "text-[#0bafb4] hover:text-[#0baeb46a]": "hover:text-[#0baeb46a]"}`}
                            onClick={() => setShowComments((prev) => !prev)}
                            >
                            <MessagesSquare />
                        </Button>
                    </div>
                </div>


            <Separator className="mt-4 mb-4"/>


            {showComments &&(
                
                <div >
                    <div className="mt-4 mb-4">
                        <Textarea
                            placeholder="Comente algo sobre o post..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={isCommenting}
                            className="mb-2 resize-none overflow-y-auto h-16"
                        />
                        <Button
                            onClick={handleAddComment}
                            disabled= {!newComment.trim() || isCommenting}
                        >
                            {isCommenting ? (
                                <>
                                    <LoaderCircle />
                                    Comentando...
                                </>
                    
                            ) : (
                                <>
                                    <MessageSquarePlus />
                                    Comentar
                                </>
                            )}
                        </Button>
                    </div>
                    <div>
                        {post.comments.map((comment) => (
                            <Card key={comment.id}>
                                <CardHeader className="w-full flex items-center flex-row gap-2">
                                    <div className="flex items-center flex-row gap-3">
                                        <Avatar>
                                            <AvatarImage className="w-6 h-auto rounded-full" src={comment.author.image || "/avatar.png"}/>
                                        </Avatar>
                                        <h4 className="text-[smaller]">
                                            {comment.author.name}
                                        </h4>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Link href={`/profile/${comment.author.userName}`}>
                                            @{comment.author.userName}
                                        </Link>
                                        <span>●</span>
                                        <span>
                                            {formatDistanceToNow(new Date(comment.createdAt)) }
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {comment.content}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            </CardContent>

        </Card>
    )
}