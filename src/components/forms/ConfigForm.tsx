import { ChangeEvent, useState, useEffect } from "react"

import { Tooltip } from 'react-tooltip'

import * as types from "@/types"
import ShiftTypes from "@/components/shifts/ShiftTypes"
import EditShiftType from "@/components/shifts/EditShiftType"
import Label from "@/components/Label"
import Input from "@/components/Input"
import ExportCalendar from "@/components/ExportCalendar";

export default function ConfigForm() {

    const [editShiftMode, setEditShiftMode] = useState<'Add' | 'Update'>('Add')
    const [editShiftVisible, setEditShiftVisible] = useState(false)
    const [editShiftInfo, setEditShiftInfo] = useState<types.Shift>(types.BLANKSHIFT)

    const [rota, setRota] = useState<types.Rota>()

    // Get the user's rota config
    useEffect(() => {
        const fetchRotaConfig = async () => {
            const data = await fetch('/api/rota')
            console.log(data)
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
        <div className="flex justify-center items-end pt-2 ">
            <div className="w-full max-w-xl">
                <ExportCalendar calendar_id={rota?.calendar_id || ''}/>
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <Label htmlFor="spreadsheet" >Google Sheet ID</Label>
                    <Input name="spreadsheet" type="text" value={rota?.spreadsheet} onChange={handleSpreadsheetChange}
                           tooltip_content="Paste the full URL of the rota Google Sheet here and I'll convert it for you"/>
                    <Label htmlFor="sheet">Sheet</Label>
                    <Input name="sheet" type="text" value={rota?.sheet} onChange={handleChange} 
                           tooltip_content="The name of the sheet within the Google Sheet with your particular rota"/>
                    <Label htmlFor="dates_column">Dates Column</Label>
                    <Input name="dates_column" type="text" value={rota?.dates_column} onChange={handleChange}/>
                    <Label htmlFor="date_format">Date Format</Label>
                    <Input name="date_format" type="text" value={rota?.date_format} onChange={handleChange}
                           tooltip_content="Specify the date format, e.g. 'dd/MM/yyyy' or 'dd-MM-yy'" />
                    <Label htmlFor="shifts_column">Shifts Column</Label>
                    <Input name="shifts_column" type="text" value={rota?.shifts_column} onChange={handleChange} />
                    <Label htmlFor="start_row">Start Row</Label>
                    <Input name="start_row" type="number" value={rota?.start_row} onChange={handleChange} />
                    <Label htmlFor="end_row">Start Row</Label>
                    <Input name="end_row" type="number" value={rota?.end_row} onChange={handleChange} />
                    <Label htmlFor="set_shifts">Shift Types for this rota</Label>
                    <ShiftTypes shifts={rota?.shifts} setRota={setRota} 
                                setEditShiftVisibility={setEditShiftVisible}
                                setEditShiftMode={setEditShiftMode}
                                setEditShiftInfo={setEditShiftInfo} />
                </form>
            </div>
            
            {editShiftVisible && <EditShiftType mode={editShiftMode}  
                                                info={editShiftInfo}
                                                setInfo={setEditShiftInfo}
                                                setVisible={setEditShiftVisible}
                                                setRota={setRota}/>}
            {/* <Tooltip id='my-tooltip' /> */}
        </div>
    )
}
