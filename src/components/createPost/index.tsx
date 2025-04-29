"use client"
import { useUser } from "@clerk/nextjs"
import { useState } from "react";
import style from "./page.module.scss"
import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ImageUp, Send, LoaderCircle } from 'lucide-react';
import { Separator } from "../ui/separator";
import { postContent } from "@/actions/post.action";
import toast from "react-hot-toast";



export function CreatePost(){
    const {user} = useUser();
    const [content, setContent] = useState('')
    const [imgURL, setImgUrl] = useState('')
    const [isPosting, setIsPosting] = useState(false)
    const [showImgUpload, setShowImgUpload] = useState (false)

    async function handleSubmit(){
        if (!content.trim() && !imgURL) return;

        setIsPosting(true)
        try {
            const result = await postContent (content, imgURL)

            if (result && result.success) {

                setContent(""),
                setImgUrl(""),
                setShowImgUpload(false),

                toast.success("Postado com sucesso!")
            }


        } catch (error) {
            console.error ("Erro na função handleSubmit", error)
            toast.error ( "Erro na função handleSubmit")
        }
        finally {
            setIsPosting(false)
        }
    }
    return(
        <Card className={style.card}>
            <CardContent>
                <div className={style.container}>
                    <div className={style.containerContent}>
                        <div>
                            <Avatar>
                                <AvatarImage className={style.avatar} src={user?.imageUrl || "/avatar.png"}/>
                            </Avatar>
                        </div>
                        <Textarea
                            placeholder="Sobre o que está pensando?"
                            className={style.textArea}
                            value={content}
                            onChange={(e)=> setContent(e.target.value)}
                            disabled={isPosting}
                        />
                    </div>

                    <Separator className="m-3"/>
                    <div className={style.buttonsContainer}>
                        <div>
                            <Button 
                                variant="ghost" 
                                className={style.buttom}
                                onClick={() => setShowImgUpload(!showImgUpload)}
                                disabled={isPosting}>
                                <ImageUp/>
                                <span>
                                    Imagem
                                </span>
                            </Button>
                        </div>
                        <Button 
                            className={style.buttom}
                            onClick={handleSubmit}
                            disabled= {(!content.trim() && !imgURL) || isPosting }>

                                {isPosting ? (
                                    <>
                                        <LoaderCircle/>
                                        Postando..
                                    </>
                                ): (
                                    <>
                                        <Send/>
                                        Postar
                                    </>
                                )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}