import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image'
import { useState } from 'react';

import googleSigninImage from '../../../public/btn_google_signin_light_normal_web.png'
import googleSigninImagePressed from '../../../public/btn_google_signin_light_pressed_web.png'


export default function LoginBar() {
    const { data, status } = useSession();
    const [buttonImage, setButtonImage] = useState(googleSigninImage)
    let content; 
    if (status === 'loading') {
        content = <h3> Loading... please wait</h3>
    } else if (status === 'authenticated') {
      content = (
        <div className='flex flex-col w-fit  bg-blue-50 rounded-md border border-blue-400 px-2 py-1'>
            <div className='flex items-center'>
                <img className="rounded-full w-8 h-8" src={data.user?.image || ''} alt='User Image'/>
                <div className='flex flex-col p-2 pt-1'>
                    <h3 className='text-sm sm:text-base'> {data.user? `${truncateString(data.user.name, 18)}` : 'Unknown User'}</h3>
                    <h3 className='text-xs sm:text-sm pb-1'> {data.user? `${truncateString(data.user.email, 25)}` :''}</h3>
                </div>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full ml-2 text-sm sm:text-base' onClick={() => signOut()}>
                    Sign out
                </button>
            </div>
        </div>
      );
    } else {
        content = (
            <button onClick={() => signIn('google')}
                    onMouseDown={()=> setButtonImage(googleSigninImagePressed)}
                    onMouseUp={() => setButtonImage(googleSigninImage)}>
                <Image src={buttonImage} alt='Sign in With Google' height={48}/>
            </button>
        );
    }

    return (
        <nav className='flex justify-between items-center flex-wrap bg-blue-100 p-2 sticky top-0'>
            <img className='h-14' src='/rooster.png' />
            {content}
        </nav>
    )
}

function truncateString(str: string | undefined | null, maxLength: number) {
    if (!str) return str
    return str.length > maxLength ? str.substring(0, maxLength - 3) + "..." : str
}