"use server"

import { revalidatePath } from "next/cache"
import { getDbUserId} from "./user.actions"
import { prisma } from "@/lib/prisma"

export async function postContent( content: string, image: string){
    
    try {
        const userId = await getDbUserId()

        if (!userId) return;
    
        const post = await prisma.post.create({
            data: {
                content,
                image,
                authorId: userId,
            }
        })
        
        revalidatePath("/");
        return {success: true, post}
    } catch (error) {
        console.error("Falha ao criar postagem")
        return {success: false, error: "Falha ao criar postagem"}
    }
}

export async function getPosts(){
    try {
        const posts = prisma.post.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                
                author: {
                    select: {
                        name: true,
                        image: true,
                        userName: true
                    }
                },
                comments: {

                    include: {
                        author: {
                            select: {
                                name: true,
                                image: true,
                                userName: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                },
                likes: {
                    select: {
                        userId: true
                    }
                    
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    }
                }
            }
            
        })

        return posts;
        
    } catch (error) {
        console.error("erro em getPosts", error)
        throw new Error ("failed to fetch posts")
    }
} 

export async function toggleLike(postId: string) {
    try {
        
        const userId = await getDbUserId();
        if (!userId) return;
    
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    postId,
                    userId,
                }
            }
        }) 
    
        const post = await prisma.post.findUnique({
            where: {id: postId},
            select: { authorId: true},
        });
    
        if (!post) throw new Error ("Post not found");
    
        if (existingLike) {
            await prisma.like.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId,
                    }
                }
            })
        } else {
            await prisma.$transaction([
                prisma.like.create( {
                    data: {
                        userId,
                        postId,
                    }
                }),
                ...(post.authorId !== userId ?
                    [
                        prisma.notification.create ({
                            data: {
                                type: "LIKE",
                                userId: post.authorId,
                                creatorId: userId,
                                postId,
                            }
                        })
                    ] : []
                )
            ])
        }

        revalidatePath("/")
        return{ sucess: true}
    } catch (error) {
        console.error( " failed do toggle like")
        return { sucess: false, error: "failed do toggle like"}
    }
}