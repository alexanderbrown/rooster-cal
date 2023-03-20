import Head from 'next/head'

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
          <p className='bg-slate-800 text-stone-50'>Hello World</p>
        </div>
      </main>
    </>
  )
}
