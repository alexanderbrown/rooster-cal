import { ChangeEvent, useState, useEffect } from "react"

import { Tooltip } from 'react-tooltip'

import * as types from "@/types"
import ShiftTypes from "@/components/shifts/ShiftTypes"
import Label from "@/components/Label"
import Input from "@/components/Input"
import ExportCalendar from "@/components/ExportCalendar";

export default function ConfigForm() {
    const [rota, setRota] = useState<types.Rota>()

    // Get the user's rota config
    useEffect(() => {
        const fetchRotaConfig = async () => {
            const data = await fetch('/api/rota')
            return await data.json()
        }
        fetchRotaConfig().then( data => {
            setRota(data as types.Rota)
        })
    }, [])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRota(prev => {
            if (prev) {
                return {...prev, [event.target.name]: event.target.value}
            }
        });
        const payload={field: event.target.name, value: event.target.value}
        fetch('/api/rota', {method: 'POST', 
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload)})
    };

    const handleSpreadsheetChange = (event: ChangeEvent<HTMLInputElement>) => {
        const match = event.target.value.match('/d/(?<spreadsheet>[^/]*)')
        if (match && match.groups){
            event.target.value = match.groups.spreadsheet
        }
        handleChange(event)
    }

    return (
        <div className="flex justify-center items-end p-2 ">
            <div className="w-full max-w-xl">
                <div className="bg-white shadow-md rounded px-4 sm:px-10 pt-4 sm:pt-6 pb-8 mb-4">
                    <Label htmlFor="spreadsheet" >Google Sheet ID</Label>
                    <Input name="spreadsheet" type="text" value={rota?.spreadsheet} onChange={handleSpreadsheetChange}
                           tooltip_content="Paste the full URL of the rota Google Sheet<br />here and I'll convert it for you"/>
                    <Label htmlFor="sheet">Sheet</Label>
                    <Input name="sheet" type="text" value={rota?.sheet} onChange={handleChange} 
                           tooltip_content="The name of the tab within the Google Sheet<br />with your particular rota"/>
                    <Label htmlFor="dates_column">Dates Column</Label>
                    <Input name="dates_column" type="text" value={rota?.dates_column} onChange={handleChange}/>
                    <Label htmlFor="date_format">Date Format</Label>
                    <Input name="date_format" type="text" value={rota?.date_format} onChange={handleChange}
                           tooltip_content="Specify the date format, e.g. 'dd/MM/yyyy' or 'dd-MM-yy'" />
                    <Label htmlFor="shifts_column">Shifts Column</Label>
                    <Input name="shifts_column" type="text" value={rota?.shifts_column} onChange={handleChange} />
                    <Label htmlFor="start_row">Start Row</Label>
                    <Input name="start_row" type="number" value={rota?.start_row} onChange={handleChange} />
                    <Label htmlFor="end_row">End Row</Label>
                    <Input name="end_row" type="number" value={rota?.end_row} onChange={handleChange} />
                    <Label htmlFor="set_shifts">Shift Types for this rota</Label>
                    <ShiftTypes shifts={rota?.shifts} setRota={setRota}/>
                </div>
                <ExportCalendar calendar_id={rota?.calendar_id || ''}/>
            </div>
            <Tooltip id='my-tooltip' />
        </div>
    )
}
