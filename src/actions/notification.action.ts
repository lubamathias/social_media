"use server"

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.actions";

export async function getNotifications(){
    try {
        const userId = await getDbUserId();
        if (!userId) return [];

        const notifications = await prisma.notification.findMany({
            where: {
                userId,
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        userName: true,
                        image: true,
                    }
                },
                post: {
                    select: {
                        id: true,
                        image: true,
                        content: true,
                    }
                },
                comment: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true
                    }
                },
                
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return notifications;
    } catch (error) {
        console.error("Falha ao buscar notificação", error)
        throw new Error ("Falha ao buscar notificação")
        
    }
}

export async function markNotificationsAsRead(notificationIds: string[]){
    try {
        await prisma.notification.updateMany({
            where:{
                id: {
                    in: notificationIds,
                },
            },
            data: {
                read: true,
            }
        })

        return {success: true}
    } catch (error) {
        console.error("Falha ao marcar notificação como lida", error)
        return {success: false}
        
    }
}