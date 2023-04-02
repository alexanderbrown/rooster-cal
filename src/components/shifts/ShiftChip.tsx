import {DateTime} from 'luxon'
import {FaRegMoon} from 'react-icons/fa'

import * as types from '@/types'
import { Dispatch, SetStateAction } from 'react'

export default function ShiftChip({shift, removeShift, setEditShiftVisibility, setEditShiftMode, setEditShiftInfo}: 
                                  {shift: types.Shift, 
                                   removeShift: (shiftToRemove:types.Shift)=>void, 
                                   setEditShiftInfo: Dispatch<SetStateAction<types.Shift>>,
                                   setEditShiftVisibility: Dispatch<SetStateAction<boolean>>, 
                                   setEditShiftMode: Dispatch<SetStateAction<"Add" | "Update">>}){
    const startTime = DateTime.fromISO(`1970-01-01T${shift.start?.replace('.', ':')}`)
    const endTime = startTime.plus({hours: shift.duration}) 
    const overnight = endTime.day!==1

    const displayString = ` (${shift.string}) `

    let chipColor ='bg-slate-200 border-slate-400 text-slate-800'
    if (shift.allday) {
        chipColor = 'bg-blue-400 bg-blue-500 text-white'
    } else if (overnight) {
        chipColor = 'bg-blue-900 border-blue-900 text-white'
    }

    return (
        <div className= {chipColor + ' rounded-lg w-full py-1 px-4 min-w-[10rem] border flex flex-row justify-between items-center shadow-md cursor-default'} 
             onClick={()=>{
                setEditShiftVisibility(prev => {
                    setEditShiftInfo(shift)
                    setEditShiftMode("Update")
                    return !prev
                })
            }}> 
            <div>
            <span className="text-sm font-bold min-w-[2rem]">{shift.name}</span> <code>{displayString}</code>
            </div>
            {!shift.allday && 
                <div>
                    <span className="text-sm pl-2">
                        {startTime.toLocaleString(DateTime.TIME_24_SIMPLE)}-{endTime.toLocaleString(DateTime.TIME_24_SIMPLE)}
                    </span>
                {overnight && <FaRegMoon color='white' className='pl-1 inline'/>}
                </div>
            }
            <span className="text-sm pl-2 cursor-pointer" onClick={(e)=>{
                e.stopPropagation()
                removeShift(shift)}
            }>x</span>
        </div>
    )
}