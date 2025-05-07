"use client"

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/actions/user.actions";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import {CircleUserRound  } from 'lucide-react';

interface UserLite {
    name: string | null;
    userName: string | null;
    image?: string | null;
  }
  
  interface Props {
    count: number;
    label: string;
    list: UserLite[];
  }

export function FollowersModal({count, list, label} : Props) {
    const [isOpen, setIsOpen] = useState (false)

    return(
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex flex-col h-8 cursor-pointer">
                    <p>{count}</p>
                    <p>{label}</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {label}
                    </DialogTitle>
                </DialogHeader>
                {list.length > 0 ? (
                    <div>
                        <ScrollArea>
                            {list.map((follower, index) => (
                                <div key={index} className="flex align-start mb-2 gap-2">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={follower.image || "/avatar.png"}/>
                                        <AvatarFallback>
                                            <CircleUserRound/>
                                        </AvatarFallback>
                                    </Avatar>

                                    <span>
                                        {follower.name || "usuário sem nome"}
                                    </span>
                                </div>
                                
                            ))}

                        </ScrollArea>

                    </div>
                ): (
                    <span>
                        Nenhum usuário
                    </span>
                )}
            </DialogContent>
        </Dialog>
    )
}