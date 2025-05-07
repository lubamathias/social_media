"use client"
import { getNotifications, markNotificationsAsRead } from "@/actions/notification.action"
import { NotificationSkeleton } from "@/components/notificationSkeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import {CircleUserRound, MessageCircleMore, UserPlus } from 'lucide-react';
import ConvexaLogo from '@/assets/convexaLogo.svg';
import { AvatarFallback } from "@/components/ui/avatar"

type Notifications = Awaited<ReturnType<typeof getNotifications>>
type Notification = Notifications[number]

const getNotificationIcon = (type: string) => {
    switch (type) {
        case "LIKE":
            return <ConvexaLogo className="size-4 text-[#0bafb4]"/>;
        case "COMMENT":
            return <MessageCircleMore className="size-4 text-green-500"/>;
        case "FOLLOW":
            return <UserPlus className="size-4 text-[#bcbe23]"/>;
        
        default:
            return null
    }
}

export default function NotificationsPage(){
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [ isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchNotifications = async () => {
            setIsLoading(true)
            try {
                const data = await getNotifications();
                setNotifications(data)

                const unreadIds = data.filter(n => !n.read).map(n => n.id)
                if (unreadIds.length > 0) await markNotificationsAsRead(unreadIds)
            } catch (error) {
                toast.error("Falha ao carregar notificações")
            } finally {
                setIsLoading(false)
            }
        }

        fetchNotifications()
    }, []);

    if (isLoading) return <NotificationSkeleton/>
    return(
        <div className="space-y-4">
            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle>Notificações</CardTitle>
                        <span className="text-sm text-muted-foreground">
                            {notifications.filter((n) => !n.read).length} unread
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[calc(100vh-12rem)]">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">
                                Sem notificações por enquanto
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div key={notification.id}
                                    className={`flex items-start gap-2 p-4 border-b hover:bg-muted/25 transition-colors ${!notification.read ? "bg-muted/50" : ""}`}
                                    >
                                        <Avatar className="mt-1">
                                            <AvatarImage src={notification.creator.image ?? "/avatar.png"} className="w-10 h-10 rounded-full"/>
                                            <AvatarFallback>
                                                <CircleUserRound/>
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                {getNotificationIcon(notification.type)}
                                                <span>
                                                    <span className="mr-1">
                                                        <strong>
                                                            {notification.creator.name ?? notification.creator.userName}

                                                        </strong>
                                                    </span>{""}
                                                    {notification.type === "FOLLOW" ? "começou a seguir você" : notification.type === "LIKE" ? "Curtiu sua postagem" : "Comentou na sua postagem"}
                                                </span>
                                            </div>

                                            {notification.post &&
                                                (notification.type === "LIKE" || notification.type === "COMMENT") && (
                                                    <div className="pl-6 space-y-2">
                                                        <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                                                            <p>
                                                                {notification.post.content}
                                                            </p>
                                                            {notification.post.image && (
                                                                <img
                                                                    src={notification.post.image}
                                                                    alt="Post Content"
                                                                    className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"
                                                                    />
                                                            )}
                                                        </div>

                                                        {notification.type === "COMMENT" && notification.comment && (
                                                            <div className="text-sm p-2 bg-accent/50 rounded-md">
                                                                {notification.comment.content}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                </div>
                            ))
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}

