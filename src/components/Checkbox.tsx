import { ChangeEvent } from "react"

interface InputProps{
    name: string,
    checked: boolean,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    disabled?: boolean
    step?: number
}

export default function Checkbox({name, checked, onChange, disabled=false}: InputProps){
    return <input id={name} name={name}
                  type='checkbox'        
                  checked={checked} 
                  disabled={disabled}
                  onChange={onChange}/>
}