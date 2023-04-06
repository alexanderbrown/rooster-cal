import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image'
import { useState } from 'react';

import googleSigninImage from '../../../public/btn_google_signin_light_normal_web.png'
import googleSigninImagePressed from '../../../public/btn_google_signin_light_pressed_web.png'


export default function Login() {
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
                        <h3 className='text-lg'> {data.user? `${data.user.name}` : 'Unknown User'}</h3>
                        <h3 className='text-sm pb-1'> {data.user? `${data.user.email}` :''}</h3>
                    </div>
            </div>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full mb-1' onClick={() => signOut()}>
                Sign out
            </button>
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
        <div className='mr-2'>
            {content}
        </div>   
    )
}