import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

import * as types from '@/types'
import Label from "../Label";
import Input from "../Input";
import Checkbox from "../Checkbox";

interface EditShiftTypeProps {
    editShiftMode: 'Add' | 'Update', 
    editShiftVisible: boolean
    setEditShiftVisibility: Dispatch<SetStateAction<boolean>>, 
    editShiftInfo: types.Shift, 
    setEditShiftInfo: Dispatch<SetStateAction<types.Shift>>, 
    setRota: Dispatch<SetStateAction<types.Rota|undefined>>
}

export default function EditShiftType(props: EditShiftTypeProps){

    const info = props.editShiftInfo
    const mode = props.editShiftMode
    const setInfo = props.setEditShiftInfo
    const setVisible = props.setEditShiftVisibility

    async function addShift(shift: types.Shift){
        if (shift.allday){
            delete shift.start
            delete shift.duration
        }
    
        const res = await fetch('/api/shifts', {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(shift)
        })
        if (res.status===200){
            props.setRota(prev => {if (prev) return {...prev, shifts: [...prev.shifts, shift]}})
        }
    }

    async function updateShift(shift: types.Shift){
        const res = await fetch('/api/shifts', {
            method: 'PATCH',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(shift)
        })
        if (res.status===200){
            props.setRota(prev => {
                if (prev) {
                    const allShiftsExceptThisOne = prev.shifts.filter(item => item._id.toString() !== shift._id)
                    return {...prev, shifts: [...allShiftsExceptThisOne, shift]}
                }})
        } 
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.type==='checkbox') {
            setInfo(prev => {return { ...prev, [event.target.name]: event.target.checked }});
        } else {
            setInfo(prev => {return { ...prev, [event.target.name]: event.target.value }});
        }
    };

    return (
    <form className={`bg-slate-50 shadow-md rounded px-8 pt-6 pb-8 mb-4 shrink-0 w-full duration-300
                      ${props.editShiftVisible? ' -translate-x-full': ''}`}>
            <Label htmlFor="name">Shift Name</Label>
            <Input type="text" name="name" onChange={handleChange} value={info.name}
                    tooltip_content='This will be the name of the event in your calendar'/>
            <Label htmlFor="string">String to match</Label>
            <Input type="text" name="string" onChange={handleChange} value={info.string}
                    tooltip_content="Entries to match to this shift type<br /><br />
                                    Example: 'LD' would match any entry that<br />
                                    begins with 'LD' such as 'LD - swapped in'.<br />
                                    Any extra information will be added to the event. "/>
            <Label htmlFor="allday">All Day?</Label>
            <Checkbox name="allday" onChange={handleChange} checked={info.allday}/>
            <Label disabled={info.allday} htmlFor="start">Start Time</Label>
            <Input disabled={info.allday} type="time" name="start" onChange={handleChange} value={info.allday? '' : info.start}/>
            <Label disabled={info.allday} htmlFor="duration">Duration (hours)</Label>
            <Input disabled={info.allday} type="number" step={0.1} name="duration" onChange={handleChange} value={info.allday? '' : info.duration}/>

            <div className="flex items-center justify-between mt-4">
                <button className="bg-gray-50 shadow-md border font-bold py-2 px-4 rounded focus:outline-none hover:shadow-lg hover:bg-white"
                        type="button" onClick={() => {
                        if (info.allday) {
                            setInfo({ ...info, start: undefined, duration:undefined })
                        }
                        if (mode==='Add'){
                            addShift(info)
                        } else if (mode==='Update'){
                            updateShift(info)
                        }
                        setInfo(types.BLANKSHIFT)
                        setVisible(false)
                    }}>
                    {mode}
                </button>
                <button className="bg-gray-300 shadow-md border font-bold py-2 px-4 rounded focus:outline-none  hover:bg-gray-200 hover:shadow-lg"
                        type="button" onClick={() => {
                        setInfo(types.BLANKSHIFT)
                        setVisible(false)
                    }}>
                    Cancel
                </button>
            </div>
        </form>
    )
}
