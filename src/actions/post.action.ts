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

export async function getPosts() {
    try {
      const userId = await getDbUserId();
      if (!userId) return [];
  
      // Buscar todos os IDs que o usuário segue
      const following = await prisma.follows.findMany({
        where: {
          followerId: userId,
        },
        select: {
          followingId: true,
        },
      });
  
      // Extrair os IDs dos seguidos + adicionar o próprio ID
      const followedUserIds = following.map(f => f.followingId);
      followedUserIds.push(userId);
  
      // Buscar os posts desses usuários
      const posts = await prisma.post.findMany({
        where: {
          authorId: {
            in: followedUserIds,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              userName: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  name: true,
                  image: true,
                  userName: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });
  
      return posts;
    } catch (error) {
      console.error("erro em getPosts", error);
      throw new Error("failed to fetch followed posts");
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
            //unlike
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
        return{ success: true}
    } catch (error) {
        console.error( " failed do toggle like")
        return { success: false, error: "failed do toggle like"}
    }
}

export async function createComment(postId: string, content: string) {
    try {
        const userId = await getDbUserId();

        if (!userId) return;
        if (!content) throw new Error ("conteúdo é obrigatório")

        const post = await prisma.post.findUnique({
            where: { id: postId},
            select: {authorId: true},
        });

        if (!post) throw new Error ("Postagem não encontrada");


        const [comment] = await prisma.$transaction(async (tx) => {
            const newComment = await tx.comment.create({
                data: {
                    content,
                    authorId: userId,
                    postId
                }
            });


            //Notificação
            if (post.authorId !== userId) {
                await tx.notification.create({
                    data: {
                        type: "COMMENT",
                        userId: post.authorId,
                        creatorId: userId,
                        postId,
                        commentId: newComment.id,
                    },
                })
            }

            return [newComment];
        })

        revalidatePath(`/posts/${postId}`);
        return {success: true, comment};
    } catch (error) {
        console.error("Falha na função createComment", error);
        return {success: false, error: "Falha ao criar comentário"}
        
    }
}

export async function deletePost(postId: string) {
    try {
        const userId = await getDbUserId();
        
        const post = await prisma.post.findUnique({
            where: { id : postId},
            select: {authorId: true}
        });

        if (!post) throw new Error ("Postagem não encontrada")
        if (post.authorId !== userId) throw new Error ("Não autorizado - sem permissão para deletar");

        await prisma.post.delete({
            where: { id: postId},
        });

        revalidatePath("/")
        return {success: true}
    } catch (error) {
        console.error("Falha ao deletar a postagem:", error);
        return {success: false, error: "Falha ao deletar a postagem"}
    }
}