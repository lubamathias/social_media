"use server"

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server"
import { error } from "console";
import { revalidatePath } from "next/cache";

export async function syncUser(){
    try {
        const {userId} = await auth();
        const user = await currentUser();

        if (!userId || !user) return;

        const existingUser = await prisma.user.findUnique({
            where:{
                clerkId:userId
            }
        })

        if(existingUser){
            return existingUser;
        }


        const dbUser = await prisma.user.create({
            data:{
                clerkId:userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                userName: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                email: user.emailAddresses[0].emailAddress,
                image: user.imageUrl
            }
        })

        return dbUser;
    } catch (error) {
        console.log ("error in syncUser:", error)
    }
}

export async function getUserByClerkId(clerkId: string){
    return prisma.user.findUnique({
        where:{
            clerkId,
        },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                    posts: true,
                },
            }
        }
    })
}

export async function getDbUserId(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) {
    // sem sessão ativa
    return null;
  }

  const user = await getUserByClerkId(userId);
  if (!user) {
    // opcional: log aqui
    console.warn(`Clerk user "${userId}" não encontrado no DB`);
    return null;
    // ou: throw new NotFoundError(`User ${userId} not found`);
  }

  return user.id;
}

export async function getRandomUsers() {
    try {
      const userId = await getDbUserId();
  
      // ⛔ Se não tiver user logado, interrompe aqui
      if (!userId) return [];
  
      const randomUsers = await prisma.user.findMany({
        where: {
          NOT: {
            followers: {
              some: {
                followerId: userId,
              },
            },
          },
        },
        select: {
          id: true,
          userName: true,
          name: true,
          image: true,
          _count: {
            select: {
              following: true,
            },
          },
        },
        take: 3,
      });
  
      return randomUsers;
    } catch (error) {
      console.log("Erro na função getRandomUsers", error);
      return [];
    }
  }
  

export async function toggleFollow(targetUserId: string){
    try {
        const userId = await getDbUserId();

        if( userId === targetUserId) throw new Error ("Você não pode seguir você mesmo")

        if (!userId) return;
        
        const existingFollow = await prisma.follows.findUnique({
            where: {
                followerId_followingId:{
                    followerId: userId,
                    followingId: targetUserId,
                }
            }
        })

        if (existingFollow) {

            await prisma.follows.delete({
                where: {
                    followerId_followingId:{
                        followerId: userId,
                        followingId: targetUserId,
                    }
                }
            })
        } else {
            await prisma.$transaction([
                prisma.follows.create ({
                    data: {
                        followerId: userId,
                        followingId: targetUserId,
                    }
                }),

                prisma.notification.create( {
                    data: {
                        type: "FOLLOW",
                        userId: targetUserId,
                        creatorId: userId,
                    }
                })
            ])
        }

        revalidatePath("/")
        return {sucess: true}
    } catch (error) {
        console.error("error in toggleFollow")

        return {sucess: false, error: "error toggling follow"}
    }
}