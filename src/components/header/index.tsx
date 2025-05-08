import { DesktopMenu } from './components/DesktopMenu'
import style from './page.module.scss'
import { MobileMenu } from './components/MobileMenu'
import { currentUser } from '@clerk/nextjs/server'
import { syncUser } from '@/actions/user.actions';
import MobileMenuServer from '../followMobileComponent';
  
export async function Header(){
    const user = await currentUser();
    if (user) await syncUser();
    return(
        <header className={style.header}>
            <div className={style.title}>
                convexa
            </div>

            <DesktopMenu/>
            <MobileMenuServer/>

            {/* 
                <SignedOut>
                    <SignInButton mode='modal'>
                        <Button variant={"default"}>
                            Sign in
                        </Button>
                    </SignInButton>
                    <SignUpButton mode='modal'>
                        <Button variant={"secondary"}>
                            Sign up
                        </Button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <ModeToggle/>
            
            */}           
        </header>
    )
}