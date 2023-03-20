import Head from 'next/head'
import { useSession, signIn, signOut } from 'next-auth/react';
import Main from '@/components/main';

// import { IUser, User } from '@/data/models/User'
// import dbConnect from '@/data/lib/connect'

// export default function Home({users}: {users: IUser[]}) {
export default function Home() {
  return (
    <>
      <Head>
        <title>Rooster-Calendar</title>
        <meta name="description" content="ICS Export for Google Sheet Calendars" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <Main />
          {/* <ul className='list-disc'>
            {users.map(user => <li key={user.email}>{user.email}</li>)}
          </ul> */}
        </div>
      </main>
    </>
  )
}

// export async function getServerSideProps() {
//   await dbConnect()

//   const result = await User.find({})
//   const users = result.map((doc) => {
//     let user = doc.toObject()
//     user._id = user._id.toString()
//     return user
//   })

//   return { props: { users } }

// }