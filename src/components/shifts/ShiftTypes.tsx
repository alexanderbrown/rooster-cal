import { Dispatch, SetStateAction } from 'react'

import * as types from '@/types'
import ShiftChip from './ShiftChip'

export default function ShiftTypes({shifts, setRota, setEditShiftVisibility, setEditShiftMode, setEditShiftInfo}: 
    {shifts?: types.Shift[], 
     setRota: Dispatch<SetStateAction<types.Rota | undefined>>, 
     setEditShiftVisibility: Dispatch<SetStateAction<boolean>>, 
     setEditShiftMode: Dispatch<SetStateAction<"Add" | "Update">>, 
     setEditShiftInfo: Dispatch<SetStateAction<types.Shift>>}){

    async function removeShift(shift: types.Shift){
    
        const res = await fetch('/api/shifts', {
            method: 'DELETE',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(shift)
        })
        if (res.status===200){
            setRota(prev => {if (prev) return {...prev, shifts: prev.shifts.filter(item => item !== shift)}})
        }
    }

    return (
        <div className='w-full bg-slate-200 p-6 rounded-md shadow flex flex-col space-y-2'>
            {shifts && shifts.map(shift=> {
                return <ShiftChip key={shift.string}
                                shift={shift} 
                                removeShift={removeShift}
                                setEditShiftVisibility={setEditShiftVisibility}
                                setEditShiftMode={setEditShiftMode}
                                setEditShiftInfo={setEditShiftInfo} />
                })}
            <span></span>
            <div className= 'text-slate-800 border-slate-400 rounded-md w-fit py-1 px-4 border shadow-md text-md font-bold cursor-pointer hover:border-slate-400 hover:bg-slate-100 hover:shadow-lg'
                 onClick={() => {
                    setEditShiftMode("Add")
                    setEditShiftVisibility(prev => !prev)}
                    }> 
                Add
            </div>
        </div>
    )
}