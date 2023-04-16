import copy from 'copy-to-clipboard';
import { google } from "@/assets/icons"
import { useState } from 'react';

export default function ExportCalendar({calendar_id}: {calendar_id: string}){

    const copyButtonTextOptions = ['Copy', 'Copied']
    const copyButtonBackgroundColor = ['bg-gray-50 hover:bg-white', 'bg-green-200']
    const [copyButtonState, setCopyButtonState] = useState(0)

    const calendar_url = `${window.location.host}/api/calendar/${calendar_id}.ics`

    return(
        <div className="bg-white shadow-md rounded px-2 sm:px-8 py-4 my-4 flex flex-wrap">
            <div className='mx-2 border rounded shadow-md hover:shadow-lg grow cursor-pointer bg-gray-50 group flex justify-between'>
                <a className={`p-4 h-12 sm:h-14 text-sm sm:text-base group-hover:bg-white
                                flex items-center grow justify-center`}
                    href={`${window.location.protocol}//${calendar_url}`}>
                                Open Rota
                </a>
                <a className={`${copyButtonBackgroundColor[copyButtonState]}
                                p-4 h-12 sm:h-14 text-sm sm:text-base
                                flex items-center justify-center border-l-2 w-14 sm:w-16 group-hover:bg-white `} 
                    onClick={() => {
                        copy(`${window.location.protocol}//${calendar_url}`)
                        setCopyButtonState(1)
                        setTimeout(()=>setCopyButtonState(0), 3000)}}>
                    {copyButtonTextOptions[copyButtonState]} 
                </a>
            </div>
            <a className='bg-gray-50 border shadow-md hover:shadow-lg p-4 h-12 sm:h-14 mx-2 grow rounded hover:bg-white cursor-pointer text-sm sm:text-base flex items-center justify-center'
                href={`https://calendar.google.com/?cid=webcal://${calendar_url}`} target='_blank'>
                <div className='w-max'>
                    {google} Add To Google
                </div>
            </a>
        </div>
    )
}