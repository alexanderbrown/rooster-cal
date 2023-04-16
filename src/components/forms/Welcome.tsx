export default function Welcome () {
    return (
        <div className="flex flex-col items-center px-4">
            <h1 className="text-2xl sm:text-3xl text-blue-800 mt-4">Welcome to Rooster!</h1>
            <HeaderAndText header="What is this?">
                Rooster reads a rota from a Google Sheet and converts it in to a calendar subscription you can add as a subcription in Apple or Google Calendar apps. No more having to manually put your rota in to your calendar! Best of all, the calendar will be automatically updated if your shifts change. \n
                To get started, please log in with Google above and configure the app. \n 
                You&aposll need to enter the URL (web address) of the sheet, some information about where to find your line on the sheet and what times the particular shifts are. Don&apost worry, it&aposs easy, promise :D
            </HeaderAndText>
            <HeaderAndText header="What information does Rooster collect?">
                Rooster needs your Google login so that it can access your rota sheet. By logging in, you grant permission for the app to access the specified Sheet on your behalf. This access is read only. \n
                Rooster will never use your access for any other purpose. \n
            </HeaderAndText>
            <p className="text-sm my-4 max-w-xl">Please note, Rooster is currently in beta mode, and is invite only. Please contact Alex if you would like to give it a go</p>
        </div>
    )
}

function HeaderAndText(props: {children: string, header: string}) {
    return (
        <div className="flex flex-col items-center" key={props.header}>
            <h2 className="text-xl sm:text-2xl mt-8 text-slate-800">{props.header}</h2>
            <div className="flex flex-col items-start">
            {props.children.split('\\n').map(child => {
                return <p key={child} className="max-w-xl my-2 text-slate-800 text-sm sm:text-base">{child.replaceAll("&apos", "'")}</p>
            })}
            </div>
        </div>
    )
}