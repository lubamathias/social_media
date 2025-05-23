import { SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import style from "./page.module.scss"

export function LoginCard(){
    return (
        <Card className={style.card}>
            <CardContent className={style.cardContent}>

                <div>
                    <SignInButton mode="modal" >
                        <Button variant="default" className={style.button}>

                                Entrar

                        </Button>
                    </SignInButton>
                </div>
                <div className="flex align-center justify-center flex-col">
                    <div className={style.cDiv}>
                        <h1 className={`${style.c} ${style.c1}`}>
                            C
                        </h1>
                        <h1 className={`${style.c} ${style.c2}`}>
                            C
                        </h1>
                    </div>
                    <h1 className={style.convexa}>convexa</h1>
                </div>
                <div>
                    <h2><strong>Ainda</strong> não faz parte?</h2>

                    <SignUpButton mode="modal">
                        <Button variant="secondary" className={style.button}>

                            Cadastrar

                        </Button>
                    </SignUpButton>
                </div>
            </CardContent>
        </Card>
    )
}