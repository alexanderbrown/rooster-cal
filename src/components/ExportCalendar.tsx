import copy from 'copy-to-clipboard';
import { google } from "@/assets/icons"
import { useState } from 'react';

export default function ExportCalendar({calendar_id}: {calendar_id: string}){

    const copyButtonTextOptions = ['Copy Calendar Link', 'Copied']
    const copyButtonBackgroundColor = ['bg-gray-50', 'bg-green-200']
    const [copyButtonState, setCopyButtonState] = useState(0)

    const calendar_url = `${window.location.host}/api/calendar/${calendar_id}.ics`

    return(
        <div className="bg-white shadow-md rounded px-8 py-6 my-4">
            <a className='bg-gray-50 border shadow-md hover:shadow-lg p-4 rounded hover:bg-white cursor-pointer'
                href={`https://calendar.google.com/?cid=webcal://${calendar_url}`} target='_blank'>
                {google} Add To Google
            </a>
            <a className={`${copyButtonBackgroundColor[copyButtonState]} transition-all duration-200
                            border shadow-md hover:shadow-lg p-4 rounded hover:bg-white cursor-pointer ml-4`} 
                onClick={() => {
                    copy(`${window.location.protocol}//${calendar_url}`)
                    setCopyButtonState(1)
                    setTimeout(()=>setCopyButtonState(0), 5000)}}>
                {copyButtonTextOptions[copyButtonState]} 
            </a>
        </div>
    )
}