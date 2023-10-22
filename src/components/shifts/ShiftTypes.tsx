import { Dispatch, SetStateAction, useState } from 'react'

import * as types from '@/types'
import ShiftChip from './ShiftChip'
import AddShiftButton from './AddShiftButton'
import EditShiftType from './EditShiftType'

interface ShiftTypesProps {
    shifts?: types.Shift[], 
    setRota: Dispatch<SetStateAction<types.Rota | undefined>>, 
}

export default function ShiftTypes(props: ShiftTypesProps){
    const [editShiftMode, setEditShiftMode] = useState<'Add' | 'Update'>('Add')
    const [editShiftVisible, setEditShiftVisibility] = useState(false)
    const [editShiftInfo, setEditShiftInfo] = useState<types.Shift>(types.BLANKSHIFT)


    async function removeShift(shift: types.Shift){
        console.log(JSON.stringify(shift));
        const res = await fetch(`/api/shifts/${shift._id}`, {
            method: 'DELETE',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(shift)
        })
        console.log('res', res)
        if (res.status===200){
            props.setRota(prev => {if (prev) return {...prev, shifts: prev.shifts.filter(item => item !== shift)}})
        }
    }

    return (
        <div className='group flex overflow-hidden'>
            <div className={`w-full bg-slate-50 p-6 rounded-md shadow flex flex-col space-y-2 border border-slate-200 
                            shrink-0 duration-300
                            ${editShiftVisible? ' -translate-x-full': ''}`}>
                {props.shifts && props.shifts.map(shift=> {
                    return <ShiftChip key={shift.string} 
                                    {...{shift, removeShift, setEditShiftInfo, setEditShiftVisibility, setEditShiftMode}}/>
                    })}
                <span />
                <AddShiftButton {...{setEditShiftMode, setEditShiftVisibility}}/>
            </div>
            <EditShiftType {...{editShiftMode, editShiftInfo, setEditShiftInfo, setEditShiftVisibility, editShiftVisible}}
                            setRota={props.setRota}/>
        </div>
    )
}
