import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

import * as types from '@/types'
import Label from "../Label";
import Input from "../Input";
import Checkbox from "../Checkbox";


export default function EditShiftType(
    {
        mode, // sets the function of the edit panel to add a new entry or update an existing one
        setVisible, // sets whether the panel is displayed
        info, // state for the controls in the panel
        setInfo, // update state for controls in the panel
        setRota //update the state of the parent Rota object (once database updated with changes)
    }: 
    {
        mode: 'Add' | 'Update', 
        setVisible: Dispatch<SetStateAction<boolean>>, 
        info: types.Shift, 
        setInfo: Dispatch<SetStateAction<types.Shift>>, 
        setRota: Dispatch<SetStateAction<types.Rota|undefined>>
    } 
    ){

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
            setRota(prev => {if (prev) return {...prev, shifts: [...prev.shifts, shift]}})
        }
    }

    async function updateShift(shift: types.Shift){
        const res = await fetch('/api/shifts', {
            method: 'PATCH',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(shift)
        })
        if (res.status===200){
            setRota(prev => {
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
    <>
        <div className="w-full max-w-md">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 my-4 ml-8">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <Label htmlFor="name">Shift Name</Label>
                    <Input type="text" name="name" onChange={handleChange} value={info.name}/>
                    <Label htmlFor="string">String to match</Label>
                    <Input type="text" name="string" onChange={handleChange} value={info.string}
                           tooltip_content="Entries on the sheet starting with this string will be matched to this shift<br><br>
                                            For example, if you set this to 'LD', this would match any <br>
                                            entry in the sheet that began with 'LD' such as 'LD - swapped in'.<br>
                                            If there is any extra information this will be copied in to the event. "/>
                    <Label htmlFor="allday">All Day?</Label>
                    <Checkbox name="allday" onChange={handleChange} checked={info.allday}/>
                    <Label disabled={info.allday} htmlFor="start">Start Time</Label>
                    <Input disabled={info.allday} type="time" name="start" onChange={handleChange} value={info.start}/>
                    <Label disabled={info.allday} htmlFor="duration">Duration (hours)</Label>
                    <Input disabled={info.allday} type="number" step={0.1} name="duration" onChange={handleChange} value={info.duration}/>

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
            </div>
        </div>
    </>
    )
}
