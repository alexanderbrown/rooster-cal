import { Dispatch, SetStateAction } from 'react'

interface AddShiftButtonProps {
    setEditShiftMode: Dispatch<SetStateAction<"Add" | "Update">>
    setEditShiftVisibility: Dispatch<SetStateAction<boolean>>
}

export default function AddShiftButton({setEditShiftMode, setEditShiftVisibility}: AddShiftButtonProps){
    return (
        <div className={`font-bold cursor-pointer rounded-md w-fit py-1 px-4 border shadow-md text-md 
                         text-slate-800 border-slate-400 hover:border-slate-400 hover:bg-white hover:shadow-lg`}
                onClick={() => {
                setEditShiftMode("Add")
                setEditShiftVisibility(prev => !prev)}
                }> 
            Add
        </div>
    )
}