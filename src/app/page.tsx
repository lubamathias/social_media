import { getPosts } from '@/actions/post.action';
import PostCard from '@/components/postCard';
import { CreatePost } from '@/components/createPost';
import FollowCard from '@/components/followCard';
import { ModeToggle } from '@/components/ModeToggle';
import { Avatar } from '@/components/ui/avatar';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { auth, currentUser } from '@clerk/nextjs/server';
import Image from "next/image";
import { getDbUserId } from '@/actions/user.actions';



export default async function Home() {
  const user = await currentUser()
  const posts = await getPosts()
  const dbUserId = await getDbUserId()

  console.log({posts})
  
  return (

    <main className='grid grid-cols-1 lg:grid-cols-10 gap-6'>

      {user? (
        <>
          <div className='lg:col-span-6'>
            <div className='mb-2'>
              <CreatePost/>
            </div>
            {posts.length > 0 ? (
              <div className='flex justify-center items-center gap-2 flex-col'>
                {posts?.map((post) => (
                  <PostCard key={post.id} post={post} dbUserId={dbUserId}/>
                ))}
              </div>

            ): (
              <div className='w-full flex flex-col items-center justify-center mt-4 indent-2'>
                <div>
                  <h2>Olá {user.firstName}! Bem vindo ao <span className='font-[var(--font-tektur)] text-[#0bafb4]'>convexa</span>. Para ver os posts você precisa fazer novas conexôes!</h2>
                  <h3>Caso esteja no celular, só clicar no menu e "sugestões"</h3>
                </div>
                <div className='flex align-center justify-center mt-4'>
                  <Image
                    src='/images/neilPatrick.gif'
                    alt='Neil Patrick Gif'
                    width={400}
                    height={400}
                  />
                </div>
              </div>
            )}
          </div>
          <div className='hidden lg:block lg:col-span-4'>
            <FollowCard/>
          </div>
        </>
        
      ): ( null
        /*
        <div className='hidden lg:block lg:col-span-10 flex justify-center'>
          <Image 
          src="/images/convexaLogo.png"
          alt='Main Image'
          width={500}
          height={500}
          />
        </div> */
      )}



    </main>
  );
}
