import Head from 'next/head'
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import 'react-tooltip/dist/react-tooltip.css'

import ConfigForm from '@/components/forms/ConfigForm';
import Login from '@/components/forms/Login';
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main>
        <div>
          <nav className='flex flex-row-reverse items-center flex-wrap bg-blue-100 p-1 '>
              <Login />
          </nav>
          <div className="w-full min-h-screen bg-gray-100" >
            {(status==='authenticated') && 
              <>
                {(isAllowedUser===true) && <ConfigForm /> }
                {(isAllowedUser===false) && <NotAllowed /> }
                {(isAllowedUser===undefined) && <h3 className='ml-10 mt-4 text-lg text-slate-800'> Loading... please wait</h3> }
              </>
            }
            {(status!=='authenticated') &&
              <Welcome />
            }
          </div>

        </div>
      </main>
    </>
  )
}