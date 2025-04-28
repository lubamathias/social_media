"use client"

import { useState } from "react";
import { Button } from "../ui/button";
import { toggleFollow } from "@/actions/user.actions";
import { LoaderCircle } from 'lucide-react';

export default function FollowButton({ userId }: { userId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async () => {
        try {
            setIsLoading(true);
            await toggleFollow(userId);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="secondary"
            onClick={handleFollow}
            disabled={isLoading}
        >
            {isLoading ? <LoaderCircle className="w-4 h-4 animate-spin"/> : "Seguir"}
        </Button>
    );
}
