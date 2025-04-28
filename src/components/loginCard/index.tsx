import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import style from "./page.module.scss"

export function LoginCard(){
    return (
        <Card className={style.card}>
            <CardContent className={style.cardContent}>

                <SignInButton >
                    <Button variant="default" className={style.button}>
                        <strong>                        
                            Entrar
                        </strong>
                    </Button>
                </SignInButton>
                <div>
                    <h2><strong>Ainda</strong> não faz parte?</h2>

                    <SignOutButton>
                        <Button variant="secondary" className={style.button}>
                            <strong>
                                Cadastrar
                            </strong>
                        </Button>
                    </SignOutButton>
                </div>
            </CardContent>
        </Card>
    )
}