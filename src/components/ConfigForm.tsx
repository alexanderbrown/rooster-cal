import { ChangeEvent, useState, useEffect } from "react"

import * as types from "@/types"
import ShiftTypes from "./shifts/ShiftTypes"
import EditShiftType from "./shifts/EditShiftType"
import Label from "./forms/Label"
import Input from "./forms/Input"
import Link from "next/link"

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

    const setShifts = {}

    return (
        <div className="flex justify-center items-end pt-2 ">
            <div className="w-full max-w-xl">
                <form action="/send-data-here" method="post" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <Label htmlFor="spreadsheet">Google Sheet ID</Label>
                    <Input name="spreadsheet" type="text" value={rota?.spreadsheet} onChange={handleChange} />
                    <Label htmlFor="sheet">Sheet</Label>
                    <Input name="sheet" type="text" value={rota?.sheet} onChange={handleChange} />
                    <Label htmlFor="dates_column">Dates Column</Label>
                    <Input name="dates_column" type="text" value={rota?.dates_column} onChange={handleChange} />
                    <Label htmlFor="date_format">Date Format</Label>
                    <Input name="date_format" type="text" value={rota?.date_format} onChange={handleChange} />
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
                <Link href={`/api/calendar/${rota?.calendar_id}`}
                      className='underline text-blue-700'> Calendar Link </Link>
            </div>
            
            {editShiftVisible && <EditShiftType mode={editShiftMode}  
                                                info={editShiftInfo}
                                                setInfo={setEditShiftInfo}
                                                setVisible={setEditShiftVisible}
                                                setRota={setRota}/>}
        </div>
    )
}
