import Head from 'next/head'
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import 'react-tooltip/dist/react-tooltip.css'

import ConfigForm from '@/components/forms/ConfigForm';
import LoginBar from '@/components/forms/LoginBar';
import NotAllowed from '@/components/forms/NotAllowed';
import Welcome from '@/components/forms/Welcome';

export default function Home() {
  const { data, status } = useSession();
  const [isAllowedUser, setIsAllowedUser] = useState<boolean | undefined>(undefined)

    useEffect(() => {
      const checkAllowed = async (email: string) => {
        const res = await fetch (`/api/allowed-users/${email}`)
        setIsAllowedUser(res.status===200)
      }

    if (data && data.user?.email){
        checkAllowed(data.user.email)
    } else {
        setIsAllowedUser(false)
    }
    }, [data])

  return (
    <>
      <Head>
        <title>Rooster-Calendar</title>
        <meta name="description" content="ICS Export for Google Sheet Calendars" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/rooster.png" type="image/png" />
      </Head>
      <main>
        <div className='min-h-screen bg-gray-100 flex flex-col justify-center'>
          <LoginBar />
          {(status==='authenticated') && 
            <div className="w-full flex-1">
              {(isAllowedUser===true) && <ConfigForm /> }
              {(isAllowedUser===false) && <NotAllowed /> }
              {(isAllowedUser===undefined) && <h3 className='ml-10 mt-4 text-lg text-slate-800'> Loading... please wait</h3> }
            </div>
          }
          {(status!=='authenticated') &&
            <div className="w-full flex-1 flex justify-center" >
              <Welcome />
            </div>
          }
          <footer className='flex flex-col justify-center items-center'>
              <p className="text-xs"><a href="https://www.flaticon.com/free-icons/rooster" title="rooster icons">Rooster icons created by Smashicons - Flaticon</a></p>
          </footer>
        </div>
      </main>
    </>
  )
}